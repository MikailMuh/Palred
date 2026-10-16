import { useState } from 'react'

const KEY = 'palred-theme'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')
  const dark = theme === 'dark'

  const toggle = () => {
    const next = dark ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    setTheme(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      // Penyimpanan diblokir: tema tetap berlaku sampai halaman ditutup.
    }
  }

  return (
    <button className="icon-btn" aria-pressed={dark} aria-label="Mode gelap" title={dark ? 'Pakai tema terang' : 'Pakai tema gelap'} onClick={toggle}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </svg>
    </button>
  )
}
