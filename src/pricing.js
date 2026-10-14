import { packPrice } from './data.js'
import { referencePrice, usePriceData } from './prices.js'

// provName kosong = rata-rata nasional. Satu hook dipakai Jastip, Paket Masak, dan Home supaya angkanya sama.
export function usePricing(provName) {
  const state = usePriceData()
  const ready = state.status === 'ready'

  const priceOf = (key) => (ready ? referencePrice(state.data, state.meta, key, provName)?.value : undefined)
  const refOf = (key) => (ready ? referencePrice(state.data, state.meta, key, provName) : null)
  const packFor = (recipe, portions) => (ready ? packPrice(recipe, portions, priceOf) : null)

  return { status: state.status, retry: state.retry, date: ready ? state.meta.latest : null, priceOf, refOf, packFor }
}
