import { useEffect, useState } from 'react'
import { Dish, PackageBox, Produce } from '../components/Art.jsx'
import { packPrice, recipes, rupiah } from '../data.js'

const TYPES = ['Semua', 'Berkuah', 'Goreng', 'Sayur']
const PORTIONS = [1, 2, 4, 6, 10]

const fmtQty = (q, unit) => {
  if (unit === 'g' && q >= 1000) return `${(q / 1000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} kg`
  if (unit === 'ml' && q >= 1000) return `${(q / 1000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} L`
  const n = unit === 'g' || unit === 'ml' ? Math.round(q) : Math.ceil(q)
  return `${n.toLocaleString('id-ID')} ${unit}`
}

export default function Paket({ addToCart }) {
  const [type, setType] = useState('Semua')
  const [open, setOpen] = useState(null)
  const list = recipes.filter((r) => type === 'Semua' || r.type === type)

  return (
    <section className="container page">
      <header className="page-head split-head">
        <div>
          <span className="eyebrow">Paket Masak</span>
          <h1>Bahan per resep, sudah ditakar</h1>
          <p className="muted">
            Pilih masakan dan jumlah porsi — kami siapkan semua bahan dalam satu kotak, ditimbang sesuai takaran
            resep. Hemat waktu belanja, minim sisa bahan.
          </p>
          <div className="chips">
            {TYPES.map((t) => (
              <button key={t} className={`chip-btn ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="head-art"><PackageBox items={['ayam', 'kelapa', 'bawang', 'cabai']} label="Paket Opor" /></div>
      </header>

      <div className="grid-3">
        {list.map((r) => (
          <article key={r.id} className="card recipe-card">
            <button className="dish-wrap" onClick={() => setOpen(r)} aria-label={`Lihat paket ${r.name}`}>
              <Dish {...r.dish} />
              <span className="level">{r.level}</span>
            </button>
            <div className="recipe-meta">
              <h3>{r.name}</h3>
              <p className="muted small">{r.origin} · {r.minutes} menit · {r.ingredients.length} bahan</p>
              <div className="ing-icons">
                {r.ingredients.map((i) => <Produce key={i.name} type={i.icon} size={26} />)}
              </div>
              <div className="row between">
                <div>
                  <div className="price">{rupiah(packPrice(r, 2))}</div>
                  <div className="muted small">untuk 2 porsi</div>
                </div>
                <button className="btn primary sm" onClick={() => setOpen(r)}>Pilih</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {open && <Detail recipe={open} onClose={() => setOpen(null)} addToCart={addToCart} />}
    </section>
  )
}

function Detail({ recipe, onClose, addToCart }) {
  const [portions, setPortions] = useState(2)
  const scale = portions / 2
  const price = packPrice(recipe, portions)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="overlay" onClick={onClose}>
      <div className="drawer" role="dialog" aria-modal="true" aria-label={recipe.name} onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Tutup">×</button>
        <div className="drawer-hero">
          <Dish {...recipe.dish} />
        </div>
        <div className="drawer-body">
          <span className="eyebrow">{recipe.origin} · {recipe.minutes} menit · {recipe.level}</span>
          <h2>Paket {recipe.name}</h2>
          <p className="muted">{recipe.desc}</p>

          <div className="field">
            <span>Jumlah porsi</span>
            <div className="chips">
              {PORTIONS.map((p) => (
                <button key={p} className={`chip-btn ${portions === p ? 'active' : ''}`} onClick={() => setPortions(p)}>
                  {p} porsi
                </button>
              ))}
            </div>
          </div>

          <h3>Isi paket</h3>
          <ul className="ing-list">
            {recipe.ingredients.map((i) => (
              <li key={i.name}>
                <Produce type={i.icon} size={40} bg="var(--cream-2)" />
                <span className="grow">{i.name}</span>
                <span className="qty mono">{fmtQty(i.qty * scale, i.unit)}</span>
              </li>
            ))}
          </ul>

          <div className="pack-note">
            <div className="pack-mini"><PackageBox items={recipe.ingredients.map((i) => i.icon)} label={recipe.name} /></div>
            <ul className="small">
              <li>Tiap bahan dikemas terpisah & diberi label takaran</li>
              <li>Bumbu halus bisa diminta sudah diulek (+Rp5.000)</li>
              <li>Kartu resep langkah demi langkah ikut di dalam kotak</li>
            </ul>
          </div>
        </div>
        <div className="drawer-foot">
          <div>
            <div className="muted small">Total {portions} porsi</div>
            <div className="price lg">{rupiah(price)}</div>
          </div>
          <button
            className="btn primary"
            onClick={() => {
              addToCart({ id: recipe.id, name: `Paket ${recipe.name} (${portions} porsi)`, portions, price })
              onClose()
            }}
          >
            Tambah ke keranjang
          </button>
        </div>
      </div>
    </div>
  )
}
