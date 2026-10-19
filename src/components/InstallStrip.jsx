import { useState } from 'react'
import { useInstallPrompt } from '../useInstallPrompt.js'

const KEY = 'palred-install-dismissed'

const wasDismissed = () => {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export default function InstallStrip() {
  const { canInstall, showIosHint, install } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(wasDismissed)
  const [hint, setHint] = useState(false)

  if (dismissed || (!canInstall && !showIosHint)) return null

  const dismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* private mode: just hide for this visit */
    }
  }

  return (
    <section className="container install-strip-wrap" aria-label="Pasang aplikasi">
      <div className="install-strip">
        <span className="install-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="2" width="12" height="20" rx="3" />
            <path d="M12 8v6M9.5 11.5 12 14l2.5-2.5" />
          </svg>
        </span>
        <div className="install-text">
          <strong>Pasang TitipinBro di HP-mu</strong>
          <span className="small muted">Buka dari layar utama. Harga terakhir tetap bisa dilihat tanpa sinyal.</span>
          {hint && <span className="small" role="status">Ketuk tombol Bagikan di Safari, lalu pilih Tambahkan ke Layar Utama.</span>}
        </div>
        <button className="btn forest sm" onClick={canInstall ? install : () => setHint((h) => !h)} aria-expanded={canInstall ? undefined : hint}>
          Pasang
        </button>
        <button className="install-close" onClick={dismiss} aria-label="Tutup ajakan pasang">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" /></svg>
        </button>
      </div>
    </section>
  )
}
