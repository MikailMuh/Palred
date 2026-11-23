import { useEffect, useRef, useState } from 'react'
import Icon from '../components/Icon.jsx'
import InstallStrip from '../components/InstallStrip.jsx'
import Movers from '../components/Movers.jsx'
import Ticker from '../components/Ticker.jsx'
import DataStamp from '../components/DataStamp.jsx'
import { Billboard, Courier, DishPhoto, HeroMarket, PackageBox, Produce, Sparkline } from '../components/Art.jsx'
import { recipes, rupiah, slots } from '../data.js'
import { PRICE_GROUPS } from '../prices.js'
import { usePricing } from '../pricing.js'
import { useReveal } from '../useReveal.js'

const persen = (n) => Math.abs(n).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const CATEGORIES = [
  { label: 'Sayur Segar', photo: 'wortel', to: 'jastip' },
  { label: 'Bumbu Dapur', photo: 'cabai', to: 'jastip' },
  { label: 'Daging & Ayam', photo: 'daging', to: 'jastip' },
  { label: 'Telur & Tahu', photo: 'telur', to: 'jastip' },
  { label: 'Ikan', photo: 'ikan', to: 'jastip' },
  { label: 'Sembako', photo: 'beras', to: 'jastip' },
  { label: 'Paket Masak', dish: 'rendang', to: 'paket' },
  { label: 'Cek Harga', photo: 'bawang', to: 'harga', badge: 'Live' },
]

const TRUST = [
  { icon: 'shield', title: 'Harga transparan', text: 'Patokan PIHPS Bank Indonesia' },
  { icon: 'camera', title: 'Foto sebelum bayar', text: 'Kamu setujui dulu bahannya' },
  { icon: 'clock', title: 'Antar pagi', text: `Slot mulai ${slots[0].split(' ')[0]} WIB` },
  { icon: 'truck', title: 'Langsung ke dapur', text: 'Lacak kurir sampai tiba' },
]

const FAQ = [
  ['Apa itu TitipinBro?', 'Layanan untuk UMKM kuliner: titip belanja ke pasar tradisional, pantau harga pangan harian dari PIHPS Bank Indonesia, dan pesan paket bahan yang sudah ditakar per resep.'],
  ['Pasar mana saja yang dilayani?', 'Saat ini Pasar Induk Kramat Jati, Pasar Senen, Pasar Minggu, dan Pasar Kebayoran Lama di Jakarta. Ongkir otomatis dihitung untuk alamat sampai sekitar 25 km dari pasar.'],
  ['Berapa biaya jasanya?', 'Biaya jasa 8% dari nilai belanja, minimal Rp15.000. Ongkir dihitung dari jarak, dan totalnya terlihat sebelum kamu memesan.'],
  ['Harga di katalog itu harga final?', 'Bukan. Harga katalog adalah patokan. Tagihan akhir mengikuti struk atau harga yang dibayar di lapak, dan foto struk dikirim bersama pesanan.'],
  ['Kalau barangnya kosong atau rusak?', 'Kamu pilih sendiri di form: diganti yang mirip, dilewati, atau dihubungi dulu. Barang rusak bisa dilaporkan lewat WhatsApp saat diterima, lengkap dengan foto.'],
]

