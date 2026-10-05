import { useEffect, useRef, useState } from 'react'

// Data dummy untuk keperluan desain — ganti dengan API asli nanti.

export const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

export const angka = (n) => new Intl.NumberFormat('id-ID').format(Math.round(n))

export const regions = [
  { id: 'jkt', name: 'DKI Jakarta', factor: 1.08 },
  { id: 'jabar', name: 'Jawa Barat', factor: 1.0 },
  { id: 'jatim', name: 'Jawa Timur', factor: 0.94 },
  { id: 'sumut', name: 'Sumatera Utara', factor: 1.05 },
  { id: 'sulsel', name: 'Sulawesi Selatan', factor: 1.12 },
  { id: 'bali', name: 'Bali', factor: 1.1 },
]

export const categories = ['Semua', 'Sayur', 'Bumbu', 'Protein', 'Sembako']

export const commodities = [
  { id: 'cabai-merah', name: 'Cabai Merah Keriting', unit: 'kg', cat: 'Bumbu', icon: 'cabai', base: 42500 },
  { id: 'cabai-rawit', name: 'Cabai Rawit Merah', unit: 'kg', cat: 'Bumbu', icon: 'cabai', base: 56000 },
  { id: 'bawang-merah', name: 'Bawang Merah', unit: 'kg', cat: 'Bumbu', icon: 'bawang', base: 38000 },
  { id: 'bawang-putih', name: 'Bawang Putih', unit: 'kg', cat: 'Bumbu', icon: 'bawangPutih', base: 36500 },
  { id: 'jahe', name: 'Jahe', unit: 'kg', cat: 'Bumbu', icon: 'jahe', base: 24000 },
  { id: 'tomat', name: 'Tomat', unit: 'kg', cat: 'Sayur', icon: 'tomat', base: 14000 },
  { id: 'wortel', name: 'Wortel', unit: 'kg', cat: 'Sayur', icon: 'wortel', base: 13500 },
  { id: 'kentang', name: 'Kentang', unit: 'kg', cat: 'Sayur', icon: 'kentang', base: 17000 },
  { id: 'kangkung', name: 'Kangkung', unit: 'ikat', cat: 'Sayur', icon: 'sayur', base: 4000 },
  { id: 'daging-sapi', name: 'Daging Sapi Murni', unit: 'kg', cat: 'Protein', icon: 'daging', base: 134000 },
  { id: 'ayam', name: 'Daging Ayam Ras', unit: 'kg', cat: 'Protein', icon: 'ayam', base: 37500 },
  { id: 'telur', name: 'Telur Ayam Ras', unit: 'kg', cat: 'Protein', icon: 'telur', base: 29000 },
  { id: 'ikan', name: 'Ikan Kembung', unit: 'kg', cat: 'Protein', icon: 'ikan', base: 42000 },
  { id: 'tahu', name: 'Tahu Putih', unit: 'papan', cat: 'Protein', icon: 'tahu', base: 12000 },
  { id: 'beras', name: 'Beras Medium', unit: 'kg', cat: 'Sembako', icon: 'beras', base: 13200 },
  { id: 'minyak', name: 'Minyak Goreng', unit: 'liter', cat: 'Sembako', icon: 'minyak', base: 17500 },
  { id: 'gula', name: 'Gula Pasir', unit: 'kg', cat: 'Sembako', icon: 'gula', base: 17800 },
  { id: 'kelapa', name: 'Kelapa Parut', unit: 'butir', cat: 'Sembako', icon: 'kelapa', base: 11000 },
]

export const markets = [
  { id: 'kramatjati', name: 'Pasar Induk Kramat Jati', area: 'Jakarta Timur', km: 3.2, open: '00.00 – 10.00', rating: 4.7 },
  { id: 'senen', name: 'Pasar Senen', area: 'Jakarta Pusat', km: 5.8, open: '04.00 – 16.00', rating: 4.5 },
  { id: 'minggu', name: 'Pasar Minggu', area: 'Jakarta Selatan', km: 7.1, open: '03.00 – 14.00', rating: 4.6 },
  { id: 'kebayoran', name: 'Pasar Kebayoran Lama', area: 'Jakarta Selatan', km: 9.4, open: '02.00 – 12.00', rating: 4.4 },
]

