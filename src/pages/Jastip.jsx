import { useState } from 'react'
import { Produce } from '../components/Art.jsx'
import { angka, commodities, markets, rupiah, slots } from '../data.js'
import { formatTanggal } from '../prices.js'
import { usePricing } from '../pricing.js'

// Pasar di daftar semuanya di Jakarta, jadi patokan harga memakai DKI Jakarta (fallback rata-rata nasional kalau kosong).
const REGION = 'DKI Jakarta'

const IF_OUT = [
  { id: 'ganti', label: 'Ganti yang mirip', note: 'Tim membeli barang pengganti yang sepadan.' },
  { id: 'lewati', label: 'Lewati saja', note: 'Barang itu tidak dibeli dan tidak ditagih.' },
  { id: 'hubungi', label: 'Hubungi saya dulu', note: 'Tim bertanya lewat WhatsApp sebelum membeli apa pun.' },
]

const PHONE_PATTERN = /^(\+62|62|0)8\d{8,11}$/

function validate(form) {
  const errors = {}
  if (!form.nama.trim()) errors.nama = 'Isi nama usaha atau nama kamu.'
  if (!form.alamat.trim()) errors.alamat = 'Isi alamat antar.'
  if (!form.hp.trim()) errors.hp = 'Isi nomor WhatsApp.'
  else if (!PHONE_PATTERN.test(form.hp.replace(/[\s-]/g, ''))) errors.hp = 'Nomor WhatsApp tidak valid. Contoh: 08xxxxxxxxxx.'
  return errors
}

export default function Jastip() {
  const pricing = usePricing(REGION)
  const priceFor = (c) => (c.pihpsKey ? pricing.refOf(c.pihpsKey)?.value : c.base)
  const [market, setMarket] = useState(markets[0].id)
  const [qty, setQty] = useState({})
  const [custom, setCustom] = useState('')
  const [slot, setSlot] = useState(slots[1])
  const [ifOut, setIfOut] = useState('hubungi')
  const [form, setForm] = useState({ nama: '', alamat: '', hp: '' })
  const [submitted, setSubmitted] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const errors = validate(form)
  const showError = (k) => (submitted ? errors[k] : undefined)

  const m = markets.find((x) => x.id === market)
  const lines = commodities
    .filter((c) => qty[c.id] > 0 && priceFor(c) != null)
    .map((c) => ({ ...c, n: qty[c.id], sub: qty[c.id] * priceFor(c) }))
  const subtotal = lines.reduce((s, l) => s + l.sub, 0)
  const jasa = Math.max(15000, subtotal * 0.08)
  const ongkir = Math.round(8000 + m.km * 2500)
  const total = subtotal + jasa + ongkir

  const change = (id, d) => setQty((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) + d) }))

  const submit = () => {
    setSubmitted(true)
    if (Object.keys(errors).length > 0) {
      document.getElementById(`jastip-${Object.keys(errors)[0]}`)?.focus()
      return
    }
    setOrdered(true)
    window.scrollTo({ top: 0 })
  }

  if (ordered) {
    return (
      <Ringkasan
        order={{ market: m, slot, ifOut, form, custom, lines, subtotal, jasa, ongkir, total }}
        pricingDate={pricing.date}
        onBack={() => setOrdered(false)}
        onReset={() => {
          setOrdered(false)
          setSubmitted(false)
          setQty({})
          setCustom('')
          setIfOut('hubungi')
          setForm({ nama: '', alamat: '', hp: '' })
        }}
      />
    )
  }

  return (
    <section className="container page">
      <header className="page-head">
        <span className="eyebrow">Jastip Pasar</span>
        <h1>Titip belanja pasar, antar ke dapurmu</h1>
        <p className="muted">Harga di katalog adalah patokan, harga final sesuai struk pasar. <a className="link-btn" href="/kebijakan" target="_blank" rel="noopener">Baca kebijakan Jastip</a></p>
      </header>

      {pricing.status === 'loading' && <p role="status" className="muted">Memuat harga bahan…</p>}
      {(pricing.status === 'error' || pricing.status === 'empty') && (
        <div role="alert" className="card pad status-box">
          <strong>Harga PIHPS belum bisa dimuat.</strong>
          <p className="muted small">Barang yang harganya dari PIHPS belum bisa dipilih.</p>
          {pricing.status === 'error' && <button className="btn ghost" onClick={pricing.retry}>Muat ulang data harga</button>}
        </div>
      )}
      {pricing.status === 'loading' && <p className="small data-date data-date-loading" aria-hidden="true" />}
      {pricing.date && (
        <p className="small muted data-date">
          Harga bertanda PIHPS = patokan rata-rata {REGION} per {formatTanggal(pricing.date)} dari PIHPS Bank Indonesia. Bertanda estimasi = perkiraan kami, bukan data resmi.
        </p>
      )}

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
              {commodities.map((c) => {
                const ref = c.pihpsKey ? pricing.refOf(c.pihpsKey) : null
                const price = priceFor(c)
                const unavailable = price == null
                return (
                  <div key={c.id} className={`cat-item ${qty[c.id] && !unavailable ? 'on' : ''}`}>
                    <Produce type={c.icon} size={44} bg="var(--cream-2)" />
                    <div className="grow">
                      <div className="strong small">{c.name}</div>
                      <div className="small muted">
                        {unavailable ? (pricing.status === 'loading' ? <span className="skeleton skeleton-line" aria-hidden="true" /> : 'harga belum tersedia') : <><span className="cat-price">Rp{angka(price)}</span>/{c.unit}</>}
                        {!unavailable && <span className="tag-est">{c.pihpsKey ? (ref.fallback ? 'PIHPS, rata-rata nasional' : 'PIHPS') : 'estimasi'}</span>}
                      </div>
                    </div>
                    <div className="stepper">
                      <button aria-label={`Kurangi ${c.name}`} disabled={unavailable} onClick={() => change(c.id, -1)}>−</button>
                      <span>{unavailable ? 0 : qty[c.id] ?? 0}</span>
                      <button aria-label={`Tambah ${c.name}`} disabled={unavailable} onClick={() => change(c.id, 1)}>+</button>
                    </div>
                  </div>
                )
              })}
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
            <div className="field">
              <span>Kalau barang kosong di pasar</span>
              <div className="chips">
                {IF_OUT.map((o) => (
                  <button key={o.id} className={`chip-btn ${ifOut === o.id ? 'active' : ''}`} aria-pressed={ifOut === o.id} onClick={() => setIfOut(o.id)}>{o.label}</button>
                ))}
              </div>
              <small className="muted">{IF_OUT.find((o) => o.id === ifOut).note}</small>
            </div>
          </div>

          <div className="card pad">
            <h2 className="h-step"><span>3</span> Data UMKM & jadwal antar</h2>
            <div className="form-grid">
              <label className="field">
                <span>Nama usaha</span>
                <input id="jastip-nama" autoComplete="organization" aria-invalid={!!showError('nama')} aria-describedby="jastip-nama-err" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
                <small id="jastip-nama-err" className="field-error">{showError('nama')}</small>
              </label>
              <label className="field">
                <span>No. WhatsApp</span>
                <input id="jastip-hp" type="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" aria-invalid={!!showError('hp')} aria-describedby="jastip-hp-err" value={form.hp} onChange={(e) => setForm({ ...form, hp: e.target.value })} />
                <small id="jastip-hp-err" className="field-error">{showError('hp')}</small>
              </label>
              <label className="field full">
                <span>Alamat antar</span>
                <input id="jastip-alamat" autoComplete="street-address" aria-invalid={!!showError('alamat')} aria-describedby="jastip-alamat-err" value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
                <small id="jastip-alamat-err" className="field-error">{showError('alamat')}</small>
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
          <button className="btn primary block" disabled={lines.length === 0 && !custom} onClick={submit}>
            Lanjut ke ringkasan pesanan
          </button>
        </aside>
      </div>
    </section>
  )
}

