"""Fetch daily food prices from PIHPS Bank Indonesia into public/data/prices.json.

Usage:
    python scripts/fetch-prices.py              # last 3 days, overwrite old data
    python scripts/fetch-prices.py --backfill 30
    python scripts/fetch-prices.py --dry-run    # fetch and validate, write nothing
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any

import requests

BASE = "https://www.bi.go.id/hargapangan/WebSite/Home"
HEADERS = {
    "X-Requested-With": "XMLHttpRequest",
    "Referer": "https://www.bi.go.id/hargapangan",
    "User-Agent": "Mozilla/5.0 (compatible; PalredBot/1.0; +https://palred.vercel.app)",
}
OUTPUT = Path(__file__).resolve().parent.parent / "public" / "data" / "prices.json"
SOURCE = "PIHPS Bank Indonesia (pasar tradisional)"
REQUEST_DELAY = 1.0
MAX_DAILY_CHANGE = 0.30
MIN_COMPLETENESS = 0.5
MAX_SPIKED_SHARE = 0.20
JAKARTA = timezone(timedelta(hours=7))  # no DST, avoids needing tzdata on Windows

# key -> (PIHPS ID, name that must match both GetCommoditiesTree and the response).
# All 29 sub-IDs shown on bi.go.id/hargapangan, so the UI can choose variants later.
COMMODITIES: dict[str, tuple[str, str]] = {
    "beras-bawah-1": ("1_1", "Beras Kualitas Bawah I"),
    "beras-bawah-2": ("1_2", "Beras Kualitas Bawah II"),
    "beras-medium-1": ("1_3", "Beras Kualitas Medium I"),
    "beras-medium-2": ("1_4", "Beras Kualitas Medium II"),
    "beras-super-1": ("1_5", "Beras Kualitas Super I"),
    "beras-super-2": ("1_6", "Beras Kualitas Super II"),
    "daging-ayam": ("2_7", "Daging Ayam Ras Segar"),
    "daging-sapi-1": ("3_8", "Daging Sapi Kualitas 1"),
    "daging-sapi-2": ("3_9", "Daging Sapi Kualitas 2"),
    "telur-ayam": ("4_10", "Telur Ayam Ras Segar"),
    "bawang-merah": ("5_11", "Bawang Merah Ukuran Sedang"),
    "bawang-putih": ("6_12", "Bawang Putih Ukuran Sedang"),
    "cabai-merah-besar": ("7_13", "Cabai Merah Besar"),
    "cabai-merah-keriting": ("7_14", "Cabai Merah Keriting"),
    "cabai-rawit-hijau": ("8_15", "Cabai Rawit Hijau"),
    "cabai-rawit-merah": ("8_16", "Cabai Rawit Merah"),
    "minyak-curah": ("9_17", "Minyak Goreng Curah"),
    "minyak-kemasan-1": ("9_18", "Minyak Goreng Kemasan Bermerk 1"),
    "minyak-kemasan-2": ("9_19", "Minyak Goreng Kemasan Bermerk 2"),
    "gula-premium": ("10_20", "Gula Pasir Kualitas Premium"),
    "gula-lokal": ("10_21", "Gula Pasir Lokal"),
}

EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
ID_MONTHS = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "mei": 5, "jun": 6,
    "jul": 7, "agu": 8, "agt": 8, "sep": 9, "okt": 10, "nov": 11, "nop": 11, "des": 12,
}


class FetchError(Exception):
    pass


def request_json(url: str, params: dict[str, Any] | None = None) -> Any:
    last: Exception | None = None
    for attempt in range(5):
        try:
            res = requests.get(url, params=params, headers=HEADERS, timeout=30)
            res.raise_for_status()
            return res.json()
        except (requests.RequestException, ValueError) as exc:
            last = exc
            if attempt < 4:
                time.sleep(5 * 2**attempt)
    raise FetchError(f"{url} failed after 5 attempts: {last}")


def verify_ids() -> None:
    tree = request_json(f"{BASE}/GetCommoditiesTree")["data"]
    names = {n["TreeID"]: n["TreeName"].strip() for n in tree}
    bad = [
        f"{key}: id {cid} is '{names.get(cid)}', expected '{name}'"
        for key, (cid, name) in COMMODITIES.items()
        if names.get(cid) != name
    ]
    if bad:
        raise FetchError("Commodity ID mismatch:\n  " + "\n  ".join(bad))


def format_request_date(d: date) -> str:
    return f"{EN_MONTHS[d.month - 1]} {d.day}, {d.year}"


def parse_response_date(text: str) -> str:
    day, mon, yy = text.split()
    return date(2000 + int(yy), ID_MONTHS[mon.lower()], int(day)).isoformat()


def fetch_day(key: str, d: date) -> tuple[str, dict[str, Any]] | None:
    cid, name = COMMODITIES[key]
    params = {
        "tanggal": format_request_date(d),
        "commodity": cid,
        "priceType": 1,
        "isPasokan": 1,
        "jenis": 1,
        "periode": 1,
        "provId": 0,
        "_": int(time.time() * 1000),
    }
    rows = request_json(f"{BASE}/GetGridData1", params)["data"]
    if not rows:
        return None
    provinces: dict[str, Any] = {}
    dates: set[str] = set()
    national: float | None = None
    for row in rows:
        if row["Komoditas"].strip() != name:
            raise FetchError(f"{key}: response commodity '{row['Komoditas']}' != '{name}'")
        value = row["Nilai"]
        if value is None:
            continue
        if value <= 0:
            raise FetchError(f"{key} {row['Provinsi']} {row['Tanggal']}: price {value} <= 0")
        dates.add(parse_response_date(row["Tanggal"]))
        provinces[str(row["ProvID"])] = {"name": row["Provinsi"], "value": value}
        national = row["SemuaProvinsi"]
    if not provinces:
        return None
    if len(dates) != 1:
        raise FetchError(f"{key}: mixed dates in one response: {sorted(dates)}")
    return dates.pop(), {"national": national, "provinces": provinces}


def drop_partial_dates(series: dict[str, dict[str, Any]], key: str) -> None:
    # PIHPS publishes a day gradually: 14 Okt 2026 had 2 provinces, and its "national"
    # average was computed from those 2 only. Such days are unusable until complete.
    if not series:
        return
    most = max(len(v["provinces"]) for v in series.values())
    for date_key in [d for d, v in series.items() if len(v["provinces"]) < most * MIN_COMPLETENESS]:
        print(f"  {key} {date_key}: only {len(series[date_key]['provinces'])}/{most} provinces, skipped")
        del series[date_key]


def check_daily_changes(series: dict[str, dict[str, Any]], key: str) -> None:
    # One province can spike for real (chili markets are volatile), so that only warns.
    # Fail when the national average jumps or when many provinces spike together.
    ordered = sorted(series)
    for prev, cur in zip(ordered, ordered[1:]):
        old_nat, new_nat = series[prev]["national"], series[cur]["national"]
        if old_nat and new_nat and abs(new_nat - old_nat) / old_nat > MAX_DAILY_CHANGE:
            raise FetchError(f"{key}: national average {old_nat} ({prev}) -> {new_nat} ({cur}) changes more than {MAX_DAILY_CHANGE:.0%}")
        spiked = []
        for pid, entry in series[cur]["provinces"].items():
            old = series[prev]["provinces"].get(pid)
            if old and abs(entry["value"] - old["value"]) / old["value"] > MAX_DAILY_CHANGE:
                spiked.append(f"{entry['name']} {old['value']:.0f}->{entry['value']:.0f}")
        if spiked:
            print(f"  WARN {key} {cur}: {len(spiked)} province(s) changed >{MAX_DAILY_CHANGE:.0%}: {', '.join(spiked)}")
        if len(spiked) > MAX_SPIKED_SHARE * len(series[cur]["provinces"]):
            raise FetchError(f"{key} {cur}: {len(spiked)} of {len(series[cur]['provinces'])} provinces changed more than {MAX_DAILY_CHANGE:.0%}")


def load_existing() -> dict[str, Any]:
    if OUTPUT.exists():
        return json.loads(OUTPUT.read_text(encoding="utf-8"))
    return {"prices": {}}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--backfill", type=int, metavar="DAYS")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    sys.stdout.reconfigure(line_buffering=True)  # stream progress when piped to a file or CI log

    today = datetime.now(JAKARTA).date()
    if args.backfill:
        # Weekend requests only return Friday data, so skip them.
        days = [today - timedelta(n) for n in range(args.backfill)]
        days = [d for d in days if d.weekday() < 5]
    else:
        days = [today - timedelta(n) for n in range(3)]

    try:
        verify_ids()
        print(f"ID check OK: all {len(COMMODITIES)} commodities match GetCommoditiesTree")
        existing = load_existing()
        prices: dict[str, dict[str, Any]] = {k: dict(v) for k, v in existing.get("prices", {}).items()}

        for key in COMMODITIES:
            series = prices.setdefault(key, {})
            for d in days:
                time.sleep(REQUEST_DELAY)
                got = fetch_day(key, d)
                if got is None:
                    print(f"  {key} {d}: no data")
                    continue
                date_key, entry = got
                # Overwrite, but never lose provinces already stored for that date.
                merged = {**series.get(date_key, {}).get("provinces", {}), **entry["provinces"]}
                series[date_key] = {"national": entry["national"], "provinces": merged}
            drop_partial_dates(series, key)
            if not series:
                raise FetchError(f"{key}: no data at all")
            check_daily_changes(series, key)
            latest = max(series)
            print(f"  {key}: {len(series)} dates, latest {latest}, {len(series[latest]['provinces'])} provinces")
    except FetchError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        print("prices.json left untouched.", file=sys.stderr)
        return 1

    if prices == existing.get("prices"):
        print("no new data, prices.json unchanged")
        return 0

    output = {
        "updatedAt": datetime.now(JAKARTA).isoformat(timespec="seconds"),
        "source": SOURCE,
        "commodities": {k: {"id": cid, "name": name} for k, (cid, name) in COMMODITIES.items()},
        "prices": {k: dict(sorted(v.items())) for k, v in prices.items()},
    }
    if args.dry_run:
        print("dry run, nothing written")
        return 0
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {OUTPUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
