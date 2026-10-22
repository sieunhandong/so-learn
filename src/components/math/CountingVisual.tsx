import type { QuestionVisual } from '@/types/math'
import { PositionScene, Shape, Solid } from './visuals/Geometry'
import { CrossedOut, Group, Item, TensAndOnes } from './visuals/Items'
import { ClockFace, LengthCompare, NumberRow, RulerMeasure, WeekStrip } from './visuals/Measure'

const opClass = 'font-display text-4xl font-extrabold text-ink'

/** Khung nhỏ có nhãn, dùng khi so sánh hai nhóm */
function Panel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-32 flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-ink/25 bg-white/70 px-4 py-3">
      <div className="flex min-h-14 items-center">{children}</div>
      <span className="text-base font-semibold text-pencil">{label}</span>
    </div>
  )
}

/** Hình minh họa cho một câu hỏi hoặc một phần "Cùng học". Chỉ để nhìn, nên ẩn với trình đọc màn hình. */
export default function CountingVisual({ visual }: { visual: QuestionVisual }) {
  switch (visual.kind) {
    case 'count':
      return (
        <div aria-hidden>
          <Group item={visual.item} count={visual.count} tone="first" />
        </div>
      )

    case 'add':
      return (
        <div aria-hidden className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Group item={visual.item} count={visual.groups[0]} tone="first" />
          <span className={opClass}>+</span>
          <Group item={visual.item} count={visual.groups[1]} tone="second" />
        </div>
      )

    case 'take-away':
      return (
        <div aria-hidden className="flex flex-wrap items-end gap-x-5 gap-y-2">
          {visual.total - visual.remove > 0 && <Group item={visual.item} count={visual.total - visual.remove} tone="first" />}
          <CrossedOut>
            {Array.from({ length: visual.remove }, (_, i) => (
              <Item key={i} item={visual.item} tone="first" />
            ))}
          </CrossedOut>
        </div>
      )

    case 'compare':
      return (
        <div aria-hidden className="flex flex-wrap items-center gap-6">
          <TensAndOnes value={visual.left} />
          <span className="grid size-12 place-items-center rounded-full border-2 border-dashed border-ink/40 font-display text-2xl font-bold text-ink">?</span>
          <TensAndOnes value={visual.right} />
        </div>
      )

    case 'compare-groups':
      return (
        <div aria-hidden className="flex flex-wrap items-stretch gap-3">
          <Panel label="Bên trái">
            <Group item={visual.item} count={visual.left} tone="first" />
          </Panel>
          <Panel label="Bên phải">
            <Group item={visual.item} count={visual.right} tone="second" />
          </Panel>
        </div>
      )

    case 'split':
      return (
        <div aria-hidden className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Group item={visual.item} count={visual.first} tone="first" />
          <span className="h-12 w-1 rounded-full bg-pen/50" />
          <Group item={visual.item} count={visual.total - visual.first} tone="second" />
        </div>
      )

    case 'shapes':
      return (
        <div aria-hidden className="flex flex-wrap items-center gap-3">
          {visual.shapes.map((s, i) => (
            <Shape key={i} shape={s} index={i} />
          ))}
        </div>
      )

    case 'solids':
      return (
        <div aria-hidden className="flex flex-wrap items-end gap-4">
          {visual.solids.map((s, i) => (
            <Solid key={i} solid={s} index={i} />
          ))}
        </div>
      )

    case 'position':
      return (
        <div aria-hidden>
          <PositionScene place={visual.place} />
        </div>
      )

    case 'tens-ones':
      return (
        <div aria-hidden>
          <TensAndOnes value={visual.value} showNumber={false} />
        </div>
      )

    case 'tens-calc':
      return (
        <div aria-hidden className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <TensAndOnes value={visual.a} />
          <span className={opClass}>{visual.op === '+' ? '+' : '−'}</span>
          <TensAndOnes value={visual.b} />
        </div>
      )

    case 'number-row':
      return (
        <div aria-hidden>
          <NumberRow numbers={visual.numbers} />
        </div>
      )

    case 'length':
      return (
        <div aria-hidden>
          <LengthCompare a={visual.a} b={visual.b} />
        </div>
      )

    case 'ruler':
      return (
        <div aria-hidden className="max-w-full">
          <RulerMeasure length={visual.length} />
        </div>
      )

    case 'clock':
      return (
        <div aria-hidden>
          <ClockFace hour={visual.hour} />
        </div>
      )

    case 'week':
      return (
        <div aria-hidden className="max-w-full overflow-x-auto">
          <WeekStrip highlight={visual.highlight} />
        </div>
      )
  }
}
