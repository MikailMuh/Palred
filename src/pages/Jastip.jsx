import { useEffect, useMemo, useState } from 'react'
import { Courier, Produce } from '../components/Art.jsx'
import { angka, commodities, markets, rupiah, slots } from '../data.js'

const TRACK = [
  ['Pesanan diterima', 'Shopper sedang ditugaskan'],
  ['Shopper di pasar', 'Memilih bahan & kirim foto'],
  ['Belanja selesai', 'Struk & foto bahan terlampir'],
  ['Dalam perjalanan', 'Kurir menuju dapurmu'],
  ['Sampai', 'Bahan diterima UMKM'],
]

export default function Jastip({ live, notify }) {
  const { prices } = live
  const [market, setMarket] = useState(markets[0].id)
  const [qty, setQty] = useState({ 'cabai-merah': 2, 'bawang-merah': 1, telur: 3 })
  const [custom, setCustom] = useState('')
  const [slot, setSlot] = useState(slots[1])
  const [form, setForm] = useState({ nama: 'Warung Bu Sari', alamat: 'Jl. Kenanga No. 12, Jakarta Timur', hp: '0812-xxxx-2210' })
  const [ordered, setOrdered] = useState(false)

  const m = markets.find((x) => x.id === market)
  const lines = commodities
    .filter((c) => qty[c.id] > 0)
    .map((c) => ({ ...c, n: qty[c.id], sub: qty[c.id] * prices[c.id].price }))
  const subtotal = lines.reduce((s, l) => s + l.sub, 0)
  const jasa = Math.max(15000, subtotal * 0.08)
  const ongkir = Math.round(8000 + m.km * 2500)
  const total = subtotal + jasa + ongkir

  const change = (id, d) => setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + d) }))

  if (ordered) return <Tracking market={m} slot={slot} total={total} lines={lines} onBack={() => setOrdered(false)} />

  return (
    <section className="container page">
      <header className="page-head">
        <span className="eyebrow">Jastip Pasar</span>
        <h1>Titip belanja pasar, antar ke dapurmu</h1>
        <p className="muted">Harga di katalog mengikuti billboard terkini. Harga final sesuai struk pasar.</p>
      </header>

      <div className="layout-aside">
        <div className="stack">
          <div className="card pad">
            <h2 className="h-step"><span>1</span> Pilih pasar</h2>
            <div className="market-grid">
              {markets.map((x) => (
                <button key={x.id} className={`market ${market === x.id ? 'selected' : ''}`} onClick={() => setMarket(x.id)}>
                  <div className="strong">{x.name}</div>
                  <div className="muted small">{x.area} · {x.km} km</div>
                  <div className="row between small">
                    <span>Buka {x.open}</span>
                    <span>★ {x.rating}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="card pad">
            <h2 className="h-step"><span>2</span> Daftar belanja</h2>
            <div className="catalog">
              {commodities.map((c) => (
                <div key={c.id} className={`cat-item ${qty[c.id] ? 'on' : ''}`}>
                  <Produce type={c.icon} size={44} bg="var(--cream-2)" />
                  <div className="grow">
                    <div className="strong small">{c.name}</div>
                    <div className="mono small muted">Rp{angka(prices[c.id].price)}/{c.unit}</div>
                  </div>
                  <div className="stepper">
                    <button aria-label={`Kurangi ${c.name}`} onClick={() => change(c.id, -1)}>−</button>
                    <span>{qty[c.id] ?? 0}</span>
                    <button aria-label={`Tambah ${c.name}`} onClick={() => change(c.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
            <label className="field">
              <span>Titipan khusus (opsional)</span>
              <textarea
                rows={3}
                placeholder="Contoh: daun pisang 1 ikat, minta yang lebar; tempe 3 papan dari lapak 14"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
              />
            </label>
          </div>

          <div className="card pad">
            <h2 className="h-step"><span>3</span> Data UMKM & jadwal antar</h2>
            <div className="form-grid">
              <label className="field">
                <span>Nama usaha</span>
                <input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </label>
              <label className="field">
                <span>No. WhatsApp</span>
                <input value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} />
              </label>
              <label className="field full">
                <span>Alamat antar</span>
                <input value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
              </label>
            </div>
            <div className="field">
              <span>Slot antar besok</span>
              <div className="chips">
                {slots.map((s) => (
                  <button key={s} className={`chip-btn ${slot === s ? 'active' : ''}`} onClick={() => setSlot(s)}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="card pad summary">
          <h2>Ringkasan titipan</h2>
          <p className="muted small">{m.name} · antar {slot}</p>
          <ul className="sum-list">
            {lines.length === 0 && <li className="muted">Belum ada barang dipilih.</li>}
            {lines.map((l) => (
              <li key={l.id}>
                <span>{l.n} {l.unit} {l.name}</span>
                <span className="mono">{rupiah(l.sub)}</span>
              </li>
            ))}
            {custom && <li><span>+ Titipan khusus</span><span className="muted small">sesuai struk</span></li>}
          </ul>
          <dl className="sum-total">
            <div><dt>Estimasi belanja</dt><dd>{rupiah(subtotal)}</dd></div>
            <div><dt>Biaya jasa (8%, min. 15rb)</dt><dd>{rupiah(jasa)}</dd></div>
            <div><dt>Ongkir · {m.km} km</dt><dd>{rupiah(ongkir)}</dd></div>
            <div className="grand"><dt>Total estimasi</dt><dd>{rupiah(total)}</dd></div>
          </dl>
          <button
            className="btn primary block"
            disabled={lines.length === 0 && !custom}
            onClick={() => {
              setOrdered(true)
              notify('Pesanan jastip dibuat!')
              window.scrollTo({ top: 0 })
            }}
          >
            Pesan jastip
          </button>
          <p className="muted small center">Bayar setelah kamu setujui foto belanjaan.</p>
        </aside>
      </div>
    </section>
  )
}

function Tracking({ market, slot, total, lines, onBack }) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (step >= TRACK.length - 1) return
    const t = setTimeout(() => setStep((s) => s + 1), 2200)
    return () => clearTimeout(t)
  }, [step])

  const code = useMemo(() => 'PLR-' + Math.random().toString(36).slice(2, 7).toUpperCase(), [])

  return (
    <section className="container page">
      <header className="page-head">
        <span className="eyebrow">Lacak pesanan · {code}</span>
        <h1>{TRACK[step][0]}</h1>
        <p className="muted">{TRACK[step][1]}</p>
      </header>
      <div className="layout-aside">
        <div className="card pad">
          <div className="track-art"><Courier /></div>
          <ol className="tracker">
            {TRACK.map(([t, d], i) => (
              <li key={t} className={i < step ? 'done' : i === step ? 'current' : ''}>
                <span className="node">{i < step ? '✓' : i + 1}</span>
                <div>
                  <div className="strong">{t}</div>
                  <div className="muted small">{d}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <aside className="card pad summary">
          <h2>Detail</h2>
          <p className="muted small">{market.name} · antar {slot}</p>
          <ul className="sum-list">
            {lines.map((l) => (
              <li key={l.id}><span>{l.n} {l.unit} {l.name}</span></li>
            ))}
          </ul>
          <dl className="sum-total">
            <div className="grand"><dt>Total estimasi</dt><dd>{rupiah(total)}</dd></div>
          </dl>
          <button className="btn ghost block" onClick={onBack}>Buat titipan baru</button>
        </aside>
      </div>
    </section>
  )
}
