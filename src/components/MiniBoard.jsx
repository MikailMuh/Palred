import { Produce } from './Art.jsx'
import { rupiah } from '../data.js'
import { PRICE_GROUPS } from '../prices.js'

const persen = (n) => Math.abs(n).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const SHOWN = 6

export default function MiniBoard({ pricing }) {
  if (pricing.status === 'loading') return <div className="mini-board mini-board-empty" role="status">Memuat harga…</div>
  if (pricing.status !== 'ready') return <div className="mini-board mini-board-empty">Harga belum bisa ditampilkan.</div>

  const rows = PRICE_GROUPS.map((g) => ({
    id: g.id,
    icon: g.icon,
    name: pricing.nameOf(g.defaultKey) ?? g.id,
    price: pricing.priceOf(g.defaultKey),
    diff: pricing.changeOf(g.defaultKey),
  })).filter((r) => r.price != null).slice(0, SHOWN)

  return (
    <div className="mini-board">
      {rows.map((r) => {
        const dir = r.diff > 0 ? 'up' : r.diff < 0 ? 'down' : 'flat'
        return (
          <div key={r.id} className="mini-row">
            <Produce type={r.icon} size={36} />
            <div className="grow">
              <div className="strong">{r.name}</div>
              <div className="muted small">rata-rata nasional</div>
            </div>
            <div className="mini-price">{rupiah(r.price)}</div>
            {r.diff != null && <span className={`chip ${dir}`}>{r.diff > 0 ? '▲' : r.diff < 0 ? '▼' : '■'} {persen(r.diff)}%</span>}
          </div>
        )
      })}
    </div>
  )
}
