import React from 'react'
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion'
import logo from './logo-mark.png'
import { C, PAKET, PRICES, PRICE_DATE, URL_TEXT, jakarta, rupiah, titan } from './theme.js'

/* ---------- primitif animasi (semua digerakkan useCurrentFrame) ---------- */

const useSpring = (delay = 0, config = { damping: 14, stiffness: 120 }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  return spring({ frame: frame - delay, fps, config })
}

// Muncul dengan pantulan (scale + fade).
const Pop = ({ delay = 0, children, style }) => {
  const s = useSpring(delay, { damping: 11, stiffness: 140 })
  return <div style={{ transform: `scale(${s})`, opacity: Math.min(1, s * 1.5), ...style }}>{children}</div>
}

// Naik dari bawah.
const Rise = ({ delay = 0, distance = 60, children, style }) => {
  const s = useSpring(delay, { damping: 200 })
  return <div style={{ transform: `translateY(${(1 - s) * distance}px)`, opacity: s, ...style }}>{children}</div>
}

// Mengambang naik-turun pelan.
const Float = ({ amp = 14, speed = 0.06, phase = 0, children }) => {
  const frame = useCurrentFrame()
  const y = Math.sin(frame * speed + phase) * amp
  const r = Math.sin(frame * speed * 0.8 + phase) * 3
  return <div style={{ transform: `translateY(${y}px) rotate(${r}deg)` }}>{children}</div>
}

const Food = ({ name, size, style }) => (
  <Img src={staticFile(`img/food/${name}.webp`)} style={{ width: size, height: size, objectFit: 'contain', filter: 'drop-shadow(0 24px 24px rgba(0,0,0,.45))', ...style }} />
)

// Teks per kata, tiap kata naik bergantian.
const Words = ({ text, delay = 0, step = 4, style }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: '0.28em', ...style }}>
    {text.split(' ').map((w, i) => (
      <Rise key={i} delay={delay + i * step} distance={70}>{w}</Rise>
    ))}
  </div>
)