export const slots = ['05.00 – 07.00', '07.00 – 09.00', '09.00 – 11.00', '13.00 – 15.00']

// qty = takaran untuk 2 porsi
export const recipes = [
  {
    id: 'rendang', name: 'Rendang Sapi', origin: 'Sumatera Barat', minutes: 180, level: 'Sulit', type: 'Berkuah',
    dish: { base: '#6B3A22', garnish: '#2F7A4B', style: 'plate' },
    desc: 'Daging sapi dimasak lama dengan santan dan bumbu rempah hingga kering dan meresap.',
    ingredients: [
      { name: 'Daging sapi has dalam', icon: 'daging', qty: 300, unit: 'g', price: 40200 },
      { name: 'Santan kelapa', icon: 'kelapa', qty: 400, unit: 'ml', price: 9000 },
      { name: 'Bawang merah', icon: 'bawang', qty: 60, unit: 'g', price: 2300 },
      { name: 'Bawang putih', icon: 'bawangPutih', qty: 30, unit: 'g', price: 1100 },
      { name: 'Cabai merah keriting', icon: 'cabai', qty: 50, unit: 'g', price: 2100 },
      { name: 'Jahe & lengkuas', icon: 'jahe', qty: 25, unit: 'g', price: 900 },
    ],
  },
  {
    id: 'soto', name: 'Soto Ayam Kuning', origin: 'Jawa Timur', minutes: 60, level: 'Sedang', type: 'Berkuah',
    dish: { base: '#E8B04B', garnish: '#2F7A4B', style: 'bowl' },
    desc: 'Kuah kuning kunyit yang segar dengan suwiran ayam, telur, dan taburan bawang goreng.',
    ingredients: [
      { name: 'Ayam potong', icon: 'ayam', qty: 350, unit: 'g', price: 13100 },
      { name: 'Telur ayam', icon: 'telur', qty: 2, unit: 'butir', price: 3600 },
      { name: 'Bawang merah', icon: 'bawang', qty: 40, unit: 'g', price: 1500 },
      { name: 'Bawang putih', icon: 'bawangPutih', qty: 20, unit: 'g', price: 700 },
      { name: 'Kunyit & jahe', icon: 'jahe', qty: 20, unit: 'g', price: 700 },
      { name: 'Kentang', icon: 'kentang', qty: 150, unit: 'g', price: 2600 },
    ],
  },
  {
    id: 'sayurasem', name: 'Sayur Asem', origin: 'Jawa Barat', minutes: 40, level: 'Mudah', type: 'Sayur',
    dish: { base: '#C9A24A', garnish: '#4FA35F', style: 'bowl' },
    desc: 'Sayur segar berkuah asam manis — cocok untuk menu harian warung.',
    ingredients: [
      { name: 'Paket sayur (labu, kacang, melinjo)', icon: 'sayur', qty: 300, unit: 'g', price: 6000 },
      { name: 'Jagung manis', icon: 'wortel', qty: 1, unit: 'tongkol', price: 3000 },
      { name: 'Tomat', icon: 'tomat', qty: 80, unit: 'g', price: 1100 },
      { name: 'Bawang merah', icon: 'bawang', qty: 30, unit: 'g', price: 1100 },
      { name: 'Cabai merah', icon: 'cabai', qty: 20, unit: 'g', price: 900 },
    ],
  },
  {
    id: 'nasgor', name: 'Nasi Goreng Kampung', origin: 'Nasional', minutes: 20, level: 'Mudah', type: 'Goreng',
    dish: { base: '#B5652F', garnish: '#2F7A4B', style: 'plate' },
    desc: 'Nasi goreng bumbu ulek dengan telur ceplok — favorit menu UMKM kaki lima.',
    ingredients: [
      { name: 'Beras (untuk nasi)', icon: 'beras', qty: 200, unit: 'g', price: 2700 },
      { name: 'Telur ayam', icon: 'telur', qty: 2, unit: 'butir', price: 3600 },
      { name: 'Bawang merah', icon: 'bawang', qty: 30, unit: 'g', price: 1100 },
      { name: 'Cabai rawit', icon: 'cabai', qty: 15, unit: 'g', price: 850 },
      { name: 'Minyak goreng', icon: 'minyak', qty: 50, unit: 'ml', price: 900 },
    ],
  },
  {
    id: 'opor', name: 'Opor Ayam', origin: 'Jawa Tengah', minutes: 75, level: 'Sedang', type: 'Berkuah',
    dish: { base: '#F1DDB0', garnish: '#2F7A4B', style: 'bowl' },
    desc: 'Ayam dalam kuah santan gurih yang lembut, cocok dengan ketupat.',
    ingredients: [
      { name: 'Ayam potong', icon: 'ayam', qty: 400, unit: 'g', price: 15000 },
      { name: 'Santan kelapa', icon: 'kelapa', qty: 350, unit: 'ml', price: 8000 },
      { name: 'Bawang merah', icon: 'bawang', qty: 40, unit: 'g', price: 1500 },
      { name: 'Bawang putih', icon: 'bawangPutih', qty: 25, unit: 'g', price: 900 },
      { name: 'Jahe & kemiri', icon: 'jahe', qty: 20, unit: 'g', price: 1200 },
    ],
  },
  {
    id: 'ikanbalado', name: 'Ikan Kembung Balado', origin: 'Sumatera Barat', minutes: 35, level: 'Mudah', type: 'Goreng',
    dish: { base: '#D9442B', garnish: '#2F7A4B', style: 'plate' },
    desc: 'Ikan kembung goreng disiram sambal balado merah yang pedas manis.',
    ingredients: [
      { name: 'Ikan kembung', icon: 'ikan', qty: 400, unit: 'g', price: 16800 },
      { name: 'Cabai merah keriting', icon: 'cabai', qty: 100, unit: 'g', price: 4300 },
      { name: 'Tomat', icon: 'tomat', qty: 100, unit: 'g', price: 1400 },
      { name: 'Bawang merah', icon: 'bawang', qty: 40, unit: 'g', price: 1500 },
      { name: 'Minyak goreng', icon: 'minyak', qty: 150, unit: 'ml', price: 2600 },
    ],
  },
]

