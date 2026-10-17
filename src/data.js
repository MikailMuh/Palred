// Data dummy untuk keperluan desain. Komoditas dengan pihpsKey memakai harga PIHPS; sisanya `base` = estimasi, bukan data resmi.

export const rupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

export const angka = (n) => new Intl.NumberFormat('id-ID').format(Math.round(n))

export const categories = ['Semua', 'Sayur', 'Bumbu', 'Protein', 'Sembako']

export const commodities = [
  { id: 'cabai-merah', name: 'Cabai Merah Keriting', unit: 'kg', cat: 'Bumbu', icon: 'cabai', pihpsKey: 'cabai-merah-keriting', base: 42500 },
  { id: 'cabai-rawit', name: 'Cabai Rawit Merah', unit: 'kg', cat: 'Bumbu', icon: 'cabai', pihpsKey: 'cabai-rawit-merah', base: 56000 },
  { id: 'bawang-merah', name: 'Bawang Merah', unit: 'kg', cat: 'Bumbu', icon: 'bawang', pihpsKey: 'bawang-merah', base: 38000 },
  { id: 'bawang-putih', name: 'Bawang Putih', unit: 'kg', cat: 'Bumbu', icon: 'bawangPutih', pihpsKey: 'bawang-putih', base: 36500 },
  { id: 'jahe', name: 'Jahe', unit: 'kg', cat: 'Bumbu', icon: 'jahe', base: 24000 },
  { id: 'tomat', name: 'Tomat', unit: 'kg', cat: 'Sayur', icon: 'tomat', base: 14000 },
  { id: 'wortel', name: 'Wortel', unit: 'kg', cat: 'Sayur', icon: 'wortel', base: 13500 },
  { id: 'kentang', name: 'Kentang', unit: 'kg', cat: 'Sayur', icon: 'kentang', base: 17000 },
  { id: 'kangkung', name: 'Kangkung', unit: 'ikat', cat: 'Sayur', icon: 'sayur', base: 4000 },
  { id: 'daging-sapi', name: 'Daging Sapi Murni', unit: 'kg', cat: 'Protein', icon: 'daging', pihpsKey: 'daging-sapi-1', base: 134000 },
  { id: 'ayam', name: 'Daging Ayam Ras', unit: 'kg', cat: 'Protein', icon: 'ayam', pihpsKey: 'daging-ayam', base: 37500 },
  { id: 'telur', name: 'Telur Ayam Ras', unit: 'kg', cat: 'Protein', icon: 'telur', pihpsKey: 'telur-ayam', base: 29000 },
  { id: 'ikan', name: 'Ikan Kembung', unit: 'kg', cat: 'Protein', icon: 'ikan', base: 42000 },
  { id: 'tahu', name: 'Tahu Putih', unit: 'papan', cat: 'Protein', icon: 'tahu', base: 12000 },
  { id: 'beras', name: 'Beras Medium', unit: 'kg', cat: 'Sembako', icon: 'beras', pihpsKey: 'beras-medium-1', base: 13200 },
  { id: 'minyak', name: 'Minyak Goreng', unit: 'kg', cat: 'Sembako', icon: 'minyak', pihpsKey: 'minyak-curah', base: 17500 },
  { id: 'gula', name: 'Gula Pasir', unit: 'kg', cat: 'Sembako', icon: 'gula', pihpsKey: 'gula-lokal', base: 17800 },
  { id: 'kelapa', name: 'Kelapa Parut', unit: 'butir', cat: 'Sembako', icon: 'kelapa', base: 11000 },
]

// Coordinates from OpenStreetMap (Nominatim, 17 Okt 2026). TODO: verify the entrance points. Opening hours are our estimate, TODO verify.
export const markets = [
  { id: 'kramatjati', name: 'Pasar Induk Kramat Jati', area: 'Jakarta Timur', lat: -6.2942219, lng: 106.8720479, open: '00.00 – 10.00' },
  { id: 'senen', name: 'Pasar Senen', area: 'Jakarta Pusat', lat: -6.1744233, lng: 106.8445744, open: '04.00 – 16.00' },
  { id: 'minggu', name: 'Pasar Minggu', area: 'Jakarta Selatan', lat: -6.2833322, lng: 106.8448558, open: '03.00 – 14.00' },
  { id: 'kebayoran', name: 'Pasar Kebayoran Lama', area: 'Jakarta Selatan', lat: -6.2371412, lng: 106.7809418, open: '02.00 – 12.00' },
]

export const slots = ['05.00 – 07.00', '07.00 – 09.00', '09.00 – 11.00', '13.00 – 15.00']