export default function Home({ go, addToCart }) {
  const pricing = usePricing()
  useReveal()

  return (
    <>
      <Ticker pricing={pricing} />
      <NextSlot go={go} />

      <section className="container hero-bento">
        <HeroCarousel go={go} pricing={pricing} />

        <button className="promo promo-yellow" onClick={() => go('paket')}>
          <div>
            <span className="promo-kicker">Paket Masak</span>
            <strong>Bahan ditakar per resep</strong>
            <span className="promo-link">Pilih menu <Icon name="arrow" size={16} /></span>
          </div>
          <div className="promo-photo"><DishPhoto id="nasgor" /></div>
        </button>

        <button className="promo promo-red" onClick={() => go('harga')}>
          <div>
            <span className="promo-kicker"><span className="live-dot" /> Billboard Harga</span>
            <strong>{pricing.status === 'ready' ? <>Cabai keriting {rupiah(pricing.priceOf('cabai-merah-keriting'))}<small>/kg</small></> : 'Harga pangan hari ini'}</strong>
            <span className="promo-link">Lihat semua harga <Icon name="arrow" size={16} /></span>
          </div>
          <div className="promo-photo round"><Produce type="cabai" size={120} /></div>
        </button>
      </section>

      <section className="container trust" aria-label="Kenapa TitipinBro">
        {TRUST.map((t) => (
          <div key={t.title} className="trust-item">
            <span className="trust-icon"><Icon name={t.icon} size={20} /></span>
            <div>
              <strong>{t.title}</strong>
              <span>{t.text}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="container section-sm">
        <div className="section-head">
          <h2>Belanja per kategori</h2>
        </div>
        <div className="cats">
          {CATEGORIES.map((c, i) => (
            <button key={c.label} className="cat" style={{ '--i': i }} onClick={() => go(c.to)}>
              <span className="cat-label">{c.label}</span>
              {c.badge && <span className="cat-badge"><span className="live-dot" />{c.badge}</span>}
              <span className="cat-photo">{c.dish ? <DishPhoto id={c.dish} /> : <Produce type={c.photo} size={120} shape="free" />}</span>
            </button>
          ))}
        </div>
      </section>

      <InstallStrip />

      <section className="container section-sm">
        <div className="section-head row between">
          <div>
            <h2>Harga hari ini</h2>
            {pricing.status === 'ready' && (
              <p className="muted small no-m">
                <DataStamp date={pricing.date} checkedAt={pricing.checkedAt} label="Rata-rata nasional per" /> · PIHPS Bank Indonesia
              </p>
            )}
          </div>
          <button className="see-all" onClick={() => go('harga')}>Lihat semua <Icon name="arrow" size={16} /></button>
        </div>
        <PriceRail pricing={pricing} go={go} />
      </section>

      <section className="container section" data-reveal>
        <div className="section-head row between">
          <div>
            <span className="eyebrow">Paling sering dipesan</span>
            <h2>Paket masak terlaris</h2>
            <p className="muted no-m">Perkiraan harga untuk 2 porsi, dihitung dari harga PIHPS. Tekan + untuk langsung masukkan ke keranjang.</p>
          </div>
          <button className="see-all" onClick={() => go('paket')}>Semua paket <Icon name="arrow" size={16} /></button>
        </div>
        <div className="grid-3">
          {recipes.slice(0, 3).map((r) => <RecipeCard key={r.id} r={r} pricing={pricing} go={go} addToCart={addToCart} />)}
        </div>
      </section>

      <section className="container section" data-reveal>
        <div className="section-head">
          <span className="eyebrow">Layanan kami</span>
          <h2>Tiga cara TitipinBro bantu dapurmu</h2>
        </div>
        <div className="features">
          <Feature color="var(--tint-red)" art={<Courier />} tag="Jastip" title="Jastip dari pasar ke UMKM"
            text="Tulis daftar belanja, pilih pasar & jam antar. Shopper kami pilihkan bahan terbaik dan antar langsung ke warungmu."
            cta="Titip belanja" onClick={() => go('jastip')} />
          <Feature color="var(--tint-green)" art={<Billboard />} tag="Billboard" title="Harga harian per provinsi"
            text="Papan harga pangan dari PIHPS Bank Indonesia, diperbarui tiap hari kerja. Patokan jual-beli yang adil."
            cta="Lihat billboard" onClick={() => go('harga')} />
          <Feature color="var(--tint-yellow)" art={<PackageBox items={['daging', 'kelapa', 'cabai', 'bawang']} label="Paket Rendang" />} tag="Paket"
            title="Paket bahan per masakan" text="Pilih menu, tentukan porsi. Semua bahan sudah ditimbang sesuai takaran resep, tinggal masak."
            cta="Pilih paket" onClick={() => go('paket')} />
        </div>
      </section>

      <section className="container section" data-reveal>
        <Movers pricing={pricing} />
      </section>

      <section className="container section" data-reveal>
        <div className="section-head center">
          <span className="eyebrow">Cara kerja jastip</span>
          <h2>Empat langkah, bahan sampai dapur</h2>
        </div>
        <ol className="steps">
          {[
            ['receipt', 'Tulis daftar', 'Pilih dari katalog atau tulis titipan khusus.'],
            ['pin', 'Pilih pasar & jam', 'Pasar terdekat dan slot antar yang pas buat jam buka warung.'],
            ['camera', 'Shopper belanja', 'Foto bahan dikirim untuk kamu setujui sebelum dibayar.'],
            ['truck', 'Diantar ke dapur', 'Lacak kurir sampai bahan tiba di depan pintu.'],
          ].map(([icon, t, d], i) => (
            <li key={t}>
              <span className="step-icon"><Icon name={icon} size={22} /><span className="step-num">{i + 1}</span></span>
              <h3>{t}</h3>
              <p className="muted no-m">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container section faq-wrap" data-reveal>
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2>Pertanyaan yang sering ditanya</h2>
        </div>
        <div className="faq">
          {FAQ.map(([q, a], i) => <FaqItem key={q} q={q} a={a} defaultOpen={i === 0} />)}
        </div>
      </section>

      <section className="container section" data-reveal>
        <div className="cta-band">
          <div className="cta-photos" aria-hidden="true">
            {['tomat', 'cabai', 'bawang', 'telur'].map((t, i) => <Produce key={t} type={t} size={72} shape="circle" style={{ '--i': i }} />)}
          </div>
          <div>
            <h2>Dapur siap buka, bahan sudah datang.</h2>
            <p>Titip belanja hari ini, bahan diantar di slot pagi pilihanmu.</p>
          </div>
          <button className="btn primary lg" onClick={() => go('jastip')}>Titip sekarang <Icon name="arrow" size={18} /></button>
        </div>
      </section>
    </>
  )
}

/* Slot antar terdekat, dihitung dari jam mulai slot di data.js. */
function nextSlot(now) {
  const starts = slots.map((s) => s.split(' ')[0].split('.').map(Number))
  for (const dayOffset of [0, 1]) {
    for (const [h, m] of starts) {
      const t = new Date(now)
      t.setDate(t.getDate() + dayOffset)
      t.setHours(h, m, 0, 0)
      // Slot hari ini hanya bisa dipilih kalau masih ≥ 3 jam lagi (waktu belanja di pasar).
      if (t - now > 3 * 3600e3) return { at: t, label: `${dayOffset === 0 ? 'hari ini' : 'besok'} ${String(h).padStart(2, '0')}.${String(m).padStart(2, '0')}` }
    }
  }
  return null
}

function NextSlot({ go }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const slot = nextSlot(now)
  if (!slot) return null
  const left = Math.max(0, slot.at - now)
  const hh = Math.floor(left / 3600e3)
  const mm = Math.floor((left % 3600e3) / 60e3)
  const ss = Math.floor((left % 60e3) / 1e3)
  const pad = (n) => String(n).padStart(2, '0')
  return (
    <div className="container">
      <button className="next-slot" onClick={() => go('jastip')}>
        <span className="next-slot-icon"><Icon name="bolt" size={18} /></span>
        <span className="next-slot-text">
          <small>Slot antar terdekat</small>
          <strong>Tiba {slot.label} WIB</strong>
        </span>
        <span className="countdown" aria-label={`${hh} jam ${mm} menit lagi`}>
          <b>{pad(hh)}</b>:<b>{pad(mm)}</b>:<b>{pad(ss)}</b>
        </span>
        <Icon name="arrow" size={18} className="next-slot-arrow" />
      </button>
    </div>
  )
}

function HeroCarousel({ go, pricing }) {
  const cabai = pricing.status === 'ready' ? pricing.priceOf('cabai-merah-keriting') : null
  const rendang = recipes.find((r) => r.id === 'rendang')
  const rendangPack = rendang && pricing.packFor(rendang, 2)

  const slides = [
    {
      key: 'jastip',
      badge: 'Untuk UMKM kuliner Indonesia',
      title: 'Belanja pasar tanpa ke pasar.',
      lead: 'Titip belanja ke shopper kami, pantau harga harian per provinsi, atau pesan bahan yang sudah ditakar per resep.',
      cta: ['Mulai titip belanja', 'jastip'],
      cta2: ['Cek harga hari ini', 'harga'],
      art: <div className="hero-art"><HeroMarket /></div>,
      tone: 'green',
    },
    {
      key: 'harga',
      badge: 'Data PIHPS Bank Indonesia',
      title: cabai ? `Cabai keriting hari ini ${rupiah(cabai)}/kg` : 'Harga pangan, update tiap hari kerja.',
      lead: 'Bandingkan harga antarprovinsi sebelum belanja. Lihat yang naik dan turun dibanding hari sebelumnya.',
      cta: ['Buka billboard harga', 'harga'],
      art: (
        <div className="hero-orbit" aria-hidden="true">
          {['cabai', 'bawang', 'tomat', 'bawangPutih', 'telur'].map((t, i) => (
            <span key={t} className={`orb orb-${i}`}><Produce type={t} size={140} /></span>
          ))}
        </div>
      ),
      tone: 'red',
    },
    {
      key: 'paket',
      badge: 'Paket Masak',
      title: rendangPack ? `Rendang 2 porsi, bahan ${rupiah(rendangPack.total)}` : 'Bahan per resep, sudah ditakar.',
      lead: 'Semua bahan ditimbang sesuai takaran resep, dikemas terpisah, lengkap dengan kartu resep.',
      cta: ['Pilih paket masak', 'paket'],
      art: <div className="hero-dish"><DishPhoto id="rendang" /></div>,
      tone: 'amber',
    },
  ]

  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const drag = useRef(null)
  const n = slides.length

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => { if (!document.hidden) setI((x) => (x + 1) % n) }, 6000)
    return () => clearInterval(t)
  }, [paused, n])

  const onDown = (e) => { drag.current = { x: e.clientX, moved: false } }
  const onUp = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    if (Math.abs(dx) > 50) setI((x) => (x + (dx < 0 ? 1 : -1) + n) % n)
    drag.current = null
  }

  return (
    <div
      className="hero-main carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Sorotan TitipinBro"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={() => { drag.current = null }}
    >
      <div className="carousel-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s, k) => (
          <div key={s.key} className={`slide tone-${s.tone} ${k === i ? 'is-active' : ''}`} aria-hidden={k !== i} role="group" aria-roledescription="slide" aria-label={`${k + 1} dari ${n}`}>
            <div className="hero-copy">
              <span className="hero-badge"><Icon name="spark" size={14} /> {s.badge}</span>
              {k === 0 ? <h1>{s.title}</h1> : <h2 className="hero-title">{s.title}</h2>}
              <p className="hero-lead">{s.lead}</p>
              <div className="hero-cta">
                <button className="btn primary lg" tabIndex={k === i ? 0 : -1} onClick={() => go(s.cta[1])}>
                  {s.cta[0]} <Icon name="arrow" size={18} />
                </button>
                {s.cta2 && <button className="btn on-dark lg" tabIndex={k === i ? 0 : -1} onClick={() => go(s.cta2[1])}>{s.cta2[0]}</button>}
              </div>
            </div>
            {s.art}
          </div>
        ))}
      </div>
      <div className="carousel-dots" role="tablist" aria-label="Pilih slide">
        {slides.map((s, k) => (
          <button key={s.key} role="tab" aria-selected={k === i} aria-label={`Slide ${k + 1}`} className={k === i ? 'on' : ''} onClick={() => setI(k)}>
            {k === i && !paused && <span className="dot-fill" />}
          </button>
        ))}
      </div>
      <button className="carousel-nav prev" aria-label="Slide sebelumnya" onClick={() => setI((x) => (x - 1 + n) % n)}><Icon name="arrow" size={18} /></button>
      <button className="carousel-nav next" aria-label="Slide berikutnya" onClick={() => setI((x) => (x + 1) % n)}><Icon name="arrow" size={18} /></button>
    </div>
  )
}