export const packPrice = (recipe, portions) =>
  Math.round((recipe.ingredients.reduce((s, i) => s + i.price, 0) * portions) / 2 / 100) * 100

// Simulasi feed harga realtime: tiap tick beberapa komoditas bergeser sedikit.
const HISTORY = 24

function seed(regionFactor) {
  const out = {}
  for (const c of commodities) {
    const start = c.base * regionFactor
    const hist = [start]
    for (let i = 1; i < HISTORY; i++) hist.push(hist[i - 1] * (1 + (Math.random() - 0.5) * 0.03))
    out[c.id] = { price: hist[HISTORY - 1], open: hist[0], history: hist, flash: null }
  }
  return out
}

export function useLivePrices(regionId) {
  const region = regions.find((r) => r.id === regionId) ?? regions[0]
  const [state, setState] = useState(() => seed(region.factor))
  const [updatedAt, setUpdatedAt] = useState(new Date())
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setState(seed(region.factor))
  }, [region.factor])

  useEffect(() => {
    const t = setInterval(() => {
      setState((prev) => {
        const next = {}
        const ids = Object.keys(prev)
        for (const id of ids) next[id] = { ...prev[id], flash: null }
        for (let k = 0; k < 3; k++) {
          const id = ids[Math.floor(Math.random() * ids.length)]
          const cur = next[id]
          const price = cur.price * (1 + (Math.random() - 0.48) * 0.025)
          next[id] = {
            ...cur,
            price,
            history: [...cur.history.slice(1), price],
            flash: price >= cur.price ? 'up' : 'down',
          }
        }
        return next
      })
      setUpdatedAt(new Date())
    }, 2600)
    return () => clearInterval(t)
  }, [])

  return { prices: state, updatedAt, region }
}
