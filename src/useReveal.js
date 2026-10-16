import { useEffect } from 'react'

// Elemen [data-reveal] di bawah layar muncul pelan saat di-scroll. Yang sudah terlihat saat load dibiarkan.
export function useReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
    const items = [...document.querySelectorAll('[data-reveal]')].filter((el) => el.getBoundingClientRect().top > window.innerHeight)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      }),
      { rootMargin: '0px 0px -8% 0px' },
    )
    items.forEach((el) => {
      el.classList.add('reveal')
      io.observe(el)
    })
    return () => io.disconnect()
  }, [])
}
