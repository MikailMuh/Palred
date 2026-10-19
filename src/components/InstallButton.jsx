import { useState } from 'react'
import { useInstallPrompt } from '../useInstallPrompt.js'

export default function InstallButton({ className = 'btn ghost' }) {
  const { canInstall, showIosHint, install } = useInstallPrompt()
  const [hint, setHint] = useState(false)

  if (!canInstall && !showIosHint) return null

  return (
    <div className="install">
      <button className={className} onClick={canInstall ? install : () => setHint((h) => !h)} aria-expanded={canInstall ? undefined : hint}>
        Pasang TitipinBro
      </button>
      {hint && (
        <p className="small muted" role="status">
          Ketuk tombol Bagikan di Safari, lalu pilih Tambahkan ke Layar Utama.
        </p>
      )}
    </div>
  )
}