function Ringkasan({ order, pricingDate, onBack, onReset }) {
  const { market, slot, ifOut, form, custom, lines, subtotal, jasa, ongkir, total } = order
  return (
    <section className="container page">
      <header className="page-head">
        <span className="eyebrow">Ringkasan pesanan jastip</span>
        <h1>Pesananmu belum dikirim</h1>
        <p className="muted">
          Prototipe ini belum terhubung ke WhatsApp tim, jadi belum ada pesanan yang masuk. Ini ringkasan yang akan dikirim nanti. Harga final sesuai struk pasar.
        </p>
      </header>
      <div className="layout-aside">
        <div className="card pad stack">
          <div>
            <h2>Data pemesan</h2>
            <dl className="detail-list">
              <div><dt>Nama usaha</dt><dd>{form.nama}</dd></div>
              <div><dt>No. WhatsApp</dt><dd>{form.hp}</dd></div>
              <div><dt>Alamat antar</dt><dd>{form.alamat}</dd></div>
              <div><dt>Pasar</dt><dd>{market.name}, {market.area}</dd></div>
              <div><dt>Slot antar besok</dt><dd>{slot}</dd></div>
              <div><dt>Kalau barang kosong</dt><dd>{IF_OUT.find((o) => o.id === ifOut).label}</dd></div>
            </dl>
          </div>
          {custom && (
            <div>
              <h3>Titipan khusus</h3>
              <p>{custom}</p>
            </div>
          )}
        </div>
        <aside className="card pad summary">
          <h2>Barang titipan</h2>
          <ul className="sum-list">
            {lines.map((l) => (
              <li key={l.id}>
                <span>{l.n} {l.unit} {l.name} <span className="tag-est">{l.pihpsKey ? 'PIHPS' : 'estimasi'}</span></span>
                <span className="mono">{rupiah(l.sub)}</span>
              </li>
            ))}
            {custom && <li><span>+ Titipan khusus</span><span className="muted small">sesuai struk</span></li>}
          </ul>
          <dl className="sum-total">
            <div><dt>Estimasi belanja</dt><dd>{rupiah(subtotal)}</dd></div>
            <div><dt>Biaya jasa (8%, min. 15rb)</dt><dd>{rupiah(jasa)}</dd></div>
            <div><dt>Ongkir · {market.km} km</dt><dd>{rupiah(ongkir)}</dd></div>
            <div className="grand"><dt>Total estimasi</dt><dd>{rupiah(total)}</dd></div>
          </dl>
          {pricingDate && <p className="muted small">Harga PIHPS per {formatTanggal(pricingDate)}.</p>}
          <button className="btn ghost block" onClick={onBack}>Ubah pesanan</button>
          <button className="btn light block" onClick={onReset}>Buat titipan baru</button>
        </aside>
      </div>
    </section>
  )
}
