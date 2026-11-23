import { useState } from 'react'
import { DishPhoto, PackageBox } from '../components/Art.jsx'
import WaButton from '../components/WaButton.jsx'
import { recipes, rupiah, slots } from '../data.js'
import { formatTanggal } from '../prices.js'
import { usePricing } from '../pricing.js'

export default function Keranjang({ cart, changeQty, removeLine, go }) {
  const pricing = usePricing()
  const [form, setForm] = useState({ nama: '', hp: '', alamat: '', slot: slots[1] })
  const [touched, setTouched] = useState(false)
  const errors = {
    nama: !form.nama.trim() && 'Isi nama usaha atau nama kamu.',
    hp: !form.hp.trim() ? 'Isi nomor WhatsApp.' : !PHONE.test(form.hp.replace(/[\s-]/g, '')) && 'Nomor WhatsApp tidak valid. Contoh: 08xxxxxxxxxx.',
    alamat: !form.alamat.trim() && 'Isi alamat antar.',
  }
  const valid = !errors.nama && !errors.hp && !errors.alamat
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const lines = cart.map((l) => {
    const recipe = recipes.find((r) => r.id === l.recipeId)
    const pack = pricing.packFor(recipe, l.portions)
    return { ...l, recipe, pack, sub: pack ? pack.total * l.qty : null }
  })
  const missing = lines.some((l) => l.sub == null)
  const total = lines.reduce((s, l) => s + (l.sub ?? 0), 0)

  return (
    <section className="container page">
      <header className="page-head">
        <span className="eyebrow">Keranjang</span>
        <h1>Keranjang belanja</h1>
      </header>

      {cart.length === 0 ? (
        <div className="card pad status-box empty-cart">
          <div className="empty-art"><PackageBox items={['bawang', 'cabai', 'tomat', 'sayur']} label="Paket kosong" /></div>
          <strong>Keranjangmu masih kosong.</strong>
          <p className="muted small">Pilih paket masak dulu, nanti muncul di sini.</p>
          <button className="btn primary" onClick={() => go('paket')}>Lihat paket masak</button>
        </div>
      ) : (
        <div className="layout-aside">
          <ul className="stack cart-list">
            {lines.map((l) => (
              <li key={`${l.recipeId}-${l.portions}`} className="card pad cart-line">
                <div className="cart-dish"><DishPhoto id={l.recipe.id} dish={l.recipe.dish} /></div>
                <div className="grow">
                  <h3 className="no-m">Paket {l.recipe.name}</h3>
                  <p className="muted small">{l.portions} porsi per paket · perkiraan {l.pack ? rupiah(l.pack.total) : 'belum tersedia'}</p>
                  <div className="row gap">
                    <div className="stepper">
                      <button aria-label={`Kurangi Paket ${l.recipe.name} ${l.portions} porsi`} onClick={() => changeQty(l.recipeId, l.portions, -1)}>−</button>
                      <span>{l.qty}</span>
                      <button aria-label={`Tambah Paket ${l.recipe.name} ${l.portions} porsi`} onClick={() => changeQty(l.recipeId, l.portions, 1)}>+</button>
                    </div>
                    <button className="btn ghost sm" onClick={() => removeLine(l.recipeId, l.portions)}>Hapus dari keranjang</button>
                  </div>
                </div>
                <div className="price">{l.sub != null ? rupiah(l.sub) : '–'}</div>
              </li>
            ))}
          </ul>

          <aside className="card pad summary">
            <h2>Ringkasan</h2>
            {pricing.status === 'loading' && <p role="status" className="muted small">Memuat harga bahan…</p>}
            {pricing.status !== 'loading' && missing && (
              <p role="alert" className="small">
                Harga sebagian paket belum bisa dihitung, jadi total belum lengkap.{' '}
                {pricing.status === 'error' && <button className="link-btn" onClick={pricing.retry}>Muat ulang data harga</button>}
              </p>
            )}
            <dl className="sum-total">
              <div className="grand"><dt>Perkiraan total</dt><dd>{rupiah(total)}</dd></div>
            </dl>
            {pricing.date && (
              <p className="muted small">
                Dihitung dari patokan PIHPS per {formatTanggal(pricing.date)} (rata-rata nasional). Bahan di luar PIHPS memakai estimasi.
              </p>
            )}
            <h3 className="cart-form-title">Data pengiriman</h3>
            <div className="cart-form">
              <Field label="Nama usaha" error={touched && errors.nama}><input value={form.nama} onChange={set('nama')} autoComplete="organization" /></Field>
              <Field label="No. WhatsApp" error={touched && errors.hp}><input value={form.hp} onChange={set('hp')} inputMode="tel" autoComplete="tel" placeholder="08xxxxxxxxxx" /></Field>
              <Field label="Alamat antar" error={touched && errors.alamat}><textarea rows={2} value={form.alamat} onChange={set('alamat')} autoComplete="street-address" /></Field>
              <Field label="Slot antar besok">
                <select className="select" value={form.slot} onChange={set('slot')}>{slots.map((x) => <option key={x}>{x}</option>)}</select>
              </Field>
            </div>
            <WaButton
              disabled={missing || pricing.status === 'loading'}
              validate={() => { setTouched(true); return valid }}
              text={() => cartMessage(lines, total, form, pricing.date)}
            />
            <p className="muted small">Ongkir dihitung tim dan dikonfirmasi lewat WhatsApp.</p>
          </aside>
        </div>
      )}
    </section>
  )
}

const PHONE = /^(\+62|62|0)8\d{8,11}$/

function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <span className="field-error" role="alert">{error}</span>}
    </label>
  )
}

function cartMessage(lines, total, form, date) {
  return [
    '*Pesanan Paket Masak TitipinBro*',
    '',
    `Nama usaha: ${form.nama}`,
    `No. WhatsApp: ${form.hp}`,
    `Alamat antar: ${form.alamat}`,
    `Slot antar besok: ${form.slot}`,
    '',
    '*Paket*',
    ...lines.map((l) => `• ${l.qty}× Paket ${l.recipe.name} (${l.portions} porsi) — ${rupiah(l.sub)}`),
    '',
    `*Perkiraan total: ${rupiah(total)}* (belum termasuk ongkir)`,
    `Harga patokan PIHPS${date ? ` per ${formatTanggal(date)}` : ''}; bahan di luar PIHPS memakai estimasi.`,
  ].join('\n')
}
