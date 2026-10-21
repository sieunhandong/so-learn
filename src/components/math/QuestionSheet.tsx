'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useAnswerAttempt } from '@/hooks/useAnswerAttempt'
import { STARS_AFTER_RETRY, STARS_FIRST_TRY } from '@/lib/rewards'
import NotebookPage from '@/components/ui/NotebookPage'
import RedStamp from '@/components/ui/RedStamp'
import AnswerOption, { type AnswerState } from './AnswerOption'
import CountingVisual from './CountingVisual'
import SpeakButton from './SpeakButton'
import type { Question } from '@/types/math'

interface QuestionSheetProps {
  question: Question
  onSolved?: (firstTry: boolean) => void
  /** Ghi số sao nhận được lên con dấu */
  showReward?: boolean
  /** Hiện bên dưới sau khi bé làm đúng */
  children?: React.ReactNode
}

export default function QuestionSheet({ question, onSolved, showReward = false, children }: QuestionSheetProps) {
  const { wrongPicks, solved, firstTry, choose } = useAnswerAttempt(question.correct, onSolved)

  function stateOf(index: number): AnswerState {
    if (solved) return index === question.correct ? 'correct' : 'dimmed'
    return wrongPicks.includes(index) ? 'wrong' : 'idle'
  }

  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <p className="font-display text-2xl font-bold leading-snug text-ink-deep md:text-3xl">{question.prompt}</p>
        <SpeakButton text={question.prompt} />
      </div>

      <div className="my-5">
        <CountingVisual visual={question.visual} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {question.options.map((option, index) => (
          <AnswerOption key={option} label={option} state={stateOf(index)} onChoose={() => choose(index)} />
        ))}
      </div>

      <div aria-live="polite" className={`relative text-lg ${solved ? 'mt-5 min-h-28 pr-32' : 'mt-4'}`}>
        <AnimatePresence>
          {solved && (
            <RedStamp
              title="Đúng!"
              note={showReward ? `+${firstTry ? STARS_FIRST_TRY : STARS_AFTER_RETRY} sao` : 'Giỏi quá'}
              className="absolute -right-2 -top-4 md:-right-6"
            />
          )}
        </AnimatePresence>
        {solved ? (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-graphite">
            <strong className="text-leaf">Đúng rồi! </strong>
            {question.explain}
          </motion.p>
        ) : (
          wrongPicks.length > 0 && <p className="text-pencil">Chưa đúng, bé đếm lại rồi chọn tiếp nhé.</p>
        )}
      </div>

      {solved && children}
    </>
  )

  return <NotebookPage>{content}</NotebookPage>
}
