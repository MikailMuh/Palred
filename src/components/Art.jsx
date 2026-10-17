// Ilustrasi sementara: semua digambar sebagai SVG inline, tanpa aset eksternal.

const C = {
  red: '#E4573D',
  redDark: '#B8361F',
  green: '#2F7A4B',
  leaf: '#8FD18B',
  forest: '#1F4D3A',
  yellow: '#F2B33D',
  cream: '#FBF6EC',
  kraft: '#D9A86C',
  kraftDark: '#B9864B',
  brown: '#8A5A3B',
  purple: '#9B3D5B',
  orange: '#F08A2C',
}

const produce = {
  cabai: (
    <>
      <path d="M16 20c9 2 28 8 33 28 1 4-3 6-6 3C34 40 24 32 13 26c-3-2-1-7 3-6z" fill={C.red} />
      <path d="M20 22c8 3 18 8 24 18" stroke="#fff" strokeOpacity=".35" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M15 21c-2-5 0-9 5-11" stroke={C.green} strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),
  bawang: (
    <>
      <path d="M32 10c3 9 19 15 19 32a19 19 0 0 1-38 0c0-17 16-23 19-32z" fill={C.purple} />
      <path d="M32 18c-4 8-8 14-8 24M32 18c4 8 8 14 8 24" stroke="#fff" strokeOpacity=".3" strokeWidth="2" fill="none" />
      <path d="M26 60l2-4M32 61v-4M38 60l-2-4" stroke={C.kraftDark} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  bawangPutih: (
    <>
      <path d="M32 12c4 8 18 13 18 29a18 17 0 0 1-36 0c0-16 14-21 18-29z" fill="#F3EBDD" stroke="#D9CBB4" strokeWidth="2" />
      <path d="M32 20v32M24 28c-2 6-2 14 0 22M40 28c2 6 2 14 0 22" stroke="#D9CBB4" strokeWidth="2" fill="none" />
    </>
  ),
  tomat: (
    <>
      <circle cx="32" cy="36" r="20" fill={C.red} />
      <ellipse cx="25" cy="30" rx="5" ry="3" fill="#fff" opacity=".35" />
      <path d="M32 18l-6-5 4 7-8 0 8 3-4 6 6-5 6 5-4-6 8-3-8 0 4-7z" fill={C.green} />
    </>
  ),
  wortel: (
    <>
      <path d="M22 22c6-4 14-2 16 4L24 56c-2 3-6 2-6-2l4-32z" fill={C.orange} />
      <path d="M24 32l6 1M22 42l5 1" stroke={C.redDark} strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 22c2-8 8-12 14-12-2 6-6 10-12 12M30 20c-2-7 0-12 4-14 1 6 0 10-2 14" fill={C.green} />
    </>
  ),
  telur: (
    <>
      <ellipse cx="26" cy="38" rx="13" ry="16" fill="#F6E6CF" stroke="#E2CDAF" strokeWidth="2" />
      <ellipse cx="40" cy="40" rx="13" ry="16" fill="#FFF6E8" stroke="#E2CDAF" strokeWidth="2" />
      <ellipse cx="36" cy="33" rx="3" ry="5" fill="#fff" />
    </>
  ),
  beras: (
    <>
      <path d="M16 22h32l4 34H12z" fill="#EADBC0" />
      <path d="M16 22c4-6 28-6 32 0" fill="#D9C6A1" />
      <rect x="22" y="34" width="20" height="12" rx="3" fill={C.forest} />
      <path d="M27 40h10" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="25" cy="17" rx="2" ry="3.5" fill="#fff" />
      <ellipse cx="32" cy="15" rx="2" ry="3.5" fill="#fff" />
      <ellipse cx="39" cy="17" rx="2" ry="3.5" fill="#fff" />
    </>
  ),
  daging: (
    <>
      <path d="M12 34c0-12 14-20 28-18s14 14 12 24-14 14-26 12S12 44 12 34z" fill="#C93A3A" stroke="#F4D7C8" strokeWidth="4" />
      <ellipse cx="34" cy="32" rx="6" ry="4" fill="#F4D7C8" />
      <path d="M20 40c6 2 14 2 22-2" stroke="#F4D7C8" strokeWidth="2" fill="none" />
    </>
  ),
  ayam: (
    <>
      <path d="M38 12c10 0 16 8 14 18s-12 14-18 12c-6-2-8-10-6-18s4-12 10-12z" fill="#E7A35E" />
      <path d="M30 40l-6 10" stroke="#E7A35E" strokeWidth="8" strokeLinecap="round" />
      <path d="M24 50l-6 6" stroke="#F6EBDD" strokeWidth="6" strokeLinecap="round" />
      <circle cx="15" cy="56" r="4" fill="#F6EBDD" />
      <circle cx="20" cy="60" r="4" fill="#F6EBDD" />
      <path d="M40 20c4 0 7 3 7 7" stroke="#fff" strokeOpacity=".4" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  kentang: (
    <>
      <path d="M12 36c0-12 10-20 22-20s18 8 18 18-8 18-20 18S12 46 12 36z" fill="#C99A5B" />
      <circle cx="24" cy="30" r="1.8" fill={C.brown} />
      <circle cx="38" cy="28" r="1.8" fill={C.brown} />
      <circle cx="32" cy="42" r="1.8" fill={C.brown} />
      <circle cx="44" cy="40" r="1.8" fill={C.brown} />
    </>
  ),
  sayur: (
    <>
      <path d="M32 58V30" stroke={C.green} strokeWidth="3" />
      <path d="M32 34C20 34 12 24 14 10c12 0 18 10 18 24z" fill="#4FA35F" />
      <path d="M32 40c12 0 20-10 18-24-12 0-18 10-18 24z" fill={C.leaf} />
      <path d="M32 50c-10 0-16-6-16-14 9 0 14 6 16 14z" fill="#3E8E50" />
    </>
  ),
  kelapa: (
    <>
      <circle cx="32" cy="34" r="20" fill={C.brown} />
      <circle cx="32" cy="34" r="14" fill="#fff" />
      <circle cx="32" cy="34" r="9" fill="#EFF6F0" />
      <path d="M22 18c2-4 6-6 10-6" stroke="#6B4228" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  minyak: (
    <>
      <rect x="22" y="20" width="20" height="38" rx="6" fill={C.yellow} />
      <rect x="27" y="10" width="10" height="10" rx="2" fill={C.forest} />
      <rect x="25" y="32" width="14" height="12" rx="2" fill="#fff" opacity=".85" />
      <path d="M28 25v26" stroke="#fff" strokeOpacity=".4" strokeWidth="2" />
    </>
  ),
  gula: (
    <>
      <path d="M18 20h28v36H18z" fill="#fff" stroke="#E2D8C6" strokeWidth="2" />
      <path d="M18 20l4-8h20l4 8" fill="#F1EADC" />
      <rect x="22" y="30" width="20" height="12" rx="2" fill="#3E7CB1" />
      <rect x="27" y="47" width="4" height="4" fill="#E2D8C6" />
      <rect x="33" y="47" width="4" height="4" fill="#E2D8C6" />
    </>
  ),
  jahe: (
    <>
      <path d="M12 38c2-8 10-10 16-8 2-8 10-12 16-8 6 4 4 12 0 14 6 2 8 10 2 14-6 4-12 0-14-4-6 4-16 4-20-8z" fill="#D8B37A" />
      <path d="M22 40c4 0 8-2 10-6M38 30c0 4 2 6 6 6" stroke="#B88E54" strokeWidth="2" fill="none" />
    </>
  ),
  ikan: (
    <>
      <path d="M8 32c8-12 28-14 40 0-12 14-32 12-40 0z" fill="#7FA9C9" />
      <path d="M48 32l10-10v20z" fill="#5E8DB2" />
      <circle cx="18" cy="30" r="2.5" fill={C.forest} />
      <path d="M26 26c4 3 4 9 0 12M33 25c4 4 4 10 0 14" stroke="#fff" strokeOpacity=".5" strokeWidth="2" fill="none" />
    </>
  ),
  tahu: (
    <>
      <path d="M12 26l18-8 22 8v20l-22 10-18-10z" fill="#F4DB9A" />
      <path d="M12 26l18 8 22-8M30 34v22" stroke="#DDBB6A" strokeWidth="2" fill="none" />
    </>
  ),
}

export function Produce({ type, size = 48, bg }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      {bg && <circle cx="32" cy="32" r="32" fill={bg} />}
      {produce[type] ?? produce.sayur}
    </svg>
  )
}

function Pile({ type }) {
  const spots = [[0, 18], [26, 12], [52, 18], [13, 0], [39, 0], [78, 16]]
  return (
    <g>
      {spots.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(.55)`}>{produce[type]}</g>
      ))}
    </g>
  )
}

export function HeroMarket() {
  return (
    <svg viewBox="0 0 520 440" className="art" role="img" aria-label="Ilustrasi lapak pasar tradisional">
      <circle cx="420" cy="70" r="46" fill={C.yellow} opacity=".9" />
      <path d="M0 360c80-30 160-30 260 0s180 30 260 0v80H0z" fill="#E9DFC9" />
      <rect x="70" y="120" width="12" height="230" rx="4" fill={C.brown} />
      <rect x="438" y="120" width="12" height="230" rx="4" fill={C.brown} />
      <path d="M40 120h440l-20-60H60z" fill={C.forest} />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d={`M${40 + i * 55} 120h55v22a27.5 27.5 0 0 1-55 0z`} fill={i % 2 ? C.cream : C.red} />
      ))}
      <rect x="180" y="72" width="160" height="34" rx="10" fill={C.cream} />
      <text x="260" y="95" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="18" fill={C.forest}>PASAR PAGI</text>
      <rect x="60" y="270" width="400" height="22" rx="6" fill={C.kraftDark} />
      <rect x="76" y="292" width="368" height="64" fill={C.kraft} />
      <path d="M76 312h368M76 334h368" stroke={C.kraftDark} strokeWidth="2" />
      <g transform="translate(90 196)">
        <path d="M0 40h110l-10 36H10z" fill={C.kraftDark} />
        <g transform="translate(4 -6) scale(.9)"><Pile type="tomat" /></g>
      </g>
      <g transform="translate(212 196)">
        <path d="M0 40h100l-10 36H10z" fill={C.kraftDark} />
        <g transform="translate(0 -6) scale(.85)"><Pile type="cabai" /></g>
      </g>
      <g transform="translate(324 196)">
        <path d="M0 40h110l-10 36H10z" fill={C.kraftDark} />
        <g transform="translate(4 -6) scale(.9)"><Pile type="sayur" /></g>
      </g>
      <g transform="translate(350 146)">
        <rect width="96" height="48" rx="8" fill="#14261E" />
        <text x="48" y="20" textAnchor="middle" fill={C.leaf} fontFamily="JetBrains Mono, monospace" fontSize="11">HARGA PASAR</text>
        <text x="48" y="38" textAnchor="middle" fill={C.yellow} fontFamily="JetBrains Mono, monospace" fontWeight="700" fontSize="14">per kg</text>
      </g>
      <g transform="translate(30 330)">
        <path d="M0 20h70l-6 60H6z" fill={C.red} />
        <path d="M18 20c0-18 34-18 34 0" stroke={C.redDark} strokeWidth="5" fill="none" />
        <g transform="translate(6 -4) scale(.5)">{produce.wortel}</g>
        <g transform="translate(30 -2) scale(.55)">{produce.sayur}</g>
      </g>
    </svg>
  )
}

export function Courier() {
  return (
    <svg viewBox="0 0 320 220" className="art" role="img" aria-label="Kurir jastip naik motor">
      <ellipse cx="160" cy="196" rx="130" ry="10" fill="#000" opacity=".08" />
      <path d="M20 120h40M10 140h50M30 160h30" stroke={C.forest} strokeOpacity=".25" strokeWidth="5" strokeLinecap="round" />
      <rect x="70" y="80" width="72" height="62" rx="8" fill={C.red} />
      <rect x="82" y="96" width="48" height="16" rx="4" fill={C.cream} />
      <text x="106" y="108" textAnchor="middle" fontSize="10" fontWeight="800" fill={C.red} fontFamily="Plus Jakarta Sans, sans-serif">PALRED</text>
      <path d="M90 150h110l30-30h30l-10 40H80z" fill={C.forest} />
      <path d="M200 120l20-40h14" stroke="#14261E" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="100" cy="172" r="22" fill="#14261E" />
      <circle cx="100" cy="172" r="9" fill="#ccc" />
      <circle cx="242" cy="172" r="22" fill="#14261E" />
      <circle cx="242" cy="172" r="9" fill="#ccc" />
      <path d="M160 150l12-50h26l-6 50z" fill={C.yellow} />
      <path d="M190 104l30 0" stroke={C.yellow} strokeWidth="10" strokeLinecap="round" />
      <circle cx="184" cy="78" r="18" fill="#C98E62" />
      <path d="M164 76a20 20 0 0 1 40 0z" fill={C.forest} />
      <rect x="160" y="72" width="48" height="8" rx="4" fill={C.forest} />
      <path d="M168 150l-6 30h14" stroke="#2B3A4A" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function Billboard() {
  const bars = [44, 62, 38, 74, 56, 86, 68]
  return (
    <svg viewBox="0 0 320 220" className="art" role="img" aria-label="Ilustrasi papan harga digital">
      <rect x="150" y="150" width="20" height="56" fill="#5B6B63" />
      <rect x="20" y="16" width="280" height="140" rx="14" fill="#14261E" />
      <rect x="32" y="28" width="256" height="116" rx="8" fill="#0D1A14" />
      {bars.map((h, i) => (
        <rect key={i} x={48 + i * 34} y={130 - h} width="20" height={h} rx="4" fill={i === 5 ? C.red : C.leaf} opacity={i === 5 ? 1 : 0.75} />
      ))}
      <path d="M58 100L92 80l34 30 34-40 34 20 34-40 34 16" stroke={C.yellow} strokeWidth="3" fill="none" strokeLinejoin="round" />
      <circle cx="272" cy="40" r="5" fill={C.red}>
        <animate attributeName="opacity" values="1;.2;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <rect x="10" y="200" width="300" height="10" rx="5" fill="#E9DFC9" />
    </svg>
  )
}

export function PackageBox({ items = ['cabai', 'bawang', 'tomat', 'sayur'], label = 'Paket Masak' }) {
  return (
    <svg viewBox="0 0 320 240" className="art" role="img" aria-label="Kotak paket bahan masakan">
      <ellipse cx="160" cy="222" rx="120" ry="10" fill="#000" opacity=".08" />
      {items.slice(0, 4).map((t, i) => (
        <g key={t + i} transform={`translate(${66 + i * 46} ${16 + (i % 2) * 10})`}>{produce[t] ?? produce.sayur}</g>
      ))}
      <path d="M40 96h240v116a10 10 0 0 1-10 10H50a10 10 0 0 1-10-10z" fill={C.kraft} />
      <path d="M40 96l-14-26h112l14 26zM280 96l14-26H182l-14 26z" fill={C.kraftDark} />
      <rect x="92" y="132" width="136" height="54" rx="8" fill={C.cream} />
      <text x="160" y="155" textAnchor="middle" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="14" fill={C.forest}>{label}</text>
      <text x="160" y="174" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="10" fill={C.brown}>sudah ditakar ✓</text>
      <path d="M160 96v36M160 186v36" stroke={C.red} strokeWidth="8" />
    </svg>
  )
}

// Hidangan dengan warna kuah/isi berbeda per resep
export function Dish({ base = '#E8B04B', garnish = C.green, style = 'bowl' }) {
  return (
    <svg viewBox="0 0 240 180" className="art" role="img" aria-hidden="true">
      <ellipse cx="120" cy="164" rx="96" ry="10" fill="#000" opacity=".08" />
      {style === 'plate' ? (
        <>
          <ellipse cx="120" cy="110" rx="104" ry="52" fill="#fff" stroke="#EADFCB" strokeWidth="3" />
          <ellipse cx="120" cy="104" rx="70" ry="32" fill={base} />
          <ellipse cx="96" cy="96" rx="14" ry="8" fill="#fff" opacity=".9" />
          <circle cx="96" cy="96" r="5" fill={C.yellow} />
          <path d="M140 92c8-6 18-4 22 2" stroke={garnish} strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="128" cy="112" r="5" fill={C.red} />
          <circle cx="150" cy="108" r="4" fill={C.red} />
        </>
      ) : (
        <>
          <path d="M20 86h200c0 44-44 74-100 74S20 130 20 86z" fill="#fff" stroke="#EADFCB" strokeWidth="3" />
          <ellipse cx="120" cy="86" rx="100" ry="22" fill={base} />
          <ellipse cx="88" cy="82" rx="18" ry="8" fill="#fff" opacity=".25" />
          <path d="M70 86c8-8 20-8 24 0" stroke={garnish} strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="134" cy="82" r="10" fill="#F6E6CF" />
          <circle cx="134" cy="82" r="5" fill={C.yellow} />
          <rect x="150" y="84" width="22" height="12" rx="3" fill={C.brown} transform="rotate(-12 160 90)" />
          <circle cx="110" cy="94" r="3.5" fill={C.red} />
          <circle cx="164" cy="76" r="3" fill={C.red} />
          <path d="M100 50c-6-8 6-12 0-22M124 46c-6-8 6-12 0-22M148 50c-6-8 6-12 0-22" stroke="#B9B2A6" strokeWidth="3" strokeLinecap="round" fill="none" opacity=".6" />
        </>
      )}
    </svg>
  )
}

export function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="16" fill={C.forest} />
      <path d="M18 22c8 2 26 6 30 22 1 3-2 5-4 3-8-8-16-13-27-19-3-2-2-7 1-6z" fill={C.red} />
      <path d="M18 22c-1-4 0-7 4-9" stroke={C.leaf} strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function Sparkline({ data, w = 96, h = 28, up, tone = 'dark' }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - 2 - ((v - min) / span) * (h - 4)}`)
    .join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <polyline
        points={pts}
        fill="none"
        stroke={tone === 'dark' ? (up ? '#FF7A62' : '#8FD18B') : undefined}
        style={tone === 'dark' ? undefined : { stroke: up ? 'var(--spark-up)' : 'var(--spark-down)' }}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}
