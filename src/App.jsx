import { Suspense, useEffect, useState } from 'react'
import { Logo } from './components/Art.jsx'
import Icon from './components/Icon.jsx'
import InstallButton from './components/InstallButton.jsx'
import OfflineBanner from './components/OfflineBanner.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import { recipes } from './data.js'
import { lazyRetry } from './lazyRetry.js'
import Home from './pages/Home.jsx'
import { PriceDataContext, useFetchPriceData } from './prices.js'

const Jastip = lazyRetry(() => import('./pages/Jastip.jsx'))
const Harga = lazyRetry(() => import('./pages/Harga.jsx'))
const Paket = lazyRetry(() => import('./pages/Paket.jsx'))
const Keranjang = lazyRetry(() => import('./pages/Keranjang.jsx'))
const Kebijakan = lazyRetry(() => import('./pages/Kebijakan.jsx'))

const NAV = [
  { id: 'home', label: 'Beranda', short: 'Beranda', icon: 'home' },
  { id: 'jastip', label: 'Jastip Pasar', short: 'Jastip', icon: 'bag' },
  { id: 'harga', label: 'Billboard Harga', short: 'Harga', icon: 'chart' },
  { id: 'paket', label: 'Paket Masak', short: 'Paket', icon: 'box' },
]

const PATHS = { home: '/', jastip: '/jastip', harga: '/harga', paket: '/paket', keranjang: '/keranjang', kebijakan: '/kebijakan' }

const pageFromPath = (path) => {
  const clean = path.replace(/\/+$/, '') || '/'
  return Object.keys(PATHS).find((id) => PATHS[id] === clean) ?? 'home'
}

