'use client'

import { useRef, useState } from 'react'
import FlipNotebook, { type FlipDirection } from './FlipNotebook'
import type { GradeInfo, GradeLevel, Topic } from '@/types/math'

interface CurriculumExplorerProps {
  grades: GradeInfo[]
  topicsByGrade: Record<GradeLevel, Topic[]>
}

/**
 * Chọn một lớp (gáy vở bên trái) để mở quyển vở của lớp đó và lật từng trang.
 * Tab dùng phím mũi tên để chuyển, đúng mẫu tablist của WAI-ARIA.
 */
export default function CurriculumExplorer({ grades, topicsByGrade }: CurriculumExplorerProps) {
  const [active, setActive] = useState<GradeLevel>(grades[0].level)
  const [page, setPage] = useState(0)
  const [direction, setDirection] = useState<FlipDirection>(1)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const grade = grades.find(g => g.level === active) ?? grades[0]
  const topics = topicsByGrade[grade.level]
  const lastPage = topics.length + 1

  /** Đổi lớp thì lật sang mục lục của vở lớp đó; lớp lớn hơn lật tới, nhỏ hơn lật lùi */
  function selectGrade(level: GradeLevel) {
    if (level === active) return
    setDirection(level > active ? 1 : -1)
    setActive(level)
    setPage(0)
  }

  function goToPage(next: number) {
    const target = Math.max(0, Math.min(lastPage, next))
    if (target === page) return
    setDirection(target > page ? 1 : -1)
    setPage(target)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    if (step === undefined) return
    event.preventDefault()
    const index = grades.findIndex(g => g.level === active)
    const next = (index + step + grades.length) % grades.length
    selectGrade(grades[next].level)
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
              onClick={() => selectGrade(g.level)}
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

      <div role="tabpanel" id="muc-luc-lop" aria-labelledby={`tab-lop-${grade.level}`}>
        <FlipNotebook grade={grade} topics={topics} page={page} direction={direction} onGoTo={goToPage} />
      </div>
    </div>
  )
}
