import { Produce } from './Art.jsx'
import { rupiah } from '../data.js'
import { PRICE_GROUPS, formatTanggal } from '../prices.js'

const persen = (n) => Math.abs(n).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
const TOP = 3

function Column({ title, rows, dir }) {
  return (
    <div>
      <h3 className="movers-title">{title}</h3>
      <div className="mini-board">
        {rows.map((r) => (
          <div key={r.id} className="mini-row">
            <Produce type={r.icon} size={36} />
            <div className="grow">
              <div className="strong">{r.name}</div>
              <div className="muted small">{rupiah(r.price)}</div>
            </div>
            <span className={`chip ${dir}`}>{dir === 'up' ? '▲' : '▼'} {persen(r.diff)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Movers({ pricing }) {
  if (pricing.status !== 'ready') return null

  const rows = PRICE_GROUPS.map((g) => ({
    id: g.id,
    icon: g.icon,
    name: pricing.nameOf(g.defaultKey) ?? g.id,
    price: pricing.priceOf(g.defaultKey),
    diff: pricing.changeOf(g.defaultKey),
  })).filter((r) => r.price != null && r.diff != null)

  const up = rows.filter((r) => r.diff > 0).sort((a, b) => b.diff - a.diff).slice(0, TOP)
  const down = rows.filter((r) => r.diff < 0).sort((a, b) => a.diff - b.diff).slice(0, TOP)

  return (
    <>
      <div className="section-head">
        <h2>Naik dan turun hari ini</h2>
        <p className="muted">Dibanding hari data sebelumnya, rata-rata nasional per {formatTanggal(pricing.date)} · PIHPS Bank Indonesia.</p>
      </div>
      {up.length === 0 && down.length === 0 && <p className="muted">Harga tidak berubah dibanding hari data sebelumnya.</p>}
      {up.length === 0 && down.length > 0 && <p className="muted small">Tidak ada komoditas utama yang naik.</p>}
      {down.length === 0 && up.length > 0 && <p className="muted small">Tidak ada komoditas utama yang turun.</p>}
      <div className={`movers ${up.length === 0 || down.length === 0 ? 'single' : ''}`}>
        {up.length > 0 && <Column title="Paling naik" rows={up} dir="up" />}
        {down.length > 0 && <Column title="Paling turun" rows={down} dir="down" />}
      </div>
    </>
  )
}
