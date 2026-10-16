import { Sparkline } from './Art.jsx'
import { rupiah } from '../data.js'
import { formatTanggal } from '../prices.js'
import { useCountUp } from '../useCountUp.js'

const ITEMS = [
  { key: 'cabai-merah-keriting', label: 'Cabai merah keriting' },
  { key: 'telur-ayam', label: 'Telur ayam' },
  { key: 'beras-medium-1', label: 'Beras medium' },
]

const persen = (n) => Math.abs(n).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function HeroPrice({ label, price, diff, series }) {
  const shown = useCountUp(price)
  const dir = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat'
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        <span className="price-now">{rupiah(shown)}</span>
        {diff != null && (
          <span className={`chip ${dir}`}>{diff > 0 ? '▲' : diff < 0 ? '▼' : '■'} {persen(diff)}%</span>
        )}
        <Sparkline data={series} w={88} h={26} up={diff > 0} tone="light" />
      </dd>
    </div>
  )
}

export default function HeroPrices({ pricing }) {
  if (pricing.status === 'loading') return <p className="hero-prices muted small" role="status">Memuat harga hari ini…</p>
  if (pricing.status !== 'ready') return <p className="hero-prices muted small">Harga hari ini belum bisa ditampilkan.</p>

  return (
    <div className="hero-prices">
      <dl>
        {ITEMS.map(({ key, label }) => {
          const price = pricing.priceOf(key)
          if (price == null) return null
          return <HeroPrice key={key} label={label} price={price} diff={pricing.changeOf(key)} series={pricing.seriesOf(key)} />
        })}
      </dl>
      <p className="muted small no-m">Rata-rata nasional per {formatTanggal(pricing.date)} · PIHPS Bank Indonesia. Garis kecil = 14 hari terakhir.</p>
    </div>
  )
}
