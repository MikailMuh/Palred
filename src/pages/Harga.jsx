import { useState } from 'react'
import { Produce, Sparkline } from '../components/Art.jsx'
import CekHarga from '../components/CekHarga.jsx'
import { angka } from '../data.js'
import { PRICE_GROUPS, daysSince, formatTanggal, isStale, seriesUntil, usePriceData, valueAt } from '../prices.js'

const CATEGORIES = ['Semua', 'Bumbu', 'Protein', 'Sembako']

const persen = (n) => Math.abs(n).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function Harga() {
  const state = usePriceData()

  return (
    <section className="container page">
      <header className="page-head">
        <span className="eyebrow">Billboard Harga</span>
        <h1>Harga pangan pasar tradisional per provinsi</h1>
        <p className="muted">Patokan rata-rata harga di pasar tradisional tiap provinsi. Sumber: PIHPS Bank Indonesia.</p>
      </header>

      {state.status === 'loading' && <p role="status" className="muted">Memuat data harga…</p>}
      {state.status === 'error' && (
        <div role="alert" className="card pad status-box">
          <strong>Data harga gagal dimuat.</strong>
          <p className="muted small">Cek koneksi internetmu, lalu coba lagi.</p>
          <button className="btn ghost" onClick={state.retry}>Muat ulang data harga</button>
        </div>
      )}
      {state.status === 'empty' && (
        <div role="status" className="card pad status-box">
          <strong>Belum ada data harga.</strong>
          <p className="muted small">Data dari PIHPS Bank Indonesia belum tersedia. Coba lagi nanti.</p>
        </div>
      )}
      {state.status === 'ready' && <Billboard data={state.data} meta={state.meta} />}
    </section>
  )
}

