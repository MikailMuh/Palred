import { rupiah } from '../data.js'
import { formatTanggal } from '../prices.js'

const ITEMS = [
  { key: 'cabai-merah-keriting', label: 'Cabai merah keriting' },
  { key: 'telur-ayam', label: 'Telur ayam' },
  { key: 'beras-medium-1', label: 'Beras medium' },
]

const persen = (n) => Math.abs(n).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export default function HeroPrices({ pricing }) {
  if (pricing.status === 'loading') return <p className="hero-prices muted small" role="status">Memuat harga hari ini…</p>
  if (pricing.status !== 'ready') return <p className="hero-prices muted small">Harga hari ini belum bisa ditampilkan.</p>

  return (
    <div className="hero-prices">
      <dl>
        {ITEMS.map(({ key, label }) => {
          const price = pricing.priceOf(key)
          const diff = pricing.changeOf(key)
          if (price == null) return null
          const dir = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat'
          return (
            <div key={key}>
              <dt>{label}</dt>
              <dd>
                <span className="price-now">{rupiah(price)}</span>
                {diff != null && (
                  <span className={`chip ${dir}`}>{diff > 0 ? '▲' : diff < 0 ? '▼' : '■'} {persen(diff)}%</span>
                )}
              </dd>
            </div>
          )
        })}
      </dl>
      <p className="muted small no-m">Rata-rata nasional per {formatTanggal(pricing.date)} · PIHPS Bank Indonesia</p>
    </div>
  )
}
