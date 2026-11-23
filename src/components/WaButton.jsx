import { useState } from 'react'
import { openWhatsApp, waReady } from '../whatsapp.js'

export default function WaButton({ text, label = 'Kirim pesanan ke WhatsApp', disabled, validate }) {
  const [sent, setSent] = useState(false)
  if (!waReady) {
    return (
      <p className="wa-missing small" role="note">
        Nomor WhatsApp tim belum diatur (<code>VITE_WA_NUMBER</code>), jadi pesanan belum bisa dikirim.
      </p>
    )
  }
  return (
    <>
      <button className="btn wa block" disabled={disabled} onClick={() => {
        if (validate && !validate()) return
        if (openWhatsApp(typeof text === 'function' ? text() : text)) setSent(true)
      }}>
        <WaIcon /> {label}
      </button>
      {sent && <p className="muted small wa-sent" role="status">WhatsApp sudah dibuka. Tekan kirim di sana supaya pesanan masuk ke tim.</p>}
    </>
  )
}

export function WaIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
    </svg>
  )
}
