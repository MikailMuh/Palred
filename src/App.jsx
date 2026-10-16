import { Suspense, lazy, useEffect, useState } from 'react'
import { Logo } from './components/Art.jsx'
import { recipes, useLivePrices } from './data.js'
import Home from './pages/Home.jsx'

const Jastip = lazy(() => import('./pages/Jastip.jsx'))
const Harga = lazy(() => import('./pages/Harga.jsx'))
const Paket = lazy(() => import('./pages/Paket.jsx'))
const Keranjang = lazy(() => import('./pages/Keranjang.jsx'))
const Kebijakan = lazy(() => import('./pages/Kebijakan.jsx'))

const NAV = [
  { id: 'home', label: 'Beranda' },
  { id: 'jastip', label: 'Jastip Pasar' },
  { id: 'harga', label: 'Billboard Harga' },
  { id: 'paket', label: 'Paket Masak' },
]

const PATHS = { home: '/', jastip: '/jastip', harga: '/harga', paket: '/paket', keranjang: '/keranjang', kebijakan: '/kebijakan' }

const pageFromPath = (path) => {
  const clean = path.replace(/\/+$/, '') || '/'
  return Object.keys(PATHS).find((id) => PATHS[id] === clean) ?? 'home'
}

export default function App() {
  const [page, setPage] = useState(() => pageFromPath(window.location.pathname))
  const [regionId] = useState('jkt')
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)
  const live = useLivePrices(regionId)

  const go = (id) => {
    if (id !== page) window.history.pushState(null, '', PATHS[id])
    setPage(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onPop = () => setPage(pageFromPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const titles = { home: 'Palred — Pasar dalam genggaman', jastip: 'Jastip Pasar · Palred', harga: 'Billboard Harga · Palred', paket: 'Paket Masak · Palred', keranjang: 'Keranjang · Palred', kebijakan: 'Kebijakan Jastip · Palred' }
    document.title = titles[page]
  }, [page])

  const notify = (msg) => setToast({ msg, key: Date.now() })
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const sameLine = (l, recipeId, portions) => l.recipeId === recipeId && l.portions === portions

  const addToCart = ({ recipeId, portions }) => {
    setCart((c) =>
      c.some((l) => sameLine(l, recipeId, portions))
        ? c.map((l) => (sameLine(l, recipeId, portions) ? { ...l, qty: l.qty + 1 } : l))
        : [...c, { recipeId, portions, qty: 1 }],
    )
    notify(`Paket ${recipes.find((r) => r.id === recipeId).name} (${portions} porsi) masuk keranjang`)
  }

  const changeQty = (recipeId, portions, delta) =>
    setCart((c) => c.map((l) => (sameLine(l, recipeId, portions) ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0))

  const removeLine = (recipeId, portions) => setCart((c) => c.filter((l) => !sameLine(l, recipeId, portions)))

  const cartCount = cart.reduce((n, l) => n + l.qty, 0)

  return (
    <div className="app">
      <header className="topbar">
        <div className="container topbar-inner">
          <button className="brand" onClick={() => go('home')}>
            <Logo />
            <span>Palred</span>
          </button>
          <nav className="nav" aria-label="Navigasi utama">
            {NAV.map((n) => (
              <button key={n.id} className={page === n.id ? 'active' : ''} onClick={() => go(n.id)}>
                {n.label}
              </button>
            ))}
          </nav>
          <button className="cart-btn" aria-label={`Keranjang, ${cartCount} item`} onClick={() => go('keranjang')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 7h12l-1 13H7z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      <main>
        <Suspense fallback={<div className="page-loading container" role="status">Memuat halaman…</div>}>
        {page === 'home' && <Home go={go} live={live} />}
        {page === 'jastip' && <Jastip />}
        {page === 'harga' && <Harga />}
        {page === 'paket' && <Paket addToCart={addToCart} />}
        {page === 'kebijakan' && <Kebijakan go={go} />}
        {page === 'keranjang' && <Keranjang cart={cart} changeQty={changeQty} removeLine={removeLine} go={go} />}
        </Suspense>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <div className="brand static">
              <Logo size={28} />
              <span>Palred</span>
            </div>
            <p className="muted">Pasar tradisional, harga transparan, dapur UMKM makin efisien.</p>
          </div>
          <div className="footer-links">
            {NAV.slice(1).map((n) => (
              <button key={n.id} onClick={() => go(n.id)}>{n.label}</button>
            ))}
          </div>
          <p className="muted small">© 2026 Palred · Desain prototipe — data harga masih simulasi</p>
        </div>
      </footer>

      {toast && (
        <div className="toast" key={toast.key} role="status">
          {toast.msg}
        </div>
      )}
    </div>
  )
}
