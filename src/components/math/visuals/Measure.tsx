/** Độ rộng một đơn vị đo trên màn hình, px */
const UNIT = 26

/** Bút chì nằm ngang, dài `units` đơn vị (đầu tẩy bên trái, ngòi bên phải) */
function Pencil({ units }: { units: number }) {
  const w = units * UNIT
  return (
    <svg aria-hidden viewBox={`0 0 ${w} 22`} style={{ width: w }} className="h-[22px]">
      <g className="stroke-ink-deep" strokeWidth={2} strokeLinejoin="round">
        <rect x="1" y="3" width="12" height="16" rx="3" className="fill-[#F49AB0]" />
        <rect x="13" y="3" width={Math.max(4, w - 33)} height="16" className="fill-sun" />
        <path d={`M${w - 20} 3L${w - 1} 11L${w - 20} 19z`} className="fill-[#F6D7A7]" />
      </g>
      <path d={`M${w - 7} 8L${w - 1} 11L${w - 7} 14z`} className="fill-ink-deep" />
    </svg>
  )
}

/** Hai bút chì đặt thẳng một đầu ở vạch xuất phát đỏ */
export function LengthCompare({ a, b }: { a: number; b: number }) {
  return (
    <div className="relative inline-flex flex-col gap-4 py-2 pl-3">
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 rounded-full bg-pen" />
      <Pencil units={a} />
      <Pencil units={b} />
    </div>
  )
}

/** Bút chì đặt trên thước, đầu tẩy trùng vạch 0 */
export function RulerMeasure({ length }: { length: number }) {
  const marks = Math.max(10, length + 2)
  const width = marks * UNIT + 24
  return (
    <div className="inline-flex flex-col gap-1 overflow-x-auto">
      <div className="pl-3">
        <Pencil units={length} />
      </div>
      <svg aria-hidden viewBox={`0 0 ${width} 46`} style={{ width }} className="h-[46px]">
        <rect x="1" y="1" width={width - 2} height="44" rx="6" className="fill-[#FFF6D6] stroke-ink-deep" strokeWidth={2} />
        {Array.from({ length: marks + 1 }, (_, i) => (
          <g key={i}>
            <path d={`M${12 + i * UNIT} 1V${i % 5 === 0 ? 18 : 12}`} className="stroke-ink-deep" strokeWidth={2} />
            <text x={12 + i * UNIT} y="36" textAnchor="middle" className="fill-ink-deep font-display text-[13px] font-bold">
              {i}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/** Đồng hồ kim chỉ giờ đúng: kim dài chỉ 12, kim ngắn chỉ `hour` */
export function ClockFace({ hour }: { hour: number }) {
  // Kim ngắn hơn bán kính vòng số (46) để không đè lên chữ số
  const angle = ((hour % 12) * 30 * Math.PI) / 180
  const hx = 70 + Math.sin(angle) * 26
  const hy = 70 - Math.cos(angle) * 26
  return (
    <svg aria-hidden viewBox="0 0 140 140" className="size-36 md:size-40">
      <circle cx="70" cy="70" r="64" className="fill-white stroke-ink-deep" strokeWidth={4} />
      <circle cx="70" cy="70" r="57" className="fill-none stroke-grid" strokeWidth={2} />
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1
        const a = (n * 30 * Math.PI) / 180
        return (
          <text key={n} x={70 + Math.sin(a) * 46} y={70 - Math.cos(a) * 46 + 6} textAnchor="middle" className="fill-ink-deep font-display text-[17px] font-extrabold">
            {n}
          </text>
        )
      })}
      <path d="M70 70V32" className="stroke-ink" strokeWidth={4} strokeLinecap="round" />
      <path d={`M70 70L${hx} ${hy}`} className="stroke-pen" strokeWidth={7} strokeLinecap="round" />
      <circle cx="70" cy="70" r="5" className="fill-ink-deep" />
    </svg>
  )
}

const dayNames = ['Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'CN']

/** Bảy ngày trong tuần, ô `highlight` tô vàng và ghi "hôm nay" */
export function WeekStrip({ highlight }: { highlight: number }) {
  return (
    <div className="inline-grid grid-cols-7 gap-1.5">
      {dayNames.map((d, i) => (
        <span
          key={d}
          className={`flex min-w-11 flex-col items-center rounded-xl border-2 px-1 py-2 ${
            i === highlight ? 'border-ink-deep bg-sun text-ink-deep' : i === 6 ? 'border-pen/40 bg-white text-pen' : 'border-grid bg-white text-ink-deep'
          }`}
        >
          <span className="text-xs font-semibold">{i === 6 ? 'Chủ' : 'Thứ'}</span>
          <span className="font-display text-xl font-extrabold leading-none">{i === 6 ? 'nhật' : d}</span>
          {i === highlight && <span className="mt-1 text-[11px] font-bold">hôm nay</span>}
        </span>
      ))}
    </div>
  )
}

/** Dãy số, ô null là ô trống cần điền */
export function NumberRow({ numbers }: { numbers: (number | null)[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {numbers.map((n, i) =>
        n === null ? (
          <span key={i} className="grid h-16 min-w-16 place-items-center rounded-xl border-[3px] border-dashed border-pen bg-white font-display text-3xl font-extrabold text-pen">
            ?
          </span>
        ) : (
          <span key={i} className="grid h-16 min-w-16 place-items-center rounded-xl border-2 border-ink-deep/20 bg-white px-2 font-display text-3xl font-extrabold text-ink-deep">
            {n}
          </span>
        ),
      )}
    </div>
  )
}
