import type { Placement, ShapeKind, SolidKind } from '@/types/math'

// Màu xoay vòng theo vị trí, không theo loại hình, để màu không "mách" đáp án
const fills = ['fill-ink', 'fill-sun', 'fill-leaf', 'fill-sky', 'fill-pen']

export function Shape({ shape, index }: { shape: ShapeKind; index: number }) {
  const fill = `${fills[index % fills.length]} stroke-ink-deep`
  return (
    <svg aria-hidden viewBox="0 0 96 72" className="h-16 w-20 md:h-20 md:w-24">
      {shape === 'square' && <rect x="18" y="6" width="60" height="60" rx="3" className={fill} strokeWidth={3} />}
      {shape === 'circle' && <circle cx="48" cy="36" r="31" className={fill} strokeWidth={3} />}
      {shape === 'triangle' && <path d="M48 5L86 67H10z" className={fill} strokeWidth={3} strokeLinejoin="round" />}
      {shape === 'rectangle' && <rect x="4" y="16" width="88" height="44" rx="3" className={fill} strokeWidth={3} />}
    </svg>
  )
}

/** Khối vẽ kiểu ba mặt: mặt trên sáng, mặt trước vừa, mặt bên tối */
export function Solid({ solid, index }: { solid: SolidKind; index: number }) {
  const tones = [
    ['fill-[#7B5DF2]', 'fill-ink', 'fill-[#33208A]'],
    ['fill-[#FFE38F]', 'fill-sun', 'fill-[#D99A12]'],
    ['fill-[#4FC98A]', 'fill-leaf', 'fill-[#147044]'],
  ][index % 3]
  const w = solid === 'cube' ? 44 : 80
  const h = 44
  const d = 18
  return (
    <svg aria-hidden viewBox={`0 0 ${w + d + 4} ${h + d + 4}`} className={solid === 'cube' ? 'h-20 w-[5.5rem]' : 'h-20 w-36'}>
      <g className="stroke-ink-deep" strokeWidth={2.5} strokeLinejoin="round">
        <path d={`M2 ${d + 2}L${d + 2} 2H${w + d + 2}L${w + 2} ${d + 2}z`} className={tones[0]} />
        <path d={`M2 ${d + 2}H${w + 2}V${h + d + 2}H2z`} className={tones[1]} />
        <path d={`M${w + 2} ${d + 2}L${w + d + 2} 2V${h + 2}L${w + 2} ${h + d + 2}z`} className={tones[2]} />
      </g>
    </svg>
  )
}

function Box({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="stroke-ink-deep" strokeWidth={3} strokeLinejoin="round">
      <rect width="64" height="52" rx="4" className="fill-sky" />
      <path d="M0 14H64" />
      <rect x="24" y="22" width="16" height="10" rx="2" className="fill-white" />
    </g>
  )
}

function Ball({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g className="stroke-ink-deep" strokeWidth={3}>
      <circle cx={cx} cy={cy} r="17" className="fill-pen" />
      <path d={`M${cx - 17} ${cy}c8 -6 26 -6 34 0`} fill="none" className="stroke-white" strokeWidth={3} />
    </g>
  )
}

/** Quả bóng đặt ở một vị trí so với cái hộp, nhìn từ phía bé */
export function PositionScene({ place }: { place: Placement }) {
  return (
    <svg aria-hidden viewBox="0 0 260 170" className="h-40 w-64 md:h-44 md:w-72">
      <path d="M10 160H250" className="stroke-ink/30" strokeWidth={3} strokeDasharray="6 8" />
      {place === 'between' ? (
        <>
          <Box x={22} y={100} />
          <Box x={174} y={100} />
          <Ball cx={130} cy={135} />
        </>
      ) : (
        <>
          <Box x={98} y={place === 'below' ? 40 : 100} />
          {place === 'above' && <Ball cx={130} cy={80} />}
          {place === 'below' && <Ball cx={130} cy={135} />}
          {place === 'left' && <Ball cx={60} cy={135} />}
          {place === 'right' && <Ball cx={200} cy={135} />}
        </>
      )}
    </svg>
  )
}
