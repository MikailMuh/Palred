import { packPrice, retailPrice } from './data.js'
import { referencePrice, seriesUntil, usePriceData, valueAt } from './prices.js'

// provName kosong = rata-rata nasional. Satu hook dipakai Jastip, Paket Masak, dan Home supaya angkanya sama.
export function usePricing(provName) {
  const state = usePriceData()
  const ready = state.status === 'ready'

  const priceOf = (key) => (ready ? referencePrice(state.data, state.meta, key, provName)?.value : undefined)
  const refOf = (key) => (ready ? referencePrice(state.data, state.meta, key, provName) : null)
  const packFor = (recipe, portions) => (ready ? packPrice(recipe, portions, priceOf) : null)

  const retailFor = (recipe, portions) => (ready ? retailPrice(recipe, portions, priceOf) : null)

  // Selisih rata-rata nasional vs hari data sebelumnya, dalam persen. null kalau salah satu hari tidak ada datanya.
  const changeOf = (key) => {
    if (!ready || !state.meta.previous) return null
    const now = valueAt(state.data, key, state.meta.latest, '')
    const before = valueAt(state.data, key, state.meta.previous, '')
    return now != null && before != null ? ((now - before) / before) * 100 : null
  }

  // Harga rata-rata nasional beberapa hari terakhir, untuk sparkline.
  const seriesOf = (key, days = 14) => (ready ? seriesUntil(state.data, key, state.meta.latest, '').slice(-days).map((p) => p.value) : [])
  const nameOf = (key) => (ready ? state.data.commodities?.[key]?.name : undefined)

  return { status: state.status, retry: state.retry, date: ready ? state.meta.latest : null, checkedAt: ready ? state.meta.checkedAt : null, priceOf, refOf, packFor, retailFor, changeOf, seriesOf, nameOf }
}
