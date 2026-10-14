import { useId, useState } from 'react'
import { angka } from '../data.js'
import { PRICE_GROUPS, formatTanggal, seriesUntil, valueAt } from '../prices.js'

// TODO: batas ini pilihan sementara, belum divalidasi ke pedagang atau domain expert.
const NEAR_PCT = 10
const FAR_PCT = 25


function verdict(pct) {
  const abs = Math.abs(pct)
  if (abs <= NEAR_PCT) return { tone: 'ok', mark: '●', title: 'Dekat dengan patokan' }
  const side = pct > 0 ? 'di atas' : 'di bawah'
  const mark = pct > 0 ? '▲' : '▼'
  return abs <= FAR_PCT ? { tone: 'mid', mark, title: `Agak ${side} patokan` } : { tone: 'far', mark, title: `Jauh ${side} patokan` }
}

export default function CekHarga({ data, meta, provId, provName }) {
  const id = useId()
  const [key, setKey] = useState('cabai-merah-keriting')
  const [raw, setRaw] = useState('')

  const offer = Number(raw.replace(/\D/g, ''))
  const reference = valueAt(data, key, meta.latest, provId)
  const range = seriesUntil(data, key, meta.latest, provId).map((p) => p.value)
  const pct = offer > 0 && reference != null ? ((offer - reference) / reference) * 100 : null
  const v = pct != null ? verdict(pct) : null

  return (
    <section className="card pad cek-harga" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>Cek harga wajar</h2>
      <p className="muted small">Masukkan harga yang ditawarkan pedagang, lihat posisinya terhadap patokan PIHPS ({provName}).</p>
      <div className="form-grid">
        <label className="field">
          <span>Komoditas</span>
          <select className="select" value={key} onChange={(e) => setKey(e.target.value)}>
            {PRICE_GROUPS.map((g) => (
              <optgroup key={g.id} label={g.id.replace(/-/g, ' ')}>
                {g.keys.map((k) => (
                  <option key={k} value={k}>{data.commodities[k].name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Harga yang ditawarkan (Rp per kg)</span>
          <input inputMode="numeric" placeholder="Contoh: 90000" value={raw} onChange={(e) => setRaw(e.target.value)} />
        </label>
      </div>

      <div className="cek-result" role="status" aria-live="polite">
        {reference == null && <p className="muted">Belum ada data patokan untuk {provName} pada {formatTanggal(meta.latest)}.</p>}
        {reference != null && !v && <p className="muted">Patokan {provName} per {formatTanggal(meta.latest)}: Rp{angka(reference)}. Isi harga tawaran untuk membandingkan.</p>}
        {v && (
          <div className={`verdict ${v.tone}`}>
            <strong>{v.mark} {v.title}</strong>
            <p className="small">
              Tawaran Rp{angka(offer)} {pct >= 0 ? 'lebih mahal' : 'lebih murah'} {Math.abs(pct).toLocaleString('id-ID', { maximumFractionDigits: 1 })}% dari patokan Rp{angka(reference)} ({provName}, {formatTanggal(meta.latest)}).
              {range.length > 1 && <> Rentang {range.length} hari data: Rp{angka(Math.min(...range))} sampai Rp{angka(Math.max(...range))}.</>}
            </p>
          </div>
        )}
      </div>
      <p className="small muted">
        Patokan adalah rata-rata provinsi, bukan harga lapak. Mutu, ukuran, dan jam belanja bisa membuat harga berbeda. Batas "dekat" ±{NEAR_PCT}% dan "jauh" ±{FAR_PCT}% masih perkiraan kami.
      </p>
    </section>
  )
}
