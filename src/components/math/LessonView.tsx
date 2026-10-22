'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { recordAttempt } from '@/app/actions/progress'
import Button from '@/components/ui/Button'
import { StarIcon } from '@/components/ui/Icons'
import NotebookPage from '@/components/ui/NotebookPage'
import CountingVisual from './CountingVisual'
import QuizRunner from './QuizRunner'
import SpeakButton from './SpeakButton'
import TopicMark from './TopicMark'
import type { LessonIntro, Question } from '@/types/math'

export interface LessonInfo {
  title: string
  mark: string
  description: string
  chapterNumber: number
  chapterTitle: string
  intro: LessonIntro[]
}

interface LessonViewProps {
  lesson: LessonInfo
  questions: Question[]
  backHref: string
  /** Tên bé đang học; null khi khách chưa đăng nhập (không lưu tiến độ) */
  studentName: string | null
}

type Stage = 'learn' | 'practice'

/** Hai bước của một bài: 1. Cùng học, 2. Luyện tập */
function Steps({ stage, onChange }: { stage: Stage; onChange: (s: Stage) => void }) {
  const steps: { id: Stage; label: string }[] = [
    { id: 'learn', label: 'Cùng học' },
    { id: 'practice', label: 'Luyện tập' },
  ]
  return (
    <ol className="flex items-center gap-2">
      {steps.map((s, i) => {
        const current = s.id === stage
        return (
          <li key={s.id} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden className="h-0.5 w-6 rounded-full bg-grid" />}
            <button
              type="button"
              onClick={() => onChange(s.id)}
              aria-current={current ? 'step' : undefined}
              className={`flex items-center gap-2 rounded-full border-2 py-1.5 pl-1.5 pr-4 font-display text-lg font-bold transition-colors ${
                current ? 'border-ink bg-ink text-white' : 'border-grid bg-white text-ink-deep hover:border-ink/50'
              }`}
            >
              <span className={`grid size-7 place-items-center rounded-full text-base ${current ? 'bg-white/20' : 'bg-pen/10 text-pen'}`}>{i + 1}</span>
              {s.label}
            </button>
          </li>
        )
      })}
    </ol>
  )
}

export default function LessonView({ lesson, questions, backHref, studentName }: LessonViewProps) {
  const [stage, setStage] = useState<Stage>('learn')
  const [newBadges, setNewBadges] = useState<string[]>([])
  const [saveFailed, setSaveFailed] = useState(false)

  function handleAttempt(questionId: string, isCorrect: boolean, seconds: number) {
    if (!studentName) return
    recordAttempt({ exerciseId: questionId, isCorrect, timeSpent: seconds })
      .then(result => {
        if (!result.saved) setSaveFailed(true)
        if (result.newBadges.length > 0) setNewBadges(result.newBadges)
      })
      .catch(() => setSaveFailed(true))
  }

  const saveNote = studentName ? (
    saveFailed ? (
      <span className="text-pen">Có lần trả lời chưa lưu được. Bố mẹ kiểm tra kết nối mạng giúp bé.</span>
    ) : (
      <>Sao được lưu vào hồ sơ của {studentName}.</>
    )
  ) : (
    <>
      Đang học thử nên sao chưa được lưu.{' '}
      <Link href="/login" className="font-semibold text-ink underline underline-offset-2">
        Bố mẹ đăng nhập
      </Link>{' '}
      để lưu tiến độ của bé.
    </>
  )

  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-4 pt-8 md:px-6">
        <p className="font-display text-lg font-bold text-pencil">
          Chủ đề {lesson.chapterNumber}: {lesson.chapterTitle}
        </p>
        <h1 className="mt-2 flex items-center gap-4 font-display text-3xl font-extrabold leading-tight text-ink-deep md:text-4xl">
          <TopicMark mark={lesson.mark} size="lg" />
          {lesson.title}
        </h1>
        <div className="mt-5">
          <Steps stage={stage} onChange={setStage} />
        </div>
      </div>

      {stage === 'learn' ? (
        <main className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
          <p className="text-xl leading-relaxed text-graphite">{lesson.description}.</p>
          <ol className="mt-6 space-y-6">
            {lesson.intro.map((item, i) => (
              <li key={i}>
                <NotebookPage>
                  <div className="flex items-start gap-4">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sun font-display text-xl font-extrabold text-ink-deep">{i + 1}</span>
                    <p className="flex-1 font-display text-2xl font-bold leading-snug text-ink-deep">{item.text}</p>
                    <SpeakButton text={item.text} />
                  </div>
                  <div className="mt-5 max-w-full overflow-x-auto pb-1">
                    <CountingVisual visual={item.visual} />
                  </div>
                </NotebookPage>
              </li>
            ))}
          </ol>
          <Button onClick={() => setStage('practice')} className="mt-8 w-full sm:w-auto">
            Bắt đầu luyện tập ({questions.length} câu)
          </Button>
        </main>
      ) : (
        <QuizRunner questions={questions} topicTitle={lesson.title} backHref={backHref} onAttempt={handleAttempt} saveNote={saveNote} />
      )}

      {/* Báo huy hiệu mới */}
      <AnimatePresence>
        {newBadges.length > 0 && (
          <motion.div
            role="status"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md items-center gap-4 rounded-2xl border-2 border-pen bg-white p-4 shadow-[0_20px_40px_-16px_rgb(42_22_115/0.5)]"
          >
            <span aria-hidden className="grid size-14 shrink-0 place-items-center rounded-full border-4 border-pen">
              <StarIcon className="size-8" />
            </span>
            <p className="flex-1 text-lg text-graphite">
              <strong className="font-display text-ink-deep">Huy hiệu mới: </strong>
              {newBadges.join(', ')}
            </p>
            <button type="button" onClick={() => setNewBadges([])} className="rounded-xl px-3 py-2 font-display font-bold text-ink hover:bg-[#F3F0FF]">
              Đóng
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
