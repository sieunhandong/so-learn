import type { CountItem } from '@/types/math'

export type Tone = 'first' | 'second'

export function Apple() {
  return (
    <svg aria-hidden viewBox="0 0 40 42" className="h-11 w-10 md:h-14 md:w-[3.25rem]">
      <path
        d="M20 13c-3-3-9.5-3.2-12.5 1-3.2 4.5-2 11.5 1.2 16.5 2.3 3.7 5.8 6.2 8.3 5 1-.5 2-.6 3-.6s2 .1 3 .6c2.5 1.2 6-1.3 8.3-5 3.2-5 4.4-12 1.2-16.5-3-4.2-9.5-4-12.5-1z"
        className="fill-pen stroke-ink-deep"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <path d="M20 13c0-3.5 1-6 3.5-8.5" className="stroke-ink-deep" strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <path d="M23 8.5c3-3.5 7.5-3.5 10-1.5-2.3 3.5-6.8 4.3-10 1.5z" className="fill-leaf stroke-ink-deep" strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M11.5 19c.3-2.2 1.4-3.6 3.3-4.4" className="stroke-white/70" strokeWidth={2.4} strokeLinecap="round" fill="none" />
    </svg>
  )
}

export function Stick({ tone }: { tone: Tone }) {
  return (
    <svg aria-hidden viewBox="0 0 12 56" className="h-16 w-3.5 md:h-20 md:w-4">
      <rect x="2" y="2" width="8" height="52" rx="4" className={`stroke-ink-deep ${tone === 'first' ? 'fill-sun' : 'fill-[#F49AB0]'}`} strokeWidth={2} />
    </svg>
  )
}

export function Dot({ tone }: { tone: Tone }) {
  return (
    <svg aria-hidden viewBox="0 0 32 32" className="size-8 md:size-9">
      <circle cx="16" cy="16" r="13" className={`stroke-ink-deep ${tone === 'first' ? 'fill-ink' : 'fill-sun'}`} strokeWidth={2.2} />
    </svg>
  )
}

/** Một bó chục: 10 que tính buộc dây đỏ */
export function Bundle() {
  return (
    <svg aria-hidden viewBox="0 0 44 64" className="h-[4.6rem] w-[3.2rem] md:h-[5.75rem] md:w-16">
      {[4, 10, 16, 22, 28, 34].map(x => (
        <rect key={x} x={x} y="3" width="7" height="58" rx="3.5" className="fill-sun stroke-ink-deep" strokeWidth={1.8} />
      ))}
      <rect x="1" y="27" width="42" height="9" rx="2" className="fill-pen stroke-ink-deep" strokeWidth={1.8} />
    </svg>
  )
}

export function Item({ item, tone }: { item: CountItem; tone: Tone }) {
  if (item === 'apple') return <Apple />
  if (item === 'stick') return <Stick tone={tone} />
  return <Dot tone={tone} />
}

/** Một nét bút đỏ gạch qua cả nhóm đồ vật bị bớt đi */
export function CrossedOut({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex">
      <span className="inline-flex flex-wrap items-end gap-1.5 opacity-55">{children}</span>
      <svg aria-hidden viewBox="0 0 20 20" preserveAspectRatio="none" className="absolute -inset-x-2 -inset-y-1 h-[calc(100%+0.5rem)] w-[calc(100%+1rem)]">
        <path d="M1 17C7 12 13 7 19 3" className="stroke-pen" strokeWidth={4} strokeLinecap="round" vectorEffect="non-scaling-stroke" fill="none" />
      </svg>
    </span>
  )
}

/** Không có đồ vật nào: một đĩa trống nét đứt */
export function EmptyPlate() {
  return <span className="inline-grid h-14 w-20 place-items-center rounded-full border-[3px] border-dashed border-ink/30 text-base font-semibold text-pencil">trống</span>
}

export function Group({ item, count, tone }: { item: CountItem; count: number; tone: Tone }) {
  if (count === 0) return <EmptyPlate />
  return (
    <span className={`inline-flex flex-wrap items-end ${item === 'stick' ? 'gap-1.5' : 'gap-1'}`}>
      {Array.from({ length: count }, (_, i) => (
        <Item key={i} item={item} tone={tone} />
      ))}
    </span>
  )
}

/** Số có hai chữ số vẽ bằng bó chục và que lẻ; showNumber: ghi số bên dưới */
export function TensAndOnes({ value, showNumber = true }: { value: number; showNumber?: boolean }) {
  const tens = Math.floor(value / 10)
  const ones = value % 10
  return (
    <span className="flex flex-col items-center gap-2">
      <span className="flex flex-wrap items-end justify-center gap-1.5">
        {Array.from({ length: tens }, (_, i) => (
          <Bundle key={`t${i}`} />
        ))}
        {Array.from({ length: ones }, (_, i) => (
          <Stick key={`o${i}`} tone="first" />
        ))}
      </span>
      {showNumber && <span className="font-display text-4xl font-extrabold text-ink-deep">{value}</span>}
    </span>
  )
}
