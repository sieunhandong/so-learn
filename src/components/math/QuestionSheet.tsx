'use client'

import { useEffect, useRef } from 'react'
import { useAnswerAttempt } from '@/hooks/useAnswerAttempt'
import SolvedFeedback from '@/components/learn/SolvedFeedback'
import NotebookPage from '@/components/ui/NotebookPage'
import AnswerOption, { type AnswerState } from './AnswerOption'
import CountingVisual from './CountingVisual'
import SpeakButton from './SpeakButton'
import type { Question } from '@/types/math'

interface QuestionSheetProps {
  question: Question
  onSolved?: (firstTry: boolean) => void
  /** Gọi sau mỗi lần chọn, kèm số giây suy nghĩ kể từ lần chọn trước */
  onAttempt?: (isCorrect: boolean, seconds: number) => void
  /** Ghi số sao nhận được lên con dấu */
  showReward?: boolean
  /** Hiện bên dưới sau khi bé làm đúng */
  children?: React.ReactNode
}

export default function QuestionSheet({ question, onSolved, onAttempt, showReward = false, children }: QuestionSheetProps) {
  // Mốc thời gian để đo bé suy nghĩ bao lâu cho mỗi lần chọn
  const lastAttemptAt = useRef<number | null>(null)
  useEffect(() => {
    lastAttemptAt.current = Date.now()
  }, [])

  function handleAttempt(isCorrect: boolean) {
    const now = Date.now()
    const seconds = lastAttemptAt.current === null ? 0 : (now - lastAttemptAt.current) / 1000
    lastAttemptAt.current = now
    onAttempt?.(isCorrect, seconds)
  }

  const { wrongPicks, solved, firstTry, choose } = useAnswerAttempt(question.correct, onSolved, handleAttempt)
  const columns = question.options.length === 3 ? 'grid-cols-3' : 'grid-cols-2'

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

      <div className={`grid gap-3 md:gap-4 ${columns}`}>
        {question.options.map((option, index) => (
          <AnswerOption key={option} label={option} state={stateOf(index)} onChoose={() => choose(index)} />
        ))}
      </div>

      <SolvedFeedback
        solved={solved}
        firstTry={firstTry}
        showReward={showReward}
        explain={question.explain}
        wrongHint="Chưa đúng, bé đếm lại rồi chọn tiếp nhé."
        hasWrong={wrongPicks.length > 0}
      >
        {children}
      </SolvedFeedback>
    </>
  )

  return <NotebookPage>{content}</NotebookPage>
}
