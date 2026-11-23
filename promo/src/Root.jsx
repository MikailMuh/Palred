import React from 'react'
import { Composition } from 'remotion'
import { TransitionSeries, springTiming } from '@remotion/transitions'
import { slide } from '@remotion/transitions/slide'
import { fade } from '@remotion/transitions/fade'
import { wipe } from '@remotion/transitions/wipe'
import { Cta, Hook, Jastip, Paket, Prices, Problem, WhatsApp } from './scenes.jsx'
import { FPS } from './theme.js'

const T = 15 // panjang tiap transisi (frame)
const timing = springTiming({ config: { damping: 200 }, durationInFrames: T })

// Total = jumlah durasi adegan - (jumlah transisi × T), karena transisi saling tumpang.
const total = (scenes) => scenes.reduce((s, x) => s + x.d, 0) - (scenes.length - 1) * T

const transitions = [slide({ direction: 'from-right' }), wipe({ direction: 'from-bottom-right' }), slide({ direction: 'from-bottom' }), fade(), slide({ direction: 'from-left' }), wipe({ direction: 'from-top-left' })]

const Reel = ({ scenes }) => (
  <TransitionSeries>
    {scenes.flatMap((s, i) => [
      i > 0 && <TransitionSeries.Transition key={`t${i}`} presentation={transitions[(i - 1) % transitions.length]} timing={timing} />,
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={s.d}>{s.el}</TransitionSeries.Sequence>,
    ].filter(Boolean))}
  </TransitionSeries>
)

// Versi pendek ±15 detik: hook → harga → paket → CTA.
const SHORT = [
  { d: 105, el: <Hook /> },
  { d: 120, el: <Prices count={3} /> },
  { d: 120, el: <Paket /> },
  { d: 135, el: <Cta /> },
]

// Versi panjang 30 detik: hook → masalah → jastip → harga → paket → WhatsApp → CTA.
const LONG = [
  { d: 120, el: <Hook /> },
  { d: 120, el: <Problem /> },
  { d: 180, el: <Jastip /> },
  { d: 150, el: <Prices count={4} /> },
  { d: 150, el: <Paket many /> },
  { d: 120, el: <WhatsApp /> },
  { d: 150, el: <Cta /> },
]

const Short = () => <Reel scenes={SHORT} />
const Long = () => <Reel scenes={LONG} />

export const Root = () => (
  <>
    <Composition id="PromoShort" component={Short} durationInFrames={total(SHORT)} fps={FPS} width={1080} height={1920} />
    <Composition id="PromoLong" component={Long} durationInFrames={total(LONG)} fps={FPS} width={1080} height={1920} />
  </>
)
