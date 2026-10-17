const MESSAGES = {
  denied: 'Izin lokasi ditolak. Tidak apa-apa, pilih pasar sendiri di bawah. Ongkir akan dihitung tim lewat WhatsApp.',
  unavailable: 'Lokasi tidak bisa dibaca di perangkat ini. Pilih pasar sendiri di bawah. Ongkir akan dihitung tim lewat WhatsApp.',
  outside: 'Lokasimu di luar area layanan kami saat ini (sekitar Jakarta). Kamu tetap bisa memilih pasar, ongkir akan dihitung tim lewat WhatsApp.',
}

export default function LocationPicker({ status, outside, onRequest, onClear }) {
  const asking = status === 'asking'
  const granted = status === 'granted'

  return (
    <div className="location-picker">
      <div className="row gap">
        {!granted && (
          <button className="btn ghost" onClick={onRequest} disabled={asking}>
            {asking ? 'Mencari lokasimu…' : 'Pakai lokasi saya'}
          </button>
        )}
        {granted && (
          <>
            <span className="small" role="status">Pasar diurutkan dari lokasimu.</span>
            <button className="link-btn small" onClick={onClear}>Hapus lokasi</button>
          </>
        )}
      </div>
      {(status === 'denied' || status === 'unavailable') && <p className="small muted" role="status">{MESSAGES[status]}</p>}
      {granted && outside && <p className="small muted" role="status">{MESSAGES.outside}</p>}
      {granted && !outside && (
        <p className="small muted">Jarak adalah perkiraan (garis lurus dikali 1,3), bukan rute jalan. Lokasimu hanya dipakai di browser ini dan tidak disimpan.</p>
      )}
      {!granted && !asking && !MESSAGES[status] && (
        <p className="small muted">Kami hanya memakai lokasimu untuk mencari pasar terdekat dan menghitung ongkir. Tidak disimpan.</p>
      )}
    </div>
  )
}
