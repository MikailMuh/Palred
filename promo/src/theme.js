import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans'
import { loadFont as loadTitan } from '@remotion/google-fonts/TitanOne'

export const jakarta = loadJakarta('normal', { weights: ['500', '700', '800'], subsets: ['latin'] }).fontFamily
export const titan = loadTitan('normal', { weights: ['400'], subsets: ['latin'] }).fontFamily

// Warna sama dengan website (src/styles.css).
export const C = {
  green: '#08452a',
  greenDeep: '#06331f',
  leaf: '#2fb36b',
  yellow: '#ffc233',
  yellowSoft: '#fff4d6',
  red: '#d93d25',
  redLight: '#ff7a5c',
  amber: '#b36a0b',
  cream: '#fbf1e3',
  ink: '#0f1a14',
  white: '#ffffff',
  up: '#c33a22',
  down: '#0a7a45',
}

export const FPS = 30
export const URL_TEXT = 'palred.vercel.app'

// Data harga nyata dari PIHPS Bank Indonesia (rata-rata nasional) di public/data/prices.json.
export const PRICE_DATE = '20 Nov 2026'
export const PRICES = [
  { name: 'Cabai Rawit Merah', img: 'cabai', price: 91100, diff: -5.0 },
  { name: 'Cabai Merah Keriting', img: 'cabai', price: 80750, diff: -2.9 },
  { name: 'Bawang Putih', img: 'bawangPutih', price: 37900, diff: -1.6 },
  { name: 'Telur Ayam Ras', img: 'telur', price: 28900, diff: -0.3 },
]

// Perkiraan harga paket 2 porsi dari website pada tanggal yang sama.
export const PAKET = [
  { id: 'rendang', name: 'Rendang Sapi', price: 63300 },
  { id: 'soto', name: 'Soto Ayam Kuning', price: 22600 },
  { id: 'nasgor', name: 'Nasi Goreng Kampung', price: 10300 },
  { id: 'opor', name: 'Opor Ayam', price: 27100 },
]

export const rupiah = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID')