// qty = takaran untuk 2 porsi
export const recipes = [
  {
    id: 'rendang', name: 'Rendang Sapi', origin: 'Sumatera Barat', minutes: 180, level: 'Sulit', type: 'Berkuah',
    dish: { base: '#6B3A22', garnish: '#2F7A4B', style: 'plate' },
    desc: 'Daging sapi dimasak lama dengan santan dan bumbu rempah hingga kering dan meresap.',
    ingredients: [
      { name: 'Daging sapi has dalam', icon: 'daging', qty: 300, unit: 'g', pihpsKey: 'daging-sapi-1' },
      { name: 'Santan kelapa', icon: 'kelapa', qty: 400, unit: 'ml', estPrice: 9000 },
      { name: 'Bawang merah', icon: 'bawang', qty: 60, unit: 'g', pihpsKey: 'bawang-merah' },
      { name: 'Bawang putih', icon: 'bawangPutih', qty: 30, unit: 'g', pihpsKey: 'bawang-putih' },
      { name: 'Cabai merah keriting', icon: 'cabai', qty: 50, unit: 'g', pihpsKey: 'cabai-merah-keriting' },
      { name: 'Jahe & lengkuas', icon: 'jahe', qty: 25, unit: 'g', estPrice: 900 },
    ],
  },
  {
    id: 'soto', name: 'Soto Ayam Kuning', origin: 'Jawa Timur', minutes: 60, level: 'Sedang', type: 'Berkuah',
    dish: { base: '#E8B04B', garnish: '#2F7A4B', style: 'bowl' },
    desc: 'Kuah kuning kunyit yang segar dengan suwiran ayam, telur, dan taburan bawang goreng.',
    ingredients: [
      { name: 'Ayam potong', icon: 'ayam', qty: 350, unit: 'g', pihpsKey: 'daging-ayam' },
      { name: 'Telur ayam', icon: 'telur', qty: 2, unit: 'butir', pihpsKey: 'telur-ayam', gramsEach: 60 },
      { name: 'Bawang merah', icon: 'bawang', qty: 40, unit: 'g', pihpsKey: 'bawang-merah' },
      { name: 'Bawang putih', icon: 'bawangPutih', qty: 20, unit: 'g', pihpsKey: 'bawang-putih' },
      { name: 'Kunyit & jahe', icon: 'jahe', qty: 20, unit: 'g', estPrice: 700 },
      { name: 'Kentang', icon: 'kentang', qty: 150, unit: 'g', estPrice: 2600 },
    ],
  },
  {
    id: 'sayurasem', name: 'Sayur Asem', origin: 'Jawa Barat', minutes: 40, level: 'Mudah', type: 'Sayur',
    dish: { base: '#C9A24A', garnish: '#4FA35F', style: 'bowl' },
    desc: 'Sayur segar berkuah asam manis, cocok untuk menu harian warung.',
    ingredients: [
      { name: 'Paket sayur (labu, kacang, melinjo)', icon: 'sayur', qty: 300, unit: 'g', estPrice: 6000 },
      { name: 'Jagung manis', icon: 'wortel', qty: 1, unit: 'tongkol', estPrice: 3000 },
      { name: 'Tomat', icon: 'tomat', qty: 80, unit: 'g', estPrice: 1100 },
      { name: 'Bawang merah', icon: 'bawang', qty: 30, unit: 'g', pihpsKey: 'bawang-merah' },
      { name: 'Cabai merah', icon: 'cabai', qty: 20, unit: 'g', pihpsKey: 'cabai-merah-keriting' },
    ],
  },
  {
    id: 'nasgor', name: 'Nasi Goreng Kampung', origin: 'Nasional', minutes: 20, level: 'Mudah', type: 'Goreng',
    dish: { base: '#B5652F', garnish: '#2F7A4B', style: 'plate' },
    desc: 'Nasi goreng bumbu ulek dengan telur ceplok, favorit menu UMKM kaki lima.',
    ingredients: [
      { name: 'Beras (untuk nasi)', icon: 'beras', qty: 200, unit: 'g', pihpsKey: 'beras-medium-1' },
      { name: 'Telur ayam', icon: 'telur', qty: 2, unit: 'butir', pihpsKey: 'telur-ayam', gramsEach: 60 },
      { name: 'Bawang merah', icon: 'bawang', qty: 30, unit: 'g', pihpsKey: 'bawang-merah' },
      { name: 'Cabai rawit', icon: 'cabai', qty: 15, unit: 'g', pihpsKey: 'cabai-rawit-merah' },
      { name: 'Minyak goreng', icon: 'minyak', qty: 50, unit: 'ml', pihpsKey: 'minyak-curah', gramsPerMl: 0.92 },
    ],
  },
  {
    id: 'opor', name: 'Opor Ayam', origin: 'Jawa Tengah', minutes: 75, level: 'Sedang', type: 'Berkuah',
    dish: { base: '#F1DDB0', garnish: '#2F7A4B', style: 'bowl' },
    desc: 'Ayam dalam kuah santan gurih yang lembut, cocok dengan ketupat.',
    ingredients: [
      { name: 'Ayam potong', icon: 'ayam', qty: 400, unit: 'g', pihpsKey: 'daging-ayam' },
      { name: 'Santan kelapa', icon: 'kelapa', qty: 350, unit: 'ml', estPrice: 8000 },
      { name: 'Bawang merah', icon: 'bawang', qty: 40, unit: 'g', pihpsKey: 'bawang-merah' },
      { name: 'Bawang putih', icon: 'bawangPutih', qty: 25, unit: 'g', pihpsKey: 'bawang-putih' },
      { name: 'Jahe & kemiri', icon: 'jahe', qty: 20, unit: 'g', estPrice: 1200 },
    ],
  },
  {
    id: 'ikanbalado', name: 'Ikan Kembung Balado', origin: 'Sumatera Barat', minutes: 35, level: 'Mudah', type: 'Goreng',
    dish: { base: '#D9442B', garnish: '#2F7A4B', style: 'plate' },
    desc: 'Ikan kembung goreng disiram sambal balado merah yang pedas manis.',
    ingredients: [
      { name: 'Ikan kembung', icon: 'ikan', qty: 400, unit: 'g', estPrice: 16800 },
      { name: 'Cabai merah keriting', icon: 'cabai', qty: 100, unit: 'g', pihpsKey: 'cabai-merah-keriting' },
      { name: 'Tomat', icon: 'tomat', qty: 100, unit: 'g', estPrice: 1400 },
      { name: 'Bawang merah', icon: 'bawang', qty: 40, unit: 'g', pihpsKey: 'bawang-merah' },
      { name: 'Minyak goreng', icon: 'minyak', qty: 150, unit: 'ml', pihpsKey: 'minyak-curah', gramsPerMl: 0.92 },
    ],
  },
]

