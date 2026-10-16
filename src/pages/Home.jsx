import HeroPrices from '../components/HeroPrices.jsx'
import Movers from '../components/Movers.jsx'
import { Billboard, Courier, Dish, HeroMarket, PackageBox, Produce } from '../components/Art.jsx'
import { angka, commodities, recipes, rupiah } from '../data.js'
import { usePricing } from '../pricing.js'
import { useReveal } from '../useReveal.js'

export default function Home({ go, live }) {
  const { prices, region } = live
  const pricing = usePricing()
  useReveal()

  return (
    <>
      <Ticker prices={prices} />

      <section className="hero container">
        <div className="hero-copy">
          <span className="eyebrow">Untuk UMKM kuliner Indonesia</span>
          <h1>
            Belanja pasar tanpa ke pasar.
            <br />
            <span className="hl">Harga jelas, bahan siap masak.</span>
          </h1>
          <p className="lead">
            Palred menghubungkan dapur UMKM dengan pasar tradisional: titip belanja ke shopper kami,
            pantau harga komoditas per daerah secara langsung, atau pesan paket bahan yang sudah ditakar per resep.
          </p>
          <div className="row gap">
            <button className="btn primary" onClick={() => go('jastip')}>Mulai titip belanja</button>
            <button className="btn ghost" onClick={() => go('harga')}>Cek harga hari ini</button>
          </div>
          <HeroPrices pricing={pricing} />
        </div>
        <div className="hero-art">
          <HeroMarket />
        </div>
      </section>

      <section className="container section" data-reveal>
        <div className="section-head">
          <h2>Tiga cara Palred bantu dapurmu</h2>
          <p className="muted">Satu platform, dari pasar sampai kompor.</p>
        </div>
        <div className="features">
          <Feature
            color="var(--tint-red)"
            art={<Courier />}
            tag="01 · Jastip"
            title="Jastip dari pasar ke UMKM"
            text="Tulis daftar belanja, pilih pasar & jam antar. Shopper kami pilihkan bahan terbaik dan antar langsung ke warungmu."
            cta="Titip belanja"
            onClick={() => go('jastip')}
          />
          <Feature
            color="var(--tint-green)"
            art={<Billboard />}
            tag="02 · Billboard"
            title="Harga realtime per daerah"
            text="Papan harga komoditas yang terus diperbarui dari pasar di tiap provinsi — acuan jual-beli yang adil."
            cta="Lihat billboard"
            onClick={() => go('harga')}
          />
          <Feature
            color="var(--tint-yellow)"
            art={<PackageBox items={['daging', 'kelapa', 'cabai', 'bawang']} label="Paket Rendang" />}
            tag="03 · Paket"
            title="Paket bahan per masakan"
            text="Pilih menu, tentukan porsi. Semua bahan sudah ditimbang sesuai takaran resep — tinggal masak."
            cta="Pilih paket"
            onClick={() => go('paket')}
          />
        </div>
      </section>

      <section className="container section" data-reveal>
        <Movers pricing={pricing} />
      </section>

      <section className="container section split" data-reveal>
        <div>
          <span className="eyebrow">Harga hari ini · {region.name}</span>
          <h2>Pantau sebelum belanja</h2>
          <p className="muted">
            Harga di bawah bergerak otomatis mengikuti laporan pasar. Warna merah artinya naik dibanding pembukaan pagi.
          </p>
          <button className="btn ghost" onClick={() => go('harga')}>Buka billboard lengkap →</button>
        </div>
        <div className="mini-board">
          {commodities.slice(0, 6).map((c) => {
            const p = prices[c.id]
            const diff = ((p.price - p.open) / p.open) * 100
            return (
              <div key={c.id} className={`mini-row ${p.flash ?? ''}`}>
                <Produce type={c.icon} size={36} />
                <div className="grow">
                  <div className="strong">{c.name}</div>
                  <div className="muted small">per {c.unit}</div>
                </div>
                <div className="mini-price">Rp{angka(p.price)}</div>
                <span className={`chip ${diff >= 0 ? 'up' : 'down'}`}>
                  {diff >= 0 ? '▲' : '▼'} {Math.abs(diff).toFixed(1)}%
                </span>
              </div>
            )
          })}
        </div>
      </section>

      <section className="container section" data-reveal>
        <div className="section-head">
          <h2>Cara kerja jastip</h2>
        </div>
        <ol className="steps">
          {[
            ['Tulis daftar', 'Pilih dari katalog atau tulis titipan khusus.'],
            ['Pilih pasar & jam', 'Pasar terdekat dan slot antar yang pas buat jam buka warung.'],
            ['Shopper belanja', 'Foto bahan dikirim untuk kamu setujui sebelum dibayar.'],
            ['Diantar ke dapur', 'Lacak kurir sampai bahan tiba di depan pintu.'],
          ].map(([t, d], i) => (
            <li key={t}>
              <span className="step-num">{i + 1}</span>
              <h3>{t}</h3>
              <p className="muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container section" data-reveal>
        <div className="section-head row between">
          <div>
            <h2>Paket masak terlaris</h2>
            <p className="muted">Perkiraan harga untuk 2 porsi, dihitung dari harga PIHPS.</p>
          </div>
          <button className="btn ghost" onClick={() => go('paket')}>Semua paket →</button>
        </div>
        <div className="grid-3">
          {recipes.slice(0, 3).map((r) => (
            <button key={r.id} className="card recipe-card" onClick={() => go('paket')}>
              <div className="dish-wrap"><Dish {...r.dish} /></div>
              <div className="recipe-meta">
                <h3>{r.name}</h3>
                <p className="muted small">{r.origin} · {r.minutes} menit</p>
                <div className="price">{pricing.packFor(r, 2) ? rupiah(pricing.packFor(r, 2).total) : 'Harga belum tersedia'}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="container section" data-reveal>
        <div className="cta-band">
          <div>
            <h2>Punya warung atau katering?</h2>
            <p>Daftar sebagai mitra UMKM dan dapatkan biaya jasa 0% untuk 5 pesanan pertama.</p>
          </div>
          <button className="btn light" onClick={() => go('jastip')}>Daftar mitra</button>
        </div>
      </section>
    </>
  )
}

function Feature({ color, art, tag, title, text, cta, onClick }) {
  return (
    <article className="card feature">
      <div className="feature-art" style={{ background: color }}>{art}</div>
      <span className="tag">{tag}</span>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
      <button className="link" onClick={onClick}>{cta} →</button>
    </article>
  )
}

function Ticker({ prices }) {
  const row = (suffix) =>
    commodities.map((c) => {
      const p = prices[c.id]
      const diff = ((p.price - p.open) / p.open) * 100
      return (
        <span key={c.id + suffix} className="tick">
          {c.name} <b className="mono">Rp{angka(p.price)}</b>
          <i className={diff >= 0 ? 'up' : 'down'}>{diff >= 0 ? '▲' : '▼'}{Math.abs(diff).toFixed(1)}%</i>
        </span>
      )
    })
  return (
    <div className="ticker" aria-label="Ticker harga komoditas">
      <span className="live-pill"><span className="dot" /> LIVE</span>
      <div className="ticker-track">
        <div className="ticker-move">{row('a')}{row('b')}</div>
      </div>
    </div>
  )
}
