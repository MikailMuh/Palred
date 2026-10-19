import { lazy } from 'react'

const KEY = 'palred-chunk-reload'

// After a deploy or rebuild the hashed chunk named in a cached index.html can be gone (404). Refresh the service worker and
// reload once so the page picks up the new index.html. The sessionStorage flag stops a reload loop if the chunk is really broken.
export function lazyRetry(factory) {
  return lazy(async () => {
    try {
      const mod = await factory()
      try {
        sessionStorage.removeItem(KEY)
      } catch {
        /* storage blocked: no loop guard, but also no reload below */
      }
      return mod
    } catch (err) {
      let alreadyTried = true
      try {
        alreadyTried = sessionStorage.getItem(KEY) === '1'
        if (!alreadyTried) sessionStorage.setItem(KEY, '1')
      } catch {
        /* keep alreadyTried = true so we never loop without a guard */
      }
      if (alreadyTried) throw err
      try {
        const reg = await navigator.serviceWorker?.getRegistration()
        await reg?.update()
      } catch {
        /* reload anyway */
      }
      window.location.reload()
      return new Promise(() => {})
    }
  })
}