// PIHPS: harga per kg untuk semua komoditas (dikonfirmasi dari bi.go.id/hargapangan, termasuk minyak goreng).
// TODO: gramsEach (berat 1 butir telur) dan gramsPerMl (massa jenis minyak) masih asumsi.
export const ingredientCost = (ing, pihpsValue) => {
  if (ing.pihpsKey) {
    if (pihpsValue == null) return null
    const grams = ing.unit === 'butir' ? ing.qty * ing.gramsEach : ing.unit === 'ml' ? ing.qty * ing.gramsPerMl : ing.qty
    return (pihpsValue * grams) / 1000
  }
  return ing.estPrice
}

// priceOf(key) mengembalikan harga PIHPS atau undefined. Hasil null = ada bahan PIHPS yang belum ada datanya.
export function packPrice(recipe, portions, priceOf) {
  let pihps = 0
  let estimate = 0
  for (const ing of recipe.ingredients) {
    const cost = ingredientCost(ing, ing.pihpsKey ? priceOf(ing.pihpsKey) : undefined)
    if (cost == null) return null
    if (ing.pihpsKey) pihps += cost
    else estimate += cost
  }
  const round = (n) => Math.round((n * portions) / 2 / 100) * 100
  return { total: round(pihps + estimate), pihps: round(pihps), estimate: round(estimate) }
}

// Pembelian minimum eceran per bahan PIHPS, dalam gram. ESTIMASI kami, belum divalidasi ke pedagang.
// TODO: validasi ke domain expert atau pedagang pasar sebelum angka selisih dipakai sebagai klaim.
export const RETAIL_MIN_GRAMS = {
  'daging-ayam': 500,
  'daging-sapi-1': 250,
  'telur-ayam': 60,
  'bawang-merah': 250,
  'bawang-putih': 100,
  'cabai-merah-keriting': 100,
  'cabai-rawit-merah': 100,
  'beras-medium-1': 1000,
  'minyak-curah': 500,
  'gula-lokal': 500,
}

// Biaya kalau bahan dibeli sendiri per kemasan minimum eceran. Bahan non-PIHPS memakai estimasi yang sama dengan paket.
export function retailPrice(recipe, portions, priceOf) {
  let total = 0
  for (const ing of recipe.ingredients) {
    if (!ing.pihpsKey) {
      total += (ing.estPrice * portions) / 2
      continue
    }
    const value = priceOf(ing.pihpsKey)
    const min = RETAIL_MIN_GRAMS[ing.pihpsKey]
    if (value == null || !min) return null
    const grams = (ing.unit === 'butir' ? ing.qty * ing.gramsEach : ing.unit === 'ml' ? ing.qty * ing.gramsPerMl : ing.qty) * (portions / 2)
    total += (Math.ceil(grams / min) * min * value) / 1000
  }
  return Math.round(total / 100) * 100
}
