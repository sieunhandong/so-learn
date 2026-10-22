'use client'

import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { useRef, useState } from 'react'
import CountingVisual from '@/components/math/CountingVisual'
import type { Question, QuestionVisual } from '@/types/math'
import SectionHeading, { Accent } from './SectionHeading'

export interface ProblemExample {
  title: string
  body: string
  question: Question
}

interface ProblemShowcaseProps {
  examples: ProblemExample[]
}

const glyphs: Partial<Record<QuestionVisual['kind'], string>> = { add: '+', 'take-away': '−', compare: '>' }

/** Kéo quá ngưỡng này (px) thì trượt sang tờ bên cạnh */
const SWIPE_PX = 60

function Arrow({ dir, onClick, disabled }: { dir: 'prev' | 'next'; onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Tờ trước' : 'Tờ sau'}
      className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-grid bg-white text-ink shadow-[0_5px_0_0_var(--color-grid)] transition-[translate,box-shadow,border-color] duration-100 hover:border-ink active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:hover:border-grid disabled:active:translate-y-0"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  )
}

/**
 * Băng trượt 3D các tờ đề mẫu: tờ đang chọn ở giữa, hai bên xoay nghiêng ra sau.
 * Chuyển tờ bằng tab, mũi tên, bấm vào tờ bên cạnh, hoặc kéo/vuốt ngang.
 */
export default function ProblemShowcase({ examples }: ProblemShowcaseProps) {
  const [active, setActive] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const last = examples.length - 1
  const current = examples[active]

  function goTo(index: number) {
    const next = Math.max(0, Math.min(last, index))
    setActive(next)
    tabRefs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }

  function onTabKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    if (step === undefined) return
    event.preventDefault()
    const next = Math.max(0, Math.min(last, active + step))
    goTo(next)
    tabRefs.current[next]?.focus()
  }

  function onDragEnd(_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    if (info.offset.x < -SWIPE_PX) goTo(active + 1)
    else if (info.offset.x > SWIPE_PX) goTo(active - 1)
  }

  return (
    <div>
      <SectionHeading
        layout="center"
        title={
          <>
            Nhìn hình là <Accent>hiểu đề</Accent>
          </>
        }
        lede="Mỗi câu có một cách vẽ riêng, giống đồ dùng học toán bé vẫn cầm trên lớp. Trượt để xem từng tờ."
      />

      {/* Hàng tab trượt ngang */}
      <div
        role="tablist"
        aria-label="Các dạng hình minh họa"
        onKeyDown={onTabKeyDown}
        className="-mx-4 mt-10 flex snap-x gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:thin] md:justify-center"
      >
        {examples.map((ex, i) => {
          const selected = i === active
          return (
            <button
              key={ex.question.id}
              ref={el => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="to-de-mau"
              tabIndex={selected ? 0 : -1}
              onClick={() => goTo(i)}
              className={`flex shrink-0 snap-center items-center gap-2 rounded-full border-2 py-2 pl-2 pr-4 font-display text-lg font-bold transition-[background-color,border-color,color,box-shadow] duration-200 ${
                selected ? 'border-ink bg-ink text-white shadow-[0_5px_0_0_var(--color-ink-deep)]' : 'border-grid bg-white text-ink-deep hover:border-ink/50'
              }`}
            >
              <span className={`grid size-8 place-items-center rounded-full text-xl ${selected ? 'bg-white/15' : 'bg-sky/10 text-sky'}`}>{glyphs[ex.question.visual.kind] ?? '?'}</span>
              {ex.title}
            </button>
          )
        })}
      </div>

      {/* Băng trượt 3D */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={onDragEnd}
        className="relative mt-6 h-[22rem] cursor-grab touch-pan-y perspective-[1400px] active:cursor-grabbing sm:h-[24rem]"
      >
        <div aria-hidden className="absolute inset-x-[15%] bottom-0 top-1/3 rounded-full bg-[radial-gradient(closest-side,rgb(42_127_212/0.22),transparent)] blur-2xl" />
        {examples.map((ex, i) => {
          const offset = i - active
          const distance = Math.abs(offset)
          return (
            <motion.div
              key={ex.question.id}
              initial={false}
              animate={{
                x: `${offset * 64}%`,
                z: -distance * 160,
                rotateY: Math.max(-50, Math.min(50, -offset * 34)),
                opacity: distance > 2 ? 0 : 1,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 26 }}
              onClick={() => offset !== 0 && goTo(i)}
              aria-hidden={offset !== 0}
              style={{ zIndex: examples.length - distance }}
              className="absolute left-0 right-0 top-2 mx-auto w-[min(23rem,80vw)] select-none overflow-hidden rounded-2xl border-2 border-grid bg-oli py-5 pl-11 pr-5 shadow-[0_34px_44px_-28px_rgb(42_22_115/0.6)] before:absolute before:inset-y-0 before:left-7 before:w-0.5 before:bg-pen/35"
            >
              <p className="font-display text-lg font-extrabold text-pencil">
                Tờ {i + 1}/{examples.length}
              </p>
              {/* Thu nhỏ 60%: vùng bố cục rộng 1/0.6 để hình không xuống dòng trước khi thu nhỏ */}
              <div className="mt-3 h-28">
                <div className="w-[166%] origin-top-left scale-[0.6]">
                  <CountingVisual visual={ex.question.visual} />
                </div>
              </div>
              <p className="font-display text-xl font-bold leading-snug text-ink-deep">{ex.question.prompt}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Cách làm của tờ đang chọn, kẹp giữa hai mũi tên */}
      <div className="mx-auto mt-4 flex max-w-2xl items-center gap-4">
        <Arrow dir="prev" onClick={() => goTo(active - 1)} disabled={active === 0} />
        <div role="tabpanel" id="to-de-mau" aria-live="polite" className="min-h-24 flex-1 text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={current.question.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
              <h3 className="font-display text-2xl font-extrabold text-ink-deep">{current.title}</h3>
              <p className="mt-1 text-lg leading-relaxed text-pencil">{current.body}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <Arrow dir="next" onClick={() => goTo(active + 1)} disabled={active === last} />
      </div>
    </div>
  )
}
