const RULES = [
  {
    title: 'Foto barang sebelum bayar',
    body: 'Sebelum membayar di lapak, tim mengirim foto barang yang dipilih lewat WhatsApp. Kalau kurang cocok, kamu bisa minta ganti sebelum dibayar.',
  },
  {
    title: 'Tawar-menawar',
    body: 'Tim boleh menawar dengan wajar. Harga di katalog hanya patokan, jadi tagihan akhir mengikuti struk atau harga yang dibayar di lapak. Foto struk dikirim bersama pesanan.',
  },
  {
    title: 'Kalau barang kosong',
    body: 'Kamu memilih sendiri di form: diganti barang yang mirip, dilewati, atau dihubungi dulu. Tanpa persetujuanmu, tim tidak membeli barang pengganti di luar pilihan itu.',
  },
  {
    title: 'Barang rusak atau tidak sesuai',
    body: 'Laporkan lewat WhatsApp saat barang diterima, lengkap dengan foto. Tim akan membicarakan solusinya denganmu, misalnya ganti barang atau kurangi tagihan.',
  },
]

export default function Kebijakan({ go }) {
  return (
    <section className="container page">
      <header className="page-head">
        <span className="eyebrow">Jastip Pasar</span>
        <h1>Kebijakan Jastip</h1>
        <p className="muted">Aturan main supaya kamu tahu apa yang terjadi di pasar dan apa yang bisa kamu minta.</p>
      </header>
      <ol className="rules">
        {RULES.map((r, i) => (
          <li key={r.title}>
            <span className="step-num">{i + 1}</span>
            <h2>{r.title}</h2>
            <p className="muted">{r.body}</p>
          </li>
        ))}
      </ol>
      <div className="cta-band">
        <div>
          <h2>Sudah paham aturannya?</h2>
          <p>Lanjut tulis daftar belanjamu.</p>
        </div>
        <button className="btn light" onClick={() => go('jastip')}>Kembali ke Jastip</button>
      </div>
    </section>
  )
}
