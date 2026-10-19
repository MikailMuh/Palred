import { formatHari, formatTanggal, formatWaktu } from '../prices.js'

export default function DataStamp({ date, checkedAt, label = 'Data per' }) {
  const checked = checkedAt ? formatWaktu(checkedAt, false) : null
  return (
    <>
      <strong>{label} {formatHari(date)}, {formatTanggal(date)}</strong>
      {checked && <> · dicek {checked}</>}
    </>
  )
}
