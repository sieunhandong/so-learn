'use client'

import { AnimatePresence, motion, type Variants } from 'framer-motion'
import TopicMark from '@/components/math/TopicMark'
import ButtonLink from '@/components/ui/ButtonLink'
import { PenTick } from '@/components/ui/Icons'
import type { GradeInfo, Topic } from '@/types/math'

export type FlipDirection = 1 | -1

interface FlipNotebookProps {
  grade: GradeInfo
  topics: Topic[]
  /** 0: mục lục; 1..n: từng bài; n+1: trang cuối */
  page: number
  direction: FlipDirection
  onGoTo: (page: number) => void
}

const flip = { duration: 0.7, ease: [0.45, 0.05, 0.3, 1] as const }

/**
 * Lật tới: trang cũ nằm trên, quay quanh gáy sang trái; trang mới nằm sẵn bên dưới.
 * Lật lùi: trang mới từ bên trái quay về nằm trên; trang cũ nằm yên bên dưới đến khi lật xong.
 */
const pageVariants: Variants = {
  enter: (dir: FlipDirection) => (dir === 1 ? { rotateY: 0, zIndex: 1 } : { rotateY: -180, zIndex: 3 }),
  center: { rotateY: 0, zIndex: 2, transition: flip },
  exit: (dir: FlipDirection) => (dir === 1 ? { rotateY: -180, zIndex: 3, transition: flip } : { zIndex: 1, opacity: 0.999, transition: flip }),
}

const paper =
  'absolute inset-0 overflow-hidden rounded-r-xl rounded-l-sm border border-grid bg-oli backface-hidden before:absolute before:inset-y-0 before:left-9 before:w-0.5 before:bg-pen/35'

function PageNumber({ n, total }: { n: number; total: number }) {
  return (
    <p className="absolute bottom-4 right-16 font-display text-base font-bold text-pencil">
      Trang {n}/{total}
    </p>
  )
}

/** Trang 1: mục lục, mỗi dòng bấm được để lật tới trang của bài đó */
function TocPage({ grade, topics, onGoTo }: Pick<FlipNotebookProps, 'grade' | 'topics' | 'onGoTo'>) {
  const totalQuestions = topics.reduce((sum, t) => sum + t.total, 0)
  // Lớp có nội dung thật thì mỗi mục là một chủ đề
  const unit = topics.some(t => t.items) ? 'Chủ đề' : 'Bài'
  const compact = topics.length > 5
  return (
    <>
      <h3 className="font-display text-3xl font-extrabold text-ink-deep md:text-4xl">Vở toán lớp {grade.level}</h3>
      <p className="mt-1 text-lg text-pencil">
        {topics.length} {unit.toLowerCase()}, {totalQuestions} câu luyện tập
      </p>
      <p className={`font-display text-xl font-bold text-ink ${compact ? 'mt-3' : 'mt-5'}`}>Mục lục</p>
      <ol className="mt-1">
        {topics.map((t, i) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => onGoTo(i + 1)}
              className={`-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-lg px-2 text-left transition-colors hover:bg-[#F3F0FF] ${compact ? 'py-1' : 'py-2'}`}
            >
              <span className="shrink-0 whitespace-nowrap font-display text-base font-bold text-pencil">
                {unit} {i + 1}
              </span>
              <span className={`min-w-0 flex-1 font-display font-bold leading-tight text-ink-deep sm:flex-none ${compact ? 'text-lg' : 'text-xl'}`}>{t.title}</span>
              <span aria-hidden className="mb-1 hidden flex-1 self-end border-b-2 border-dotted border-ink/25 sm:block" />
              <span className="ml-auto shrink-0 whitespace-nowrap font-display text-base font-bold text-ink">trang {i + 2}</span>
            </button>
          </li>
        ))}
      </ol>
    </>
  )
}

