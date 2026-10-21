'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useAnswerAttempt } from '@/hooks/useAnswerAttempt'
import AnswerOption, { type AnswerState } from '@/components/math/AnswerOption'
import SpeakButton from '@/components/math/SpeakButton'
import RedStamp from '@/components/ui/RedStamp'
import CubeDiorama from './CubeDiorama'
import type { Question } from '@/types/math'

interface HeroPlaygroundProps {
  question: Question
}

/** Sân xếp khối 3D, và thẻ câu hỏi nổi phía trước để bé trả lời thử */
export default function HeroPlayground({ question }: HeroPlaygroundProps) {
  const { wrongPicks, solved, choose } = useAnswerAttempt(question.correct)
  const [first, second] = question.visual.kind === 'add' ? question.visual.groups : [0, 0]

  function stateOf(index: number): AnswerState {
    if (solved) return index === question.correct ? 'correct' : 'dimmed'
    return wrongPicks.includes(index) ? 'wrong' : 'idle'
  }

  return (
    <div className="relative">
      <CubeDiorama first={first} second={second} solved={solved} />

      <motion.div
        initial={{ y: 24, rotate: -4 }}
        animate={{ y: 0, rotate: -1.5 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto -mt-8 max-w-md lg:absolute lg:bottom-6 lg:left-0 lg:mt-0 lg:w-[23rem]"
      >
        <div className="relative rounded-3xl border-2 border-grid bg-white p-5 shadow-[0_34px_50px_-26px_rgb(42_22_115/0.55),0_2px_0_0_var(--color-grid)]">
          <div className="flex items-start gap-3">
            <p className="flex-1 font-display text-xl font-bold leading-snug text-ink-deep">{question.prompt}</p>
            <SpeakButton text={question.prompt} />
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {question.options.map((option, index) => (
              <AnswerOption key={option} label={option} state={stateOf(index)} onChoose={() => choose(index)} />
            ))}
          </div>

          <p aria-live="polite" className={`mt-3 min-h-7 text-base leading-snug ${solved ? 'pr-24 text-graphite' : 'text-pencil'}`}>
            {solved ? (
              <>
                <strong className="text-leaf">Đúng rồi! </strong>
                {question.explain}
              </>
            ) : wrongPicks.length > 0 ? (
              'Chưa đúng, bé đếm lại các khối nhé.'
            ) : (
              'Chọn một số, sai thì thử lại.'
            )}
          </p>

          <AnimatePresence>
            {solved && <RedStamp title="Đúng!" note="Giỏi quá" className="absolute -bottom-10 -right-5" />}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