function Billboard({ data, meta }) {
  const { latest, previous, provinces, partialNewer, totalProvinces } = meta
  const [cat, setCat] = useState('Semua')
  const [q, setQ] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('cabai-merah')
  const [variants, setVariants] = useState({})
  const [provId, setProvId] = useState('')

  const provName = provId ? provinces.find((p) => p.id === provId).name : 'Rata-rata nasional'

  const rows = PRICE_GROUPS.map((g) => {
    const key = variants[g.id] ?? g.defaultKey
    const series = seriesUntil(data, key, latest, provId)
    const current = valueAt(data, key, latest, provId)
    const before = previous ? valueAt(data, key, previous, provId) : undefined
    const diff = current != null && before != null ? ((current - before) / before) * 100 : null
    return { ...g, key, name: data.commodities[key].name, series, current, diff }
  }).filter((r) => (cat === 'Semua' || r.cat === cat) && r.name.toLowerCase().includes(q.toLowerCase()))

  const sel = PRICE_GROUPS.find((g) => g.id === selectedGroup)
  const selKey = variants[sel.id] ?? sel.defaultKey
  const selSeries = seriesUntil(data, selKey, latest, provId)
  const selCurrent = valueAt(data, selKey, latest, provId)
  const selBefore = previous ? valueAt(data, selKey, previous, provId) : undefined
  const selValues = selSeries.map((p) => p.value)

  const compare = provinces
    .map((p) => ({ ...p, value: valueAt(data, selKey, latest, p.id) }))
    .sort((a, b) => (a.value ?? Infinity) - (b.value ?? Infinity))
  const maxCompare = Math.max(...compare.map((c) => c.value ?? 0))

  const up = rows.filter((r) => r.diff > 0).length
  const down = rows.filter((r) => r.diff < 0).length

  return (
    <>
      {isStale(latest) && (
        <div role="status" className="card pad note stale-note">
          <strong>Data mungkin belum diperbarui.</strong>
          <p className="small">
            Data terbaru yang kami punya tertanggal {formatTanggal(latest)} ({daysSince(latest)} hari lalu). Pakai sebagai gambaran saja dan cek harga di pasar.
          </p>
        </div>
      )}
      <p className="small muted data-date">
        <strong>Data per {formatTanggal(latest)}</strong>
        {previous && <> · selisih dibanding {formatTanggal(previous)}</>}
        {partialNewer.map((p) => (
          <span key={p.date}> · Data {formatTanggal(p.date)} baru {p.count} dari {totalProvinces} provinsi, belum dipakai</span>
        ))}
      </p>

      <div className="layout-aside wide-aside">
        <div className="board">
          <div className="board-head">
            <div>
              <div className="board-title">PAPAN HARGA · {provName.toUpperCase()}</div>
              <div className="board-sub">{up} naik · {down} turun · {rows.length - up - down} tetap atau belum ada data</div>
            </div>
            <div className="board-filters">
              <label className="board-field">
                <span className="small">Provinsi</span>
                <select className="board-select" value={provId} onChange={(e) => setProvId(e.target.value)}>
                  <option value="">Rata-rata nasional</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </label>
              <input className="board-search" placeholder="Cari komoditas…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari komoditas" />
              <div className="chips">
                {CATEGORIES.map((c) => (
                  <button key={c} className={`chip-btn dark ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="board-table">
            <div className="board-row th">
              <span>Komoditas</span>
              <span className="r">Harga</span>
              <span className="r">Δ vs hari sebelumnya</span>
              <span className="r hide-sm">Tren</span>
            </div>
            {rows.map((r) => {
              const trendUp = r.diff > 0
              return (
                <button
                  key={r.id}
                  className={`board-row ${selectedGroup === r.id ? 'sel' : ''}`}
                  aria-pressed={selectedGroup === r.id}
                  onClick={() => setSelectedGroup(r.id)}
                >
                  <span className="b-name">
                    <Produce type={r.icon} size={32} />
                    <span>{r.name}</span>
                  </span>
                  {r.current != null ? <span className="r led"><small>Rp</small>{angka(r.current)}</span> : <span className="r no-data">belum ada data</span>}
                  {r.diff == null ? (
                    <span className="r delta flat">–</span>
                  ) : (
                    <span className={`r delta ${r.diff > 0 ? 'up' : r.diff < 0 ? 'down' : 'flat'}`}>
                      {r.diff > 0 ? '▲' : r.diff < 0 ? '▼' : '■'} {persen(r.diff)}%
                    </span>
                  )}
                  <span className="r hide-sm"><Sparkline data={r.series.map((p) => p.value)} up={trendUp} /></span>
                </button>
              )
            })}
            {rows.length === 0 && <div className="board-empty">Komoditas tidak ditemukan.</div>}
          </div>
        </div>

        <aside className="stack">
          <div className="card pad">
            <div className="row gap">
              <Produce type={sel.icon} size={56} bg="var(--cream-2)" />
              <div>
                <div className="muted small">{sel.cat} · {provName}</div>
                <h2 className="no-m">{data.commodities[selKey].name}</h2>
              </div>
            </div>
            {sel.keys.length > 1 && (
              <div className="chips variant-chips" role="group" aria-label="Pilih varian">
                {sel.keys.map((k) => (
                  <button key={k} className={`chip-btn ${k === selKey ? 'active' : ''}`} aria-pressed={k === selKey} onClick={() => setVariants((v) => ({ ...v, [sel.id]: k }))}>
                    {data.commodities[k].name}
                  </button>
                ))}
              </div>
            )}
            {selCurrent != null ? (
              <div className="big-price mono"><small>Rp</small>{angka(selCurrent)}</div>
            ) : (
              <div className="big-price no-data-lg">Belum ada data untuk {provName} pada {formatTanggal(latest)}</div>
            )}
            <div className="spark-lg">
              <Sparkline data={selValues} w={300} h={80} up={selCurrent > selBefore} />
            </div>
            {selValues.length > 1 && (
              <div className="row between small muted">
                <span>{previous && selBefore != null ? `${formatTanggal(previous, false)}: Rp${angka(selBefore)}` : 'Hari sebelumnya: belum ada data'}</span>
                <span>Tertinggi sejak {formatTanggal(selSeries[0].date, false)}: Rp{angka(Math.max(...selValues))}</span>
              </div>
            )}
          </div>

          <div className="card pad">
            <h3>Perbandingan antar provinsi</h3>
            <p className="muted small">
              {data.commodities[selKey].name}, {formatTanggal(latest)}. Rata-rata nasional: Rp{angka(valueAt(data, selKey, latest, ''))}
            </p>
            <ul className="bars bars-scroll" tabIndex={0} aria-label="Daftar harga per provinsi">
              {compare.map((r) => (
                <li key={r.id} className={r.id === provId ? 'me' : ''}>
                  <span className="bar-label">{r.name}</span>
                  <span className="bar-track">
                    {r.value != null && <span className="bar-fill" style={{ width: `${(r.value / maxCompare) * 100}%` }} />}
                  </span>
                  <span className="mono small">{r.value != null ? angka(r.value) : 'belum ada data'}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card pad note">
            <strong>Pakai sebagai patokan</strong>
            <p className="small">
              Harga di sini rata-rata per provinsi dari PIHPS Bank Indonesia, bukan harga di lapak tertentu. Harga di pasarmu bisa berbeda.
            </p>
          </div>
        </aside>
      </div>

      <CekHarga data={data} meta={meta} provId={provId} provName={provName} />

      <details className="card pad method">
        <summary>Bagaimana harga ini dihitung?</summary>
        <ul className="small">
          <li>Sumber: PIHPS (Pusat Informasi Harga Pangan Strategis) Bank Indonesia, kategori pasar tradisional. Data diambil otomatis dari situs PIHPS.</li>
          <li>Angka adalah rata-rata harga per provinsi, bukan harga di satu pasar atau lapak. "Rata-rata nasional" adalah angka PIHPS untuk seluruh provinsi yang melapor pada hari itu.</li>
          <li>Data terbit di hari kerja. Sabtu dan Minggu tidak ada data baru.</li>
          <li>Data hari terbaru sering baru terisi sebagian provinsi. Papan memakai tanggal terbaru yang sudah hampir lengkap, jadi bisa tertinggal sehari dari hari ini.</li>
          <li>Selisih (▲▼) dibandingkan dengan hari data sebelumnya, bukan selalu kemarin. Grafik tren memakai semua hari data yang tersedia sejak {formatTanggal(meta.dates[0])}.</li>
          <li>Provinsi yang tidak melapor pada hari itu ditulis "belum ada data", bukan nol.</li>
          <li>Harga di pasar dekatmu bisa berbeda. Pakai sebagai patokan saat menawar, bukan harga pasti.</li>
        </ul>
      </details>
    </>
  )
}
