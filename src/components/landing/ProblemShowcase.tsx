'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import CountingVisual from '@/components/math/CountingVisual'
import type { Question, QuestionVisual } from '@/types/math'
import SectionHeading, { Accent } from './SectionHeading'

export interface ProblemExample {
  kind: QuestionVisual['kind']
  title: string
  body: string
  question: Question
}

interface ProblemShowcaseProps {
  examples: ProblemExample[]
}

const glyphs: Record<QuestionVisual['kind'], string> = { add: '+', 'take-away': '−', compare: '>' }

/**
 * Ba tờ đề mẫu xếp hình quạt 3D bên trái, mô tả từng dạng bài bên phải.
 * Rê chuột, focus hoặc bấm vào một dòng mô tả thì tờ đề tương ứng nổi lên trước.
 */
export default function ProblemShowcase({ examples }: ProblemShowcaseProps) {
  const [active, setActive] = useState(0)

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
      {/* Quạt 3 tờ đề */}
      <div aria-hidden className="relative h-[380px] perspective-[1600px] sm:h-[420px]">
        <div className="absolute inset-x-10 bottom-0 top-20 rounded-full bg-[radial-gradient(closest-side,rgb(42_127_212/0.25),transparent)] blur-2xl" />
        <div className="relative mx-auto h-full max-w-[24rem] scale-90 transform-3d sm:scale-100 lg:rotate-x-[8deg] lg:rotate-y-[16deg]">
          {examples.map((ex, i) => {
            const offset = i - active
            return (
              <motion.div
                key={ex.kind}
                initial={false}
                animate={{ x: offset * 70, y: Math.abs(offset) * 12, z: offset === 0 ? 60 : -Math.abs(offset) * 45, rotateZ: offset * 7 }}
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                className="absolute inset-x-0 top-4 mx-auto w-[88%] overflow-hidden rounded-2xl border-2 border-grid bg-oli py-5 pl-11 pr-5 shadow-[0_30px_40px_-26px_rgb(42_22_115/0.6)] before:absolute before:inset-y-0 before:left-7 before:w-0.5 before:bg-pen/35"
              >
                <p className="font-display text-xl font-extrabold text-ink-deep">{ex.title}</p>
                <div className="mt-3 h-32 origin-top-left scale-[0.72]">
                  <CountingVisual visual={ex.question.visual} />
                </div>
                <p className="mt-1 text-base leading-snug text-graphite">{ex.question.prompt}</p>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div>
        <SectionHeading
          title={
            <>
              Nhìn hình là
              <br />
              <Accent>hiểu đề</Accent>
            </>
          }
          lede="Mỗi dạng bài có một cách vẽ riêng, giống đồ dùng học toán bé vẫn cầm trên lớp."
        />
        <ul className="mt-8 space-y-3">
          {examples.map((ex, i) => {
            const selected = i === active
            return (
              <li key={ex.kind}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`flex w-full items-start gap-4 rounded-2xl border-2 p-4 text-left transition-[border-color,box-shadow,translate] duration-200 ${
                    selected ? 'translate-x-1 border-ink bg-white shadow-[0_8px_0_-2px_var(--color-grid)]' : 'border-grid bg-white/70 hover:border-ink/40'
                  }`}
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sky/10 font-display text-2xl font-extrabold text-sky">{glyphs[ex.kind]}</span>
                  <span>
                    <span className="block font-display text-xl font-bold text-ink-deep">{ex.title}</span>
                    <span className="block text-base leading-relaxed text-pencil">{ex.body}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
