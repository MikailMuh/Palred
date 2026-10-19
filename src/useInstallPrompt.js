import { useEffect, useState } from 'react'

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
// iOS Safari has no install event, so it needs a manual hint. iPadOS reports itself as a Mac with touch.
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

export function useInstallPrompt() {
  const [event, setEvent] = useState(null)
  const [installed, setInstalled] = useState(isStandalone)

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      setEvent(e)
    }
    const onInstalled = () => {
      setInstalled(true)
      setEvent(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const install = async () => {
    if (!event) return
    event.prompt()
    await event.userChoice
    setEvent(null)
  }

  return { canInstall: !installed && event != null, showIosHint: !installed && event == null && isIos(), install }
}
