import { useState } from 'react'
import { Produce, Sparkline } from '../components/Art.jsx'
import { angka, categories, commodities, regions } from '../data.js'

export default function Harga({ live, regionId, setRegionId }) {
  const { prices, updatedAt, region } = live
  const [cat, setCat] = useState('Semua')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState('cabai-merah')

  const rows = commodities.filter(
    (c) => (cat === 'Semua' || c.cat === cat) && c.name.toLowerCase().includes(q.toLowerCase()),
  )
  const sel = commodities.find((c) => c.id === selected)
  const selP = prices[selected]
  // perbandingan antar daerah: geser harga live ke faktor tiap provinsi
  const compare = regions
    .map((r) => ({ ...r, price: (selP.price / region.factor) * r.factor }))
    .sort((a, b) => a.price - b.price)
  const maxCompare = Math.max(...compare.map((c) => c.price))

  const ups = commodities.filter((c) => prices[c.id].price > prices[c.id].open).length

  return (
    <section className="container page">
      <header className="page-head row between wrap">
        <div>
          <span className="eyebrow">Billboard Harga</span>
          <h1>Harga pasar realtime per daerah</h1>
          <p className="muted">Acuan harga eceran pasar tradisional. Diperbarui otomatis dari laporan mitra pasar.</p>
        </div>
        <div className="live-meta">
          <span className="live-pill"><span className="dot" /> LIVE</span>
          <span className="muted small">Update {updatedAt.toLocaleTimeString('id-ID')}</span>
        </div>
      </header>

      <div className="region-tabs" role="tablist" aria-label="Pilih daerah">
        {regions.map((r) => (
          <button key={r.id} role="tab" aria-selected={regionId === r.id} className={regionId === r.id ? 'active' : ''} onClick={() => setRegionId(r.id)}>
            {r.name}
          </button>
        ))}
      </div>

      <div className="layout-aside wide-aside">
        <div className="board">
          <div className="board-head">
            <div>
              <div className="board-title">PAPAN HARGA · {region.name.toUpperCase()}</div>
              <div className="board-sub">{ups} naik · {commodities.length - ups} turun/stabil sejak buka</div>
            </div>
            <div className="board-filters">
              <input className="board-search" placeholder="Cari komoditas…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari komoditas" />
              <div className="chips">
                {categories.map((c) => (
                  <button key={c} className={`chip-btn dark ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="board-table">
            <div className="board-row th">
              <span>Komoditas</span>
              <span className="r">Harga</span>
              <span className="r">Δ hari ini</span>
              <span className="r hide-sm">Tren</span>
            </div>
            {rows.map((c) => {
              const p = prices[c.id]
              const diff = ((p.price - p.open) / p.open) * 100
              const up = diff >= 0
              return (
                <button
                  key={c.id}
                  className={`board-row ${p.flash ? 'flash-' + p.flash : ''} ${selected === c.id ? 'sel' : ''}`}
                  onClick={() => setSelected(c.id)}
                >
                  <span className="b-name">
                    <Produce type={c.icon} size={32} />
                    <span>
                      {c.name}
                      <small>/{c.unit}</small>
                    </span>
                  </span>
                  <span className="r led">{angka(p.price)}</span>
                  <span className={`r delta ${up ? 'up' : 'down'}`}>
                    {up ? '▲' : '▼'} {Math.abs(diff).toFixed(2)}%
                  </span>
                  <span className="r hide-sm"><Sparkline data={p.history} up={up} /></span>
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
                <div className="muted small">{sel.cat}</div>
                <h2 className="no-m">{sel.name}</h2>
              </div>
            </div>
            <div className="big-price mono">Rp{angka(selP.price)}<small>/{sel.unit}</small></div>
            <div className="spark-lg">
              <Sparkline data={selP.history} w={300} h={80} up={selP.price >= selP.open} />
            </div>
            <div className="row between small muted">
              <span>Buka: Rp{angka(selP.open)}</span>
              <span>Tertinggi: Rp{angka(Math.max(...selP.history))}</span>
            </div>
          </div>

          <div className="card pad">
            <h3>Perbandingan antar daerah</h3>
            <p className="muted small">Harga {sel.name.toLowerCase()} per {sel.unit}</p>
            <ul className="bars">
              {compare.map((r) => (
                <li key={r.id} className={r.id === regionId ? 'me' : ''}>
                  <span className="bar-label">{r.name}</span>
                  <span className="bar-track">
                    <span className="bar-fill" style={{ width: `${(r.price / maxCompare) * 100}%` }} />
                  </span>
                  <span className="mono small">{angka(r.price)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card pad note">
            <strong>Pakai sebagai acuan</strong>
            <p className="small">
              UMKM bisa menunjukkan papan ini saat tawar-menawar. Harga merupakan rata-rata laporan pasar, bisa
              berbeda ±5% per lapak.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