function RecipeCard({ r, pricing, go, addToCart }) {
  const pack = pricing.packFor(r, 2)
  const [added, setAdded] = useState(false)
  const imgRef = useRef(null)
  const add = () => {
    addToCart({ recipeId: r.id, portions: 2 }, imgRef.current)
    setAdded(true)
    setTimeout(() => setAdded(false), 1400)
  }
  return (
    <article className="card recipe-card">
      <button className="dish-wrap photo" ref={imgRef} onClick={() => go('paket')} aria-label={`Lihat paket ${r.name}`}>
        <DishPhoto id={r.id} dish={r.dish} />
        <span className="level">{r.level}</span>
        <span className="time-chip"><Icon name="clock" size={13} /> {r.minutes} mnt</span>
      </button>
      <div className="recipe-meta">
        <h3>{r.name}</h3>
        <p className="muted small">{r.origin} · {r.ingredients.length} bahan</p>
        <div className="row between">
          <div>
            <div className="price">{pack ? rupiah(pack.total) : 'Belum tersedia'}</div>
            <div className="muted small">2 porsi</div>
          </div>
          <button className={`add-fab ${added ? 'done' : ''}`} disabled={!pack} onClick={add} aria-label={`Tambah paket ${r.name} 2 porsi ke keranjang`}>
            <Icon name={added ? 'check' : 'plus'} size={20} stroke={2.6} />
          </button>
        </div>
      </div>
    </article>
  )
}

