import { createContext, useContext, useEffect, useRef, useState } from 'react'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

// Satu baris papan = satu kategori. Varian default masih ASUMSI (lihat CLAUDE.md), belum divalidasi ke UMKM.
export const PRICE_GROUPS = [
  { id: 'beras', cat: 'Sembako', icon: 'beras', defaultKey: 'beras-medium-1', keys: ['beras-bawah-1', 'beras-bawah-2', 'beras-medium-1', 'beras-medium-2', 'beras-super-1', 'beras-super-2'] },
  { id: 'daging-ayam', cat: 'Protein', icon: 'ayam', defaultKey: 'daging-ayam', keys: ['daging-ayam'] },
  { id: 'daging-sapi', cat: 'Protein', icon: 'daging', defaultKey: 'daging-sapi-1', keys: ['daging-sapi-1', 'daging-sapi-2'] },
  { id: 'telur-ayam', cat: 'Protein', icon: 'telur', defaultKey: 'telur-ayam', keys: ['telur-ayam'] },
  { id: 'bawang-merah', cat: 'Bumbu', icon: 'bawang', defaultKey: 'bawang-merah', keys: ['bawang-merah'] },
  { id: 'bawang-putih', cat: 'Bumbu', icon: 'bawangPutih', defaultKey: 'bawang-putih', keys: ['bawang-putih'] },
  { id: 'cabai-merah', cat: 'Bumbu', icon: 'cabai', defaultKey: 'cabai-merah-keriting', keys: ['cabai-merah-keriting', 'cabai-merah-besar'] },
  { id: 'cabai-rawit', cat: 'Bumbu', icon: 'cabai', defaultKey: 'cabai-rawit-merah', keys: ['cabai-rawit-merah', 'cabai-rawit-hijau'] },
  { id: 'minyak', cat: 'Sembako', icon: 'minyak', defaultKey: 'minyak-curah', keys: ['minyak-curah', 'minyak-kemasan-1', 'minyak-kemasan-2'] },
  { id: 'gula', cat: 'Sembako', icon: 'gula', defaultKey: 'gula-lokal', keys: ['gula-lokal', 'gula-premium'] },
]

export const formatTanggal = (iso, withYear = true) => {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]}${withYear ? ` ${y}` : ''}`
}

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

export const formatHari = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
}

// Waktu bot terakhir mengecek PIHPS, selalu dalam zona Asia/Jakarta. Mengembalikan null kalau updatedAt kosong atau rusak.
export const formatWaktu = (iso, withYear = true) => {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return null
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(t)
      .map((x) => [x.type, x.value]),
  )
  return `${Number(p.day)} ${MONTHS[Number(p.month) - 1]}${withYear ? ` ${p.year}` : ''}, ${p.hour}.${p.minute} WIB`
}

// Tanggal terbaru sering baru terisi sebagian provinsi, jadi "terbaru" = tanggal terbaru yang cukup lengkap.
const COMPLETE_RATIO = 0.9

function analyze(data) {
  const counts = {}
  const provinces = {}
  for (const byDate of Object.values(data.prices)) {
    for (const [date, entry] of Object.entries(byDate)) {
      const ids = Object.keys(entry.provinces)
      counts[date] = Math.max(counts[date] ?? 0, ids.length)
      for (const id of ids) provinces[id] = entry.provinces[id].name
    }
  }
  const dates = Object.keys(counts).sort()
  const maxCount = Math.max(...Object.values(counts))
  const latest = [...dates].reverse().find((d) => counts[d] >= maxCount * COMPLETE_RATIO) ?? dates.at(-1)
  const idx = dates.indexOf(latest)
  return {
    dates,
    latest,
    previous: idx > 0 ? dates[idx - 1] : null,
    partialNewer: dates.slice(idx + 1).map((date) => ({ date, count: counts[date] })),
    totalProvinces: maxCount,
    provinces: Object.entries(provinces)
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'id')),
  }
}

// provId kosong = rata-rata nasional. Mengembalikan undefined kalau tidak ada data.
export const valueAt = (data, key, date, provId) => {
  const entry = data.prices[key]?.[date]
  if (!entry) return undefined
  return provId ? entry.provinces[provId]?.value : entry.national
}

export const seriesUntil = (data, key, upTo, provId) =>
  Object.keys(data.prices[key] ?? {})
    .sort()
    .filter((date) => date <= upTo)
    .map((date) => ({ date, value: valueAt(data, key, date, provId) }))
    .filter((p) => p.value != null)

// Patokan harga terbaru yang sudah lengkap. Provinsi tanpa data jatuh ke rata-rata nasional, dan fallback ditandai.
export const referencePrice = (data, meta, key, provName) => {
  const provId = meta.provinces.find((p) => p.name === provName)?.id
  const prov = provId ? valueAt(data, key, meta.latest, provId) : undefined
  if (prov != null) return { value: prov, fallback: false }
  const national = valueAt(data, key, meta.latest, '')
  return national != null ? { value: national, fallback: provId != null || provName != null } : null
}

// Data harian PIHPS hanya terbit di hari kerja, jadi Jumat -> Selasa pagi masih wajar (4 hari).
const STALE_AFTER_DAYS = 4

export const daysSince = (iso) => {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date())
  return Math.round((Date.parse(today) - Date.parse(iso)) / 86400000)
}

export const isStale = (iso) => daysSince(iso) > STALE_AFTER_DAYS

export const PriceDataContext = createContext({ status: 'loading', retry: () => {} })

export const usePriceData = () => useContext(PriceDataContext)

const REFRESH_AFTER_MS = 60 * 60 * 1000

const toState = (data) => {
  const empty = !data?.prices || !Object.values(data.prices).some((byDate) => Object.keys(byDate).length > 0)
  return empty ? { status: 'empty' } : { status: 'ready', data, meta: { ...analyze(data), checkedAt: data.updatedAt ?? null } }
}

const loadPrices = (signal) =>
  fetch('/data/prices.json', { signal }).then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  })

export function useFetchPriceData() {
  const [state, setState] = useState({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  const fetchedAt = useRef(0)

  useEffect(() => {
    const ctrl = new AbortController()
    loadPrices(ctrl.signal)
      .then((data) => {
        fetchedAt.current = Date.now()
        setState(toState(data))
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error' })
      })
    return () => ctrl.abort()
  }, [attempt])

  // Tab dibiarkan terbuka berjam-jam: ambil ulang diam-diam saat tab aktif lagi. Gagal tidak mengganti data yang sudah tampil.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible' || Date.now() - fetchedAt.current < REFRESH_AFTER_MS) return
      loadPrices()
        .then((data) => {
          fetchedAt.current = Date.now()
          const next = toState(data)
          if (next.status === 'ready') setState(next)
        })
        .catch(() => {})
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  const retry = () => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }

  return { ...state, retry }
}