export default function App() {
  const priceData = useFetchPriceData()
  const [page, setPage] = useState(() => pageFromPath(window.location.pathname))
  const [cart, setCart] = useState([])
  const [toast, setToast] = useState(null)
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState({ q: '', key: 0 })

  const go = (id) => {
    if (id !== page) window.history.pushState(null, '', PATHS[id])
    setPage(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submitSearch = (e) => {
    e.preventDefault()
    setSearch({ q: query.trim(), key: Date.now() })
    go('harga')
  }

  useEffect(() => {
    const onPop = () => setPage(pageFromPath(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const titles = { home: 'TitipinBro · Lu Butuh, Kita Titipin', jastip: 'Jastip Pasar · TitipinBro', harga: 'Billboard Harga · TitipinBro', paket: 'Paket Masak · TitipinBro', keranjang: 'Keranjang · TitipinBro', kebijakan: 'Kebijakan Jastip · TitipinBro' }
    document.title = titles[page]
  }, [page])

  const notify = (msg) => setToast({ msg, key: Date.now() })
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  const sameLine = (l, recipeId, portions) => l.recipeId === recipeId && l.portions === portions

  // Gambar produk "terbang" dari sumber ke ikon keranjang yang sedang terlihat (header di desktop, tab bar di mobile).
  const flyToCart = (fromEl) => {
    if (!fromEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const target = [...document.querySelectorAll('.cart-btn, .tabbar .tab-icon')].find((el) => el.offsetParent !== null)
    const img = fromEl.querySelector('img') ?? (fromEl.tagName === 'IMG' ? fromEl : null)
    if (!target) return
    const a = fromEl.getBoundingClientRect()
    const b = target.getBoundingClientRect()
    const size = Math.min(120, a.width, a.height)
    const ghost = document.createElement(img ? 'img' : 'div')
    if (img) ghost.src = img.currentSrc || img.src
    ghost.className = 'fly-ghost'
    Object.assign(ghost.style, { width: `${size}px`, height: `${size}px`, left: `${a.left + a.width / 2 - size / 2}px`, top: `${a.top + a.height / 2 - size / 2}px` })
    document.body.appendChild(ghost)
    const dx = b.left + b.width / 2 - (a.left + a.width / 2)
    const dy = b.top + b.height / 2 - (a.top + a.height / 2)
    const anim = ghost.animate(
      [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 80}px) scale(0.7)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${dx}px, ${dy}px) scale(0.15)`, opacity: 0.4 },
      ],
      { duration: 750, easing: 'cubic-bezier(.5,0,.3,1)' },
    )
    anim.onfinish = () => {
      ghost.remove()
      target.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 320, easing: 'ease-out' })
    }
  }

  const addToCart = ({ recipeId, portions }, fromEl) => {
    flyToCart(fromEl)
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
    <PriceDataContext.Provider value={priceData}>
    <div className="app">
      <header className="topbar">
        <div className="container topbar-inner">
          <button className="brand" onClick={() => go('home')} aria-label="TitipinBro, ke beranda">
            <Logo size={38} />
            <span className="wordmark">Titipin<b>Bro</b></span>
          </button>
          <div className="loc-pill" title="Patokan harga dan area layanan jastip">
            <Icon name="pin" size={18} />
            <span><small>Antar ke</small>DKI Jakarta</span>
          </div>
          <form className="top-search" role="search" onSubmit={submitSearch}>
            <Icon name="search" size={18} />
            <input
              type="search"
              placeholder="Cari harga cabai, beras, telur…"
              aria-label="Cari harga komoditas"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <div className="topbar-actions">
            <ThemeToggle />
            <button className="cart-btn" aria-label={`Keranjang, ${cartCount} item`} onClick={() => go('keranjang')}>
              <Icon name="cart" size={20} />
              <span className="cart-label">Keranjang</span>
              {cartCount > 0 && <span className="badge" key={cartCount}>{cartCount}</span>}
            </button>
          </div>
        </div>
        <nav className="subnav" aria-label="Navigasi utama">
          <div className="container subnav-inner">
            {NAV.map((n) => (
              <button key={n.id} className={page === n.id ? 'active' : ''} aria-current={page === n.id ? 'page' : undefined} onClick={() => go(n.id)}>
                <Icon name={n.icon} size={18} />
                {n.label}
              </button>
            ))}
            <span className="subnav-note"><Icon name="shield" size={16} /> Patokan harga PIHPS Bank Indonesia</span>
          </div>
        </nav>
      </header>
      <OfflineBanner />

      <main>
        <Suspense fallback={<div className="page-loading container" role="status">Memuat halaman…</div>}>
        <div className="page-anim" key={page}>
        {page === 'home' && <Home go={go} addToCart={addToCart} />}
        {page === 'jastip' && <Jastip />}
        {page === 'harga' && <Harga key={search.key} initialQuery={search.q} />}
        {page === 'paket' && <Paket addToCart={addToCart} />}
        {page === 'kebijakan' && <Kebijakan go={go} />}
        {page === 'keranjang' && <Keranjang cart={cart} changeQty={changeQty} removeLine={removeLine} go={go} />}
        </div>
        </Suspense>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="brand static">
                <Logo size={36} />
                <span className="wordmark">Titipin<b>Bro</b></span>
              </div>
              <p className="tagline">Lu Butuh, Kita Titipin.</p>
              <p className="footer-muted">Pasar tradisional, harga transparan, dapur UMKM makin efisien.</p>
              <InstallButton className="btn light sm" />
            </div>
            <nav className="footer-col" aria-label="Menu footer">
              <h4>Layanan</h4>
              {NAV.slice(1).map((n) => (
                <button key={n.id} onClick={() => go(n.id)}>{n.label}</button>
              ))}
            </nav>
            <nav className="footer-col" aria-label="Bantuan">
              <h4>Bantuan</h4>
              <button onClick={() => go('kebijakan')}>Kebijakan jastip</button>
              <button onClick={() => go('keranjang')}>Keranjang saya</button>
            </nav>
            <div className="footer-col">
              <h4>Sumber data</h4>
              <p className="footer-muted small">Harga dari PIHPS Bank Indonesia, rata-rata per provinsi. Barang di luar PIHPS berlabel estimasi.</p>
            </div>
          </div>
          <div className="footer-bottom small">
            <span>© {new Date().getFullYear()} TitipinBro · Prototipe · <a className="footer-link" href="/img/food/CREDITS.txt" target="_blank" rel="noopener">Kredit foto</a></span>
            <span>Dibuat untuk UMKM kuliner Indonesia</span>
          </div>
        </div>
      </footer>

      <nav className="tabbar" aria-label="Navigasi bawah">
        {NAV.map((n) => (
          <button key={n.id} className={page === n.id ? 'active' : ''} aria-current={page === n.id ? 'page' : undefined} onClick={() => go(n.id)}>
            <Icon name={n.icon} size={22} />
            <span>{n.short}</span>
          </button>
        ))}
        <button className={page === 'keranjang' ? 'active' : ''} aria-current={page === 'keranjang' ? 'page' : undefined} onClick={() => go('keranjang')}>
          <span className="tab-icon">
            <Icon name="cart" size={22} />
            {cartCount > 0 && <span className="badge" key={cartCount}>{cartCount}</span>}
          </span>
          <span>Keranjang</span>
        </button>
      </nav>

      {toast && (
        <div className="toast" key={toast.key} role="status">
          <Icon name="check" size={18} stroke={2.6} />
          {toast.msg}
        </div>
      )}
    </div>
    </PriceDataContext.Provider>
  )
}
