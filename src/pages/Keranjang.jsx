import { Dish } from '../components/Art.jsx'
import { recipes, rupiah } from '../data.js'
import { formatTanggal } from '../prices.js'
import { usePricing } from '../pricing.js'

export default function Keranjang({ cart, changeQty, removeLine, go }) {
  const pricing = usePricing()

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
        <div className="card pad status-box">
          <strong>Keranjangmu masih kosong.</strong>
          <p className="muted small">Pilih paket masak dulu, nanti muncul di sini.</p>
          <button className="btn primary" onClick={() => go('paket')}>Lihat paket masak</button>
        </div>
      ) : (
        <div className="layout-aside">
          <ul className="stack cart-list">
            {lines.map((l) => (
              <li key={`${l.recipeId}-${l.portions}`} className="card pad cart-line">
                <div className="cart-dish"><Dish {...l.recipe.dish} /></div>
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
            <button className="btn primary block" disabled>Kirim pesanan lewat WhatsApp</button>
          </aside>
        </div>
      )}
    </section>
  )
}