// Latar: gradasi + titik halus, sama seperti banner website.
const Bg = ({ from, to, glow = 'rgba(255,194,51,.35)', children }) => {
  const frame = useCurrentFrame()
  const shift = interpolate(frame, [0, 300], [0, 40])
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 60% at 100% ${shift}%, ${glow}, transparent 60%), linear-gradient(160deg, ${from}, ${to})`, fontFamily: jakarta, color: C.white }}>
      <AbsoluteFill style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.08) 2px, transparent 2px)', backgroundSize: '36px 36px' }} />
      {children}
    </AbsoluteFill>
  )
}

const Brand = ({ size = 64, delay = 0 }) => (
  <Pop delay={delay} style={{ display: 'flex', alignItems: 'center', gap: size * 0.25 }}>
    <Img src={logo} style={{ width: size * 1.25, height: size * 1.25, filter: 'drop-shadow(0 0 2px rgba(255,255,255,.9))' }} />
    <span style={{ fontFamily: titan, fontSize: size, color: C.white }}>Titipin<span style={{ color: C.yellow }}>Bro</span></span>
  </Pop>
)

const Kicker = ({ children, delay = 0 }) => (
  <Pop delay={delay} style={{ alignSelf: 'center' }}>
    <span style={{ display: 'inline-block', padding: '14px 30px', borderRadius: 999, background: 'rgba(255,255,255,.14)', color: '#ffe39a', fontSize: 36, fontWeight: 800, letterSpacing: 1 }}>{children}</span>
  </Pop>
)

const h1 = { fontSize: 118, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3, textAlign: 'center' }
const h2 = { fontSize: 88, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, textAlign: 'center' }

/* ---------- adegan ---------- */

// 1. Hook: bahan berhamburan + judul besar.
export const Hook = () => {
  const items = [
    { n: 'tomat', x: 90, y: 230, s: 260, d: 4 },
    { n: 'cabai', x: 640, y: 190, s: 340, d: 8 },
    { n: 'telur', x: 790, y: 1330, s: 200, d: 12 },
    { n: 'wortel', x: 40, y: 1380, s: 330, d: 16 },
    { n: 'bawang', x: 450, y: 1500, s: 260, d: 20 },
    { n: 'daging', x: 700, y: 1590, s: 300, d: 24 },
    { n: 'jahe', x: 70, y: 1640, s: 260, d: 28 },
  ]
  return (
    <Bg from="#0b5a37" to={C.greenDeep}>
      {items.map((it, i) => (
        <div key={it.n} style={{ position: 'absolute', left: it.x, top: it.y }}>
          <Pop delay={it.d}><Float phase={i}><Food name={it.n} size={it.s} /></Float></Pop>
        </div>
      ))}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80, gap: 36 }}>
        <Brand size={60} />
        <Words text="Belanja pasar" delay={10} style={h1} />
        <Words text="tanpa ke pasar." delay={18} style={{ ...h1, color: C.yellow }} />
        <Rise delay={34}><p style={{ margin: 0, fontSize: 42, textAlign: 'center', opacity: 0.9, maxWidth: 820 }}>Jastip pasar tradisional untuk dapur UMKM kuliner</p></Rise>
      </AbsoluteFill>
    </Bg>
  )
}

// 2. Masalah (versi panjang): tiap keluhan dicoret.
export const Problem = () => {
  const frame = useCurrentFrame()
  const lines = ['Subuh-subuh ke pasar?', 'Harga nggak jelas?', 'Bahan sering sisa?']
  return (
    <Bg from="#1b2420" to="#0a0f0c" glow="rgba(242,85,60,.25)">
      <AbsoluteFill style={{ justifyContent: 'center', padding: 90, gap: 46 }}>
        {lines.map((t, i) => {
          const start = i * 18
          const strike = interpolate(frame, [start + 30, start + 42], [0, 100], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          return (
            <Rise key={t} delay={start}>
              <div style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', fontSize: 80, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1.5, color: '#e9efe9' }}>
                {t}
                <div style={{ position: 'absolute', left: 0, top: '52%', height: 10, borderRadius: 6, width: `${strike}%`, background: C.redLight }} />
              </div>
            </Rise>
          )
        })}
        <Pop delay={78} style={{ marginTop: 40 }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -2, color: C.yellow }}>Tenang, ada TitipinBro.</div>
        </Pop>
      </AbsoluteFill>
    </Bg>
  )
}

// 3. Jastip: foto pasar + langkah.
export const Jastip = () => {
  const markets = ['senen', 'minggu', 'kramatjati', 'kebayoran']
  const steps = ['Tulis daftar belanja', 'Shopper kami ke pasar', 'Foto dulu sebelum bayar', 'Diantar pagi ke dapurmu']
  return (
    <Bg from="#0b5a37" to={C.greenDeep}>
      <AbsoluteFill style={{ padding: '120px 70px 200px', gap: 40, justifyContent: 'center' }}>
        <Kicker>JASTIP PASAR</Kicker>
        <Words text="Kami yang ke pasar, kamu tetap di dapur." delay={6} step={3} style={{ ...h2, fontSize: 84 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginTop: 10 }}>
          {markets.map((m, i) => (
            <Pop key={m} delay={24 + i * 6}>
              <Img src={staticFile(`img/pasar/${m}.webp`)} style={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 28, boxShadow: '0 20px 40px rgba(0,0,0,.35)' }} />
            </Pop>
          ))}
        </div>
        <div style={{ display: 'grid', gap: 20, marginTop: 10 }}>
          {steps.map((s, i) => (
            <Rise key={s} delay={60 + i * 14} distance={40}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 26, padding: '20px 28px', borderRadius: 26, background: 'rgba(255,255,255,.1)' }}>
                <span style={{ width: 70, height: 70, borderRadius: 22, background: C.yellow, color: C.greenDeep, display: 'grid', placeItems: 'center', fontSize: 38, fontWeight: 800 }}>{i + 1}</span>
                <span style={{ fontSize: 46, fontWeight: 700 }}>{s}</span>
              </div>
            </Rise>
          ))}
        </div>
      </AbsoluteFill>
    </Bg>
  )
}

const CountUp = ({ value, delay }) => {
  const frame = useCurrentFrame()
  const t = interpolate(frame - delay, [0, 24], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
  const eased = 1 - Math.pow(1 - t, 3)
  return <>{rupiah(t >= 1 ? value : Math.round((value * eased) / 50) * 50)}</>
}

// 4. Harga harian (data PIHPS nyata).
export const Prices = ({ count = 3 }) => (
  <Bg from="#b8361f" to="#6e170b" glow="rgba(255,200,120,.35)">
    <AbsoluteFill style={{ padding: '120px 70px 200px', gap: 34, justifyContent: 'center' }}>
      <Kicker>BILLBOARD HARGA</Kicker>
      <Words text="Cek harga pasar sebelum belanja." delay={6} step={3} style={h2} />
      <div style={{ display: 'grid', gap: 26, marginTop: 20 }}>
        {PRICES.slice(0, count).map((p, i) => (
          <Rise key={p.name} delay={26 + i * 10} distance={80}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: 26, borderRadius: 36, background: C.white, color: C.ink, boxShadow: '0 24px 50px rgba(0,0,0,.3)' }}>
              <div style={{ width: 170, height: 170, borderRadius: 28, background: '#f3efe6', display: 'grid', placeItems: 'center' }}>
                <Food name={p.img} size={140} style={{ filter: 'drop-shadow(0 10px 10px rgba(0,0,0,.2))' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 40, color: '#5a6760', fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -2 }}><CountUp value={p.price} delay={30 + i * 10} /><span style={{ fontSize: 36, color: '#5a6760' }}>/kg</span></div>
              </div>
              <Pop delay={46 + i * 10}>
                <span style={{ padding: '14px 22px', borderRadius: 20, fontSize: 38, fontWeight: 800, background: p.diff < 0 ? '#e3f5ea' : '#fde7e2', color: p.diff < 0 ? C.down : C.up }}>
                  {p.diff < 0 ? '▼' : '▲'} {Math.abs(p.diff).toLocaleString('id-ID', { minimumFractionDigits: 1 })}%
                </span>
              </Pop>
            </div>
          </Rise>
        ))}
      </div>
      <Rise delay={70}><p style={{ margin: '10px 0 0', fontSize: 34, textAlign: 'center', opacity: 0.85 }}>Rata-rata nasional per {PRICE_DATE} · PIHPS Bank Indonesia</p></Rise>
    </AbsoluteFill>
  </Bg>
)

// 5. Paket masak.
export const Paket = ({ many = false }) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const list = many ? PAKET : PAKET.slice(0, 1)
  const ingredients = ['daging', 'kelapa', 'cabai', 'bawang', 'jahe']
  // Versi panjang: berganti masakan beberapa kali.
  const idx = Math.min(list.length - 1, Math.floor(interpolate(frame, [30, durationInFrames - 10], [0, list.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })))
  const p = list[idx]
  const local = many ? frame - (30 + (idx * (durationInFrames - 40)) / list.length) : frame
  const swap = many ? spring({ frame: local, fps: 30, config: { damping: 14 } }) : 1
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.12])
  return (
    <Bg from="#c27610" to="#5e3204" glow="rgba(255,230,150,.45)">
      <AbsoluteFill style={{ padding: '120px 70px 200px', gap: 36, justifyContent: 'center' }}>
        <Kicker>PAKET MASAK</Kicker>
        <Words text="Bahan per resep, sudah ditakar." delay={6} step={3} style={{ ...h2, fontSize: 90 }} />
        <Pop delay={20} style={{ marginTop: 20 }}>
          <div style={{ position: 'relative', borderRadius: 48, overflow: 'hidden', height: many ? 820 : 700, boxShadow: '0 40px 80px rgba(0,0,0,.45)', transform: `rotate(-2deg) translateX(${(1 - swap) * 120}px)`, opacity: Math.min(1, 0.3 + swap) }}>
            <Img src={staticFile(`img/food/dish-${p.id}.webp`)} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})` }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '120px 44px 40px', background: 'linear-gradient(transparent, rgba(0,0,0,.75))' }}>
              <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: -1 }}>Paket {p.name}</div>
              <div style={{ fontSize: 40, opacity: 0.9 }}>2 porsi · perkiraan bahan {rupiah(p.price)}</div>
            </div>
          </div>
        </Pop>
        {!many && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 8 }}>
            {ingredients.map((n, i) => (
              <Pop key={n} delay={40 + i * 6}>
                <div style={{ width: 150, height: 150, borderRadius: 40, background: C.cream, display: 'grid', placeItems: 'center', boxShadow: '0 14px 30px rgba(0,0,0,.3)' }}>
                  <Food name={n} size={118} style={{ filter: 'drop-shadow(0 6px 6px rgba(0,0,0,.2))' }} />
                </div>
              </Pop>
            ))}
          </div>
        )}
      </AbsoluteFill>
    </Bg>
  )
}

