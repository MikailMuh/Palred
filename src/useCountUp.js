import { useEffect, useState } from 'react'

const DURATION = 600
const START_RATIO = 0.9

// Start dekat nilai akhir supaya lebar angka tidak berubah dan layout tidak melompat.
export function useCountUp(target) {
  const [value, setValue] = useState(target)

  useEffect(() => {
    if (target == null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    const from = target * START_RATIO
    const start = performance.now()
    let frame
    const tick = (now) => {
      const t = Math.min((now - start) / DURATION, 1)
      setValue(Math.round(from + (target - from) * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return value
}