function FaqItem({ q, a, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = `faq-${q.length}-${q.charCodeAt(0)}`
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-q" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {q}
        <Icon name="chevron" size={20} className="faq-chev" />
      </button>
      <div className="faq-a" id={id} role="region">
        <div><p>{a}</p></div>
      </div>
    </div>
  )
}

function PriceRail({ pricing, go }) {
  if (pricing.status === 'loading') {
    return (
      <div className="price-rail" role="status" aria-label="Memuat harga">
        {Array.from({ length: 6 }, (_, i) => <div key={i} className="price-card skeleton-card" />)}
      </div>
    )
  }
  if (pricing.status !== 'ready') return <p className="muted">Harga hari ini belum bisa ditampilkan.</p>

  const rows = PRICE_GROUPS.map((g) => ({
    id: g.id,
    icon: g.icon,
    name: pricing.nameOf(g.defaultKey) ?? g.id,
    price: pricing.priceOf(g.defaultKey),
    diff: pricing.changeOf(g.defaultKey),
    series: pricing.seriesOf(g.defaultKey),
  })).filter((r) => r.price != null)

  return (
    <div className="price-rail">
      {rows.map((r, i) => {
        const dir = r.diff > 0 ? 'up' : r.diff < 0 ? 'down' : 'flat'
        return (
          <button key={r.id} className="price-card" style={{ '--i': i }} onClick={() => go('harga')}>
            <span className="price-card-img"><Produce type={r.icon} size={200} shape="free" /></span>
            {r.diff != null && <span className={`chip ${dir}`}>{r.diff > 0 ? '▲' : r.diff < 0 ? '▼' : '■'} {persen(r.diff)}%</span>}
            <span className="price-card-name">{r.name}</span>
            <span className="price-card-price">{rupiah(r.price)}</span>
            <Sparkline data={r.series} w={120} h={24} up={r.diff > 0} tone="light" fluid />
          </button>
        )
      })}
    </div>
  )
}

function Feature({ color, art, tag, title, text, cta, onClick }) {
  return (
    <article className="card feature">
      <div className="feature-art" style={{ background: color }}>{art}</div>
      <span className="tag">{tag}</span>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
      <button className="link" onClick={onClick}>{cta} <Icon name="arrow" size={16} /></button>
    </article>
  )
}