// 6. WhatsApp (versi panjang): contoh chat pesanan.
export const WhatsApp = () => {
  const msg = ['Pesanan Jastip TitipinBro', 'Pasar: Pasar Minggu', 'Slot antar: 05.00 – 07.00', '• 2 kg Cabai Merah Keriting', '• 1 kg Bawang Merah', '• 1 kg Telur Ayam Ras']
  return (
    <Bg from="#0b5a37" to={C.greenDeep}>
      <AbsoluteFill style={{ padding: '120px 80px 200px', gap: 40, alignItems: 'center', justifyContent: 'center' }}>
        <Kicker>PESAN LEWAT WHATSAPP</Kicker>
        <Words text="Satu tap, pesanan langsung terkirim." delay={6} step={3} style={{ ...h2, fontSize: 84 }} />
        <Pop delay={18} style={{ width: 860, marginTop: 30 }}>
          <div style={{ borderRadius: 56, overflow: 'hidden', background: '#efe7dc', boxShadow: '0 40px 80px rgba(0,0,0,.45)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '28px 34px', background: '#075e54' }}>
              <Img src={logo} style={{ width: 84, height: 84, borderRadius: '50%', background: C.white, padding: 6 }} />
              <div><div style={{ fontSize: 40, fontWeight: 800 }}>Tim TitipinBro</div><div style={{ fontSize: 28, opacity: 0.8 }}>contoh percakapan</div></div>
            </div>
            <div style={{ padding: 40, minHeight: 560, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 22 }}>
              <Rise delay={30} distance={40}>
                <div style={{ background: '#d9fdd3', color: C.ink, borderRadius: '30px 30px 6px 30px', padding: '26px 32px', fontSize: 34, lineHeight: 1.45, maxWidth: 660 }}>
                  {msg.map((l, i) => (
                    <Rise key={l} delay={34 + i * 6} distance={14}>
                      <div style={{ fontWeight: i === 0 ? 800 : 500 }}>{l}</div>
                    </Rise>
                  ))}
                </div>
              </Rise>
              <Pop delay={84} style={{ alignSelf: 'flex-start' }}>
                <div style={{ background: C.white, color: C.ink, borderRadius: '30px 30px 30px 6px', padding: '22px 30px', fontSize: 34 }}>Siap! Ongkirnya kami konfirmasi dulu ya.</div>
              </Pop>
            </div>
          </div>
        </Pop>
      </AbsoluteFill>
    </Bg>
  )
}

// 7. CTA penutup.
export const Cta = () => {
  const frame = useCurrentFrame()
  const pulse = 1 + Math.sin(frame * 0.18) * 0.03
  const around = ['tomat', 'cabai', 'telur', 'bawang', 'wortel', 'daging']
  return (
    <Bg from="#0b5a37" to={C.greenDeep}>
      {around.map((n, i) => {
        const a = (i / around.length) * Math.PI * 2 + frame * 0.01
        return (
          <div key={n} style={{ position: 'absolute', left: 540 + Math.cos(a) * 470 - 95, top: 960 + Math.sin(a) * 720 - 95 }}>
            <Pop delay={i * 4}><Food name={n} size={190} /></Pop>
          </div>
        )
      })}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', gap: 44, padding: 80 }}>
        <Brand size={104} />
        <Rise delay={12}><div style={{ fontFamily: titan, fontSize: 64, color: C.yellow, textAlign: 'center' }}>Lu Butuh, Kita Titipin.</div></Rise>
        <Pop delay={26}>
          <div style={{ marginTop: 30, padding: '34px 64px', borderRadius: 999, background: C.yellow, color: C.greenDeep, fontSize: 62, fontWeight: 800, boxShadow: '0 20px 50px rgba(255,194,51,.5)', transform: `scale(${pulse})` }}>Titip sekarang →</div>
        </Pop>
        <Rise delay={38}><div style={{ fontSize: 58, fontWeight: 800, letterSpacing: -0.5, padding: '18px 40px', borderRadius: 24, background: 'rgba(255,255,255,.12)' }}>{URL_TEXT}</div></Rise>
      </AbsoluteFill>
    </Bg>
  )
}