/** Trang của một bài */
function TopicPage({ grade, topic, index }: { grade: GradeInfo; topic: Topic; index: number }) {
  // Lớp có nội dung thật: mỗi trang là một chủ đề, liệt kê các bài bên trong
  if (topic.items) {
    return (
      <>
        <p className="font-display text-lg font-bold text-pencil">
          Lớp {grade.level}, chủ đề {index + 1}
        </p>
        <h3 className="mt-2 font-display text-3xl font-extrabold leading-tight text-ink-deep">{topic.title}</h3>
        <p className="mt-1 text-lg text-pencil">
          {topic.description}, {topic.total} câu luyện tập
        </p>
        <ol className="mt-4 space-y-1.5 text-lg text-graphite">
          {topic.items.map((item, i) => (
            <li key={item} className="flex items-start gap-3">
              <span className="w-12 shrink-0 font-display font-bold text-pencil">Bài {i + 1}</span>
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ol>
      </>
    )
  }

  return (
    <>
      <p className="font-display text-lg font-bold text-pencil">
        Lớp {grade.level}, bài {index + 1}
      </p>
      <h3 className="mt-3 flex items-center gap-4 font-display text-3xl font-extrabold leading-tight text-ink-deep md:text-4xl">
        <TopicMark mark={topic.mark} size="lg" />
        {topic.title}
      </h3>
      <p className="mt-4 text-xl leading-relaxed text-graphite">{topic.description}.</p>
      <ul className="mt-6 space-y-2 text-lg text-graphite">
        {[`${topic.total} câu luyện tập`, 'Có hình để đếm và nút nghe đọc đề', index === 0 ? 'Bài đầu tiên, mở sẵn' : 'Mở khi bé đã bắt đầu bài trước'].map(fact => (
          <li key={fact} className="flex items-center gap-3">
            <PenTick className="size-6 shrink-0" />
            {fact}
          </li>
        ))}
      </ul>
    </>
  )
}

/** Trang cuối: mời mở vở */
function EndPage({ grade }: { grade: GradeInfo }) {
  return (
    <div className="flex h-full flex-col items-start justify-center pb-10">
      <p className="font-display text-lg font-bold text-pencil">Hết mục lục</p>
      <h3 className="mt-2 font-display text-4xl font-extrabold leading-tight text-ink-deep">Bé sẵn sàng học lớp {grade.level}?</h3>
      <p className="mt-3 max-w-[34ch] text-lg leading-relaxed text-graphite">Mở vở để bắt đầu từ bài 1. Sai thì thử lại, không giới hạn số lần.</p>
      <ButtonLink href={`/math/${grade.level}`} size="lg" className="mt-6">
        Mở vở lớp {grade.level}
      </ButtonLink>
    </div>
  )
}

/** Quyển vở có bìa màu của lớp, trang giấy ô li lật quanh gáy bên trái */
export default function FlipNotebook({ grade, topics, page, direction, onGoTo }: FlipNotebookProps) {
  const pageCount = topics.length + 2
  const isLast = page === pageCount - 1

  let content: React.ReactNode
  if (page === 0) content = <TocPage grade={grade} topics={topics} onGoTo={onGoTo} />
  else if (isLast) content = <EndPage grade={grade} />
  else content = <TopicPage grade={grade} topic={topics[page - 1]} index={page - 1} />

  return (
    <div>
      {/* Bìa vở: màu của lớp, vân vải, gáy tối */}
      <div className={`relative rounded-l-md rounded-r-2xl p-2.5 pl-6 shadow-[0_30px_40px_-26px_rgb(42_22_115/0.7)] ${grade.cover}`}>
        <span aria-hidden className="bg-linen absolute inset-0 rounded-[inherit]" />
        <span aria-hidden className="absolute inset-y-0 left-0 w-4 rounded-l-md bg-black/25" />

        {/* Mép giấy xếp chồng bên phải */}
        <span aria-hidden className="absolute bottom-3 right-1 top-3 w-3 rounded-r-lg bg-[repeating-linear-gradient(90deg,#fff_0_2px,#DCD6F7_2px_3px)]" />

        <div className="relative h-[38rem] perspective-[2200px] sm:h-[32rem]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={`${grade.level}-${page}`}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 origin-left transform-3d"
            >
              <div className={`${paper} py-6 pl-14 pr-5 sm:pr-6 md:pl-16`}>
                {content}
                <PageNumber n={page + 1} total={pageCount} />
                {/* Góc trang gấp: bấm để lật sang trang sau */}
                {!isLast && (
                  <button
                    type="button"
                    onClick={() => onGoTo(page + 1)}
                    aria-label="Lật sang trang sau"
                    className="absolute -bottom-px -right-px size-12 rounded-tl-xl bg-[linear-gradient(135deg,#E4DFFA_50%,transparent_50%)] shadow-[-3px_-3px_6px_-2px_rgb(42_22_115/0.25)] transition-[width,height] duration-200 hover:size-16"
                  />
                )}
              </div>
              {/* Mặt sau của tờ giấy, thấy được trong lúc lật */}
              <div aria-hidden className={`${paper} rotate-y-180`} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Điều hướng trang */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <button
          type="button"
          onClick={() => onGoTo(page - 1)}
          disabled={page === 0}
          className="whitespace-nowrap rounded-2xl border-2 border-grid bg-white px-4 py-3 font-display sm:px-5 text-lg font-bold text-ink shadow-[0_5px_0_0_var(--color-grid)] transition-[translate,box-shadow,border-color] duration-100 hover:border-ink active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:hover:border-grid disabled:active:translate-y-0"
        >
          Trang trước
        </button>
        <div className="order-first flex w-full justify-center gap-1.5 sm:order-none sm:w-auto" aria-label="Chọn trang">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onGoTo(i)}
              aria-label={`Trang ${i + 1}`}
              aria-current={i === page ? 'page' : undefined}
              className="group grid h-10 place-items-center px-0.5"
            >
              <span className={`block h-3 rounded-full transition-[width,background-color] duration-200 ${i === page ? 'w-8 bg-ink' : 'w-3 bg-grid group-hover:bg-ink/40'}`} />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onGoTo(page + 1)}
          disabled={isLast}
          className="whitespace-nowrap rounded-2xl bg-ink px-4 py-3 font-display sm:px-5 text-lg font-bold text-white shadow-[0_5px_0_0_var(--color-ink-deep)] transition-[translate,box-shadow] duration-100 hover:bg-[#5A38CC] active:translate-y-1 active:shadow-none disabled:opacity-40 disabled:active:translate-y-0"
        >
          Trang sau
        </button>
      </div>
    </div>
  )
}
