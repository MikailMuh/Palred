import { rupiah } from '../data.js'
import { PRICE_GROUPS, formatTanggal } from '../prices.js'

const persen = (n) => Math.abs(n).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

export default function Ticker({ pricing }) {
  if (pricing.status !== 'ready') return <div className="ticker ticker-empty" aria-hidden="true" />

  const items = PRICE_GROUPS.map((g) => ({
    id: g.id,
    name: pricing.nameOf(g.defaultKey) ?? g.id,
    price: pricing.priceOf(g.defaultKey),
    diff: pricing.changeOf(g.defaultKey),
  })).filter((i) => i.price != null)

  const row = (suffix, hidden) =>
    items.map((i) => (
      <span key={i.id + suffix} className="tick" aria-hidden={hidden || undefined}>
        {i.name} <b className="mono">{rupiah(i.price)}</b>
        {i.diff != null && i.diff !== 0 && (
          <i className={i.diff > 0 ? 'up' : 'down'}>{i.diff > 0 ? '▲' : '▼'}{persen(i.diff)}%</i>
        )}
      </span>
    ))

  return (
    <div className="ticker" role="region" aria-label="Harga komoditas PIHPS">
      <span className="ticker-pill">PIHPS {formatTanggal(pricing.date, false)}</span>
      <div className="ticker-track">
        <div className="ticker-move">{row('a', false)}{row('b', true)}</div>
      </div>
    </div>
  )
}
