import { Sparkline } from './Art.jsx'
import { rupiah } from '../data.js'
import DataStamp from './DataStamp.jsx'
import { useCountUp } from '../useCountUp.js'

const ITEMS = [
  { key: 'cabai-merah-keriting', label: 'Cabai merah keriting', short: 'Cabai keriting' },
  { key: 'telur-ayam', label: 'Telur ayam', short: 'Telur ayam' },
  { key: 'beras-medium-1', label: 'Beras medium', short: 'Beras medium' },
]

const persen = (n) => Math.abs(n).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function HeroPrice({ label, short, price, diff, series }) {
  const shown = useCountUp(price)
  const dir = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat'
  return (
    <div>
      <dt><span className="lbl-full">{label}</span><span className="lbl-short">{short}</span></dt>
      <dd>
        <span className="price-now">{rupiah(shown)}</span>
        {diff != null && (
          <span className={`chip ${dir}`}>{diff > 0 ? '▲' : diff < 0 ? '▼' : '■'} {persen(diff)}%</span>
        )}
        <Sparkline data={series} w={88} h={26} up={diff > 0} tone="light" fluid />
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
        {ITEMS.map(({ key, label, short }) => {
          const price = pricing.priceOf(key)
          if (price == null) return null
          return <HeroPrice key={key} label={label} short={short} price={price} diff={pricing.changeOf(key)} series={pricing.seriesOf(key)} />
        })}
      </dl>
      <p className="muted small no-m">
        <DataStamp date={pricing.date} checkedAt={pricing.checkedAt} label="Rata-rata nasional per" /> · PIHPS Bank Indonesia. Garis kecil = 14 hari terakhir.
      </p>
    </div>
  )
}
