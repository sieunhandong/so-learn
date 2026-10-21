'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import TopicMark from '@/components/math/TopicMark'
import ButtonLink from '@/components/ui/ButtonLink'
import NotebookPage from '@/components/ui/NotebookPage'
import PaperStack from '@/components/ui/PaperStack'
import type { GradeInfo, GradeLevel, Topic } from '@/types/math'

interface CurriculumExplorerProps {
  grades: GradeInfo[]
  topicsByGrade: Record<GradeLevel, Topic[]>
}

/**
 * Chọn một lớp (gáy vở bên trái) để xem mục lục các chủ đề của lớp đó.
 * Tab dùng phím mũi tên để chuyển, đúng mẫu tablist của WAI-ARIA.
 */
export default function CurriculumExplorer({ grades, topicsByGrade }: CurriculumExplorerProps) {
  const [active, setActive] = useState<GradeLevel>(grades[0].level)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const grade = grades.find(g => g.level === active) ?? grades[0]
  const topics = topicsByGrade[grade.level]
  const totalQuestions = topics.reduce((sum, t) => sum + t.total, 0)

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    if (step === undefined) return
    event.preventDefault()
    const index = grades.findIndex(g => g.level === active)
    const next = (index + step + grades.length) % grades.length
    setActive(grades[next].level)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-10 [&>*]:min-w-0">
      <div role="tablist" aria-label="Chọn lớp" aria-orientation="vertical" onKeyDown={onKeyDown} className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {grades.map((g, i) => {
          const selected = g.level === active
          return (
            <button
              key={g.level}
              ref={el => {
                tabRefs.current[i] = el
              }}
              type="button"
              role="tab"
              id={`tab-lop-${g.level}`}
              aria-selected={selected}
              aria-controls="muc-luc-lop"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(g.level)}
              className={`relative flex shrink-0 items-center gap-3 overflow-hidden rounded-l-md rounded-r-xl py-3 pl-6 pr-4 text-left transition-[width,translate,box-shadow] duration-300 ${g.cover} ${g.coverText} ${
                selected ? 'shadow-[6px_6px_0_0_rgb(42_22_115/0.2)] lg:w-full lg:translate-x-3' : 'opacity-90 hover:opacity-100 lg:w-[86%] lg:hover:translate-x-1'
              }`}
            >
              <span aria-hidden className="bg-linen absolute inset-0" />
              <span aria-hidden className="absolute inset-y-0 left-0 w-2.5 bg-black/20" />
              <span className="relative font-display text-4xl font-extrabold leading-none">{g.level}</span>
              <span className="relative">
                <span className="block font-display text-lg font-bold leading-tight">Lớp {g.level}</span>
                <span className="hidden text-sm leading-snug opacity-90 lg:block">{g.summary}</span>
              </span>
            </button>
          )
        })}
      </div>

      <PaperStack sheets={2}>
        <div role="tabpanel" id="muc-luc-lop" aria-labelledby={`tab-lop-${grade.level}`}>
          <NotebookPage>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={grade.level}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.18 }}
              >
                <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                  <h3 className="font-display text-3xl font-extrabold text-ink-deep md:text-4xl">Vở toán lớp {grade.level}</h3>
                  <p className="text-lg text-pencil">
                    {topics.length} chủ đề, {totalQuestions} câu luyện tập
                  </p>
                </div>
                <p className="mt-1 text-lg text-graphite">{grade.summary}</p>

                <ol className="mt-6 grid gap-x-8 gap-y-5 md:grid-cols-2">
                  {topics.map((t, i) => (
                    <li key={t.id} className="flex items-start gap-4">
                      <TopicMark mark={t.mark} />
                      <span>
                        <span className="block font-display text-base font-bold text-pencil">Bài {i + 1}</span>
                        <span className="block font-display text-xl font-bold leading-tight text-ink-deep">{t.title}</span>
                        <span className="block text-base text-pencil">
                          {t.description}, {t.total} câu
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>

                <ButtonLink href={`/math/${grade.level}`} className="mt-8">
                  Mở vở lớp {grade.level}
                </ButtonLink>
              </motion.div>
            </AnimatePresence>
          </NotebookPage>
        </div>
      </PaperStack>
    </div>
  )
}
