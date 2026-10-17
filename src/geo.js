const EARTH_RADIUS_KM = 6371
const toRad = (deg) => (deg * Math.PI) / 180

// Straight line x 1.3 approximates road distance. TODO: validate against real routes.
export const ROAD_FACTOR = 1.3
// TODO: validate delivery rates with the team. Current numbers are placeholders.
export const BASE_FEE = 8000
export const PER_KM_FEE = 2500
// Beyond this straight-line distance from the nearest market we do not offer delivery.
export const SERVICE_RADIUS_KM = 25

export function haversineKm(a, b) {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

export const roadKm = (a, b) => haversineKm(a, b) * ROAD_FACTOR

export const deliveryFee = (km) => Math.round(BASE_FEE + km * PER_KM_FEE)

export function rankMarkets(markets, origin) {
  return markets
    .map((m) => ({ ...m, straightKm: haversineKm(origin, m), km: roadKm(origin, m) }))
    .sort((a, b) => a.straightKm - b.straightKm)
}
