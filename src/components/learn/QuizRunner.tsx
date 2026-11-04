'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useQuizProgress } from '@/hooks/useQuizProgress'
import Button from '@/components/ui/Button'
import PaperStack from '@/components/ui/PaperStack'
import ProgressRuler from '@/components/ui/ProgressRuler'
import StarCount from '@/components/ui/StarCount'
import BuildSyllable from '@/components/tieng-viet/BuildSyllable'
import QuestionSheet from './QuestionSheet'
import QuizResult from './QuizResult'
import type { LessonQuestion } from '@/types/lesson'

interface QuizRunnerProps {
  questions: LessonQuestion[]
  topicTitle: string
  backHref: string
  /** Lời nhắc nhẹ nhàng khi bé làm sai, tùy môn */
  wrongHint: string
  /** Gọi sau mỗi lần bé chọn đáp án, để lưu tiến độ */
  onAttempt?: (questionId: string, isCorrect: boolean, seconds: number) => void
  /** Dòng nhỏ cho biết sao có được lưu vào hồ sơ hay không */
  saveNote?: React.ReactNode
}

// Lật trang vở: mép phải nhấc lên rồi quay sang trái quanh gáy
const turnAway = { rotateY: -110, opacity: 0, zIndex: 20, transition: { duration: 0.55, ease: [0.45, 0, 0.55, 1] as const } }

export default function QuizRunner({ questions, topicTitle, backHref, wrongHint, onAttempt, saveNote }: QuizRunnerProps) {
  const quiz = useQuizProgress(questions.length)
  const question = questions[quiz.index]
  const remaining = questions.length - quiz.index - 1

  if (quiz.finished) {
    return (
      <QuizResult
        topicTitle={topicTitle}
        total={questions.length}
        firstTryCount={quiz.firstTryCount}
        stars={quiz.stars}
        backHref={backHref}
        onRestart={quiz.restart}
        saveNote={saveNote}
      />
    )
  }

  const nextButton = (
    <Button onClick={quiz.next} autoFocus className="mt-2 w-full">
      {quiz.isLast ? 'Xem kết quả' : 'Câu tiếp theo'}
    </Button>
  )

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 md:px-6">
      <h1 className="font-display text-xl font-bold text-pencil">{topicTitle}</h1>
      <div className="mb-8 mt-2 flex items-center gap-4">
        <span className="font-display text-2xl font-bold text-ink-deep">
          Câu {quiz.index + 1}/{questions.length}
        </span>
        <ProgressRuler
          value={quiz.index + (quiz.currentSolved ? 1 : 0)}
          max={questions.length}
          label="Tiến độ bài làm"
          className="flex-1"
        />
        <StarCount value={quiz.stars} />
      </div>
      {saveNote && <div className="-mt-5 mb-6 text-base text-pencil">{saveNote}</div>}

      <PaperStack sheets={remaining} className="perspective-[1800px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 8, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0, zIndex: 0 }}
            exit={turnAway}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative origin-left"
          >
            {/* Câu chọn đáp án và câu ghép tiếng nhận cùng bộ prop; mỗi câu có key riêng nên trạng thái được làm mới theo câu */}
            {question.type === 'build' ? (
              <BuildSyllable
                question={question}
                wrongHint={wrongHint}
                onSolved={quiz.markSolved}
                onAttempt={(isCorrect, seconds) => onAttempt?.(question.id, isCorrect, seconds)}
                showReward
              >
                {nextButton}
              </BuildSyllable>
            ) : (
              <QuestionSheet
                question={question}
                wrongHint={wrongHint}
                onSolved={quiz.markSolved}
                onAttempt={(isCorrect, seconds) => onAttempt?.(question.id, isCorrect, seconds)}
                showReward
              >
                {nextButton}
              </QuestionSheet>
            )}
          </motion.div>
        </AnimatePresence>
      </PaperStack>
    </main>
  )
}
