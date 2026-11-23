// Kirim pesanan lewat WhatsApp (wa.me). Nomor tujuan diatur lewat env VITE_WA_NUMBER, misalnya 081234567890 atau 6281234567890.

const toIntl = (raw) => {
  const d = String(raw ?? '').replace(/\D/g, '')
  if (!d) return ''
  if (d.startsWith('62')) return d
  if (d.startsWith('0')) return '62' + d.slice(1)
  if (d.startsWith('8')) return '62' + d
  return d
}

export const WA_NUMBER = toIntl(import.meta.env.VITE_WA_NUMBER)
export const waReady = WA_NUMBER.length >= 10

export const waLink = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`

// Buka chat di tab baru; kalau popup diblokir, pindah di tab yang sama.
export function openWhatsApp(text) {
  if (!waReady) return false
  const url = waLink(text)
  const win = window.open(url, '_blank', 'noopener')
  if (!win) window.location.href = url
  return true
}
