import Link from 'next/link'
import { redirect } from 'next/navigation'
import AccountNav from '@/components/layout/AccountNav'
import SetupNotice from '@/components/layout/SetupNotice'
import SiteHeader from '@/components/layout/SiteHeader'
import TopicMark from '@/components/learn/TopicMark'
import BadgeSticker from '@/components/ui/BadgeSticker'
import ButtonLink from '@/components/ui/ButtonLink'
import { PenTick, StarIcon } from '@/components/ui/Icons'
import NotebookPage from '@/components/ui/NotebookPage'
import PaperStack from '@/components/ui/PaperStack'
import ProgressRuler from '@/components/ui/ProgressRuler'
import { getActiveStudent, getGradeOutline, getStudentOverview, type ChapterSummary } from '@/lib/data'
import { isTiengVietEnabled } from '@/lib/features'
import { lessonStates, nextLesson, sumProgress, type LessonState } from '@/lib/outline'
import { DAILY_GOAL } from '@/lib/progress'
import { BADGES } from '@/lib/rewards'
import { SUBJECTS, gradeHref, lessonHref } from '@/lib/subjects'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { Subject } from '@/types/lesson'

interface NextLessonCardProps {
  subject: Subject
  state: LessonState
}

/** Thẻ "bài tiếp theo" của một môn */
function NextLessonCard({ subject, state }: NextLessonCardProps) {
  const { lesson } = state
  return (
    <PaperStack sheets={2} className="mt-8">
      <NotebookPage>
        <p className="text-lg text-pencil">
          {subject === 'math' ? (
            <>
              Chủ đề {state.chapterNumber}, bài {state.numberInChapter}
            </>
          ) : (
            `Tiếng Việt · Bài ${lesson.position}`
          )}
        </p>
        <h2 className="mt-2 flex items-center gap-3 font-display text-3xl font-extrabold leading-tight text-ink-deep md:text-4xl">
          <TopicMark mark={lesson.mark} size="lg" />
          {lesson.title}
        </h2>
        <p className="mt-2 text-lg text-pencil">
          Đã giải {state.solved}/{state.total} câu
        </p>
        <ProgressRuler value={state.solved} max={state.total} label={`Tiến độ ${lesson.title}`} className="mt-3" />
        <ButtonLink href={lessonHref(subject, 1, lesson.slug)} className="mt-6">
          {state.solved === 0 ? 'Bắt đầu bài này' : 'Học tiếp bài này'}
        </ButtonLink>
      </NotebookPage>
    </PaperStack>
  )
}

const DONE_COPY: Record<Subject, { title: string; open: string }> = {
  math: { title: 'Bé đã giải hết toán lớp 1!', open: 'Mở vở lớp 1' },
  'tieng-viet': { title: 'Bé đã giải hết Tiếng Việt lớp 1!', open: 'Mở vở Tiếng Việt lớp 1' },
}

/** Lời chúc khi bé đã giải hết một môn */
function AllDoneCard({ subject }: { subject: Subject }) {
  return (
    <NotebookPage className="mt-8">
      <h2 className="font-display text-3xl font-extrabold text-ink-deep">{DONE_COPY[subject].title}</h2>
      <p className="mt-2 text-lg text-pencil">Bé có thể mở lại bất kỳ bài nào để ôn tập.</p>
      <ButtonLink href={gradeHref(subject, 1)} className="mt-6">
        {DONE_COPY[subject].open}
      </ButtonLink>
    </NotebookPage>
  )
}

interface NotebookSectionProps {
  subject: Subject
  outline: ChapterSummary[]
  states: LessonState[]
}

/** Khu "Vở ... lớp 1": lưới các chủ đề (phần) kèm thanh tiến độ */
function NotebookSection({ subject, outline, states }: NotebookSectionProps) {
  const { notebook, chapterLabel } = SUBJECTS[subject]
  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-3xl font-extrabold text-ink-deep">{`${notebook} lớp 1`}</h2>
        <Link href={gradeHref(subject, 1)} className="font-display text-lg font-bold text-ink underline underline-offset-4">
          Xem mục lục đầy đủ
        </Link>
      </div>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {outline.map(chapter => {
          const { solved, total } = sumProgress(states.filter(s => s.chapterNumber === chapter.number))
          return (
            <li key={chapter.number} className="rounded-2xl border-2 border-grid bg-white p-5">
              <p className="flex items-center justify-between font-display text-base font-bold text-pencil">
                {`${chapterLabel} `}
                {chapter.number}
                {solved === total && total > 0 && <PenTick className="size-6" />}
              </p>
              <p className="mt-1 font-display text-xl font-bold leading-tight text-ink-deep">{chapter.title}</p>
              <ProgressRuler value={solved} max={total} label={`Tiến độ ${chapterLabel.toLowerCase()} ${chapter.number}`} className="mt-3" />
              <p className="mt-2 text-base text-pencil">
                {solved}/{total} câu
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <SiteHeader backHref="/" backLabel="Về trang chủ" />
        <SetupNotice />
      </>
    )
  }

  const student = await getActiveStudent()
  if (!student) redirect('/parent')

  // Chỉ lấy mục lục Tiếng Việt khi công tắc bật
  const [outline, overview, tvOutline] = await Promise.all([
    getGradeOutline('math', 1),
    getStudentOverview(student.id),
    isTiengVietEnabled() ? getGradeOutline('tieng-viet', 1) : null,
  ])
  const { stats, results, earnedBadges } = overview
  const states = lessonStates(outline, results)
  const next = nextLesson(states)
  const allDone = states.length > 0 && !next
  const tvStates = tvOutline ? lessonStates(tvOutline, results) : []
  const tvNext = nextLesson(tvStates)
  const tvAllDone = tvStates.length > 0 && !tvNext

  return (
    <>
      <SiteHeader>
        <AccountNav />
      </SiteHeader>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        {student.grade !== 1 && (
          <p className="mb-6 rounded-2xl border-2 border-sun bg-sun/15 px-5 py-4 text-lg text-graphite">
            Bài học lớp {student.grade} đang được soạn. Trong lúc chờ, {student.name} có thể ôn lại toán lớp 1.
          </p>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <section>
            <h1 className="font-display text-5xl font-extrabold leading-tight text-ink-deep">Chào {student.name}, học tiếp nhé!</h1>
            <p className="mt-2 text-xl text-pencil">
              Hôm nay bé đã giải đúng {stats.solvedToday} trên {DAILY_GOAL} câu mục tiêu.
            </p>
            <ProgressRuler value={stats.solvedToday} max={DAILY_GOAL} label="Mục tiêu hôm nay" className="mt-4 h-5" />

            {next && <NextLessonCard subject="math" state={next} />}
            {allDone && <AllDoneCard subject="math" />}
            {tvNext && <NextLessonCard subject="tieng-viet" state={tvNext} />}
            {tvAllDone && <AllDoneCard subject="tieng-viet" />}
          </section>

          <aside className="space-y-8">
            {/* Hai tờ giấy nhớ dán băng keo */}
            <div className="flex gap-5 pt-3">
              <p className="relative flex-1 -rotate-2 rounded-sm bg-[#FFE3D3] p-4 pt-5 shadow-[0_14px_20px_-14px_rgb(42_22_115/0.55)]">
                <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-3 bg-white/70 shadow-sm" />
                <span className="block font-display text-5xl font-extrabold leading-none text-[#B4400F]">{stats.streakDays}</span>
                <span className="mt-1 block text-lg text-graphite">ngày học liền</span>
              </p>
              <p className="relative flex-1 rotate-1 rounded-sm bg-[#FFF0B8] p-4 pt-5 shadow-[0_14px_20px_-14px_rgb(42_22_115/0.55)]">
                <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-2 bg-white/70 shadow-sm" />
                <span className="flex items-center gap-2 font-display text-5xl font-extrabold leading-none text-ink-deep">
                  {stats.stars}
                  <StarIcon className="size-9" />
                </span>
                <span className="mt-1 block text-lg text-graphite">sao đã nhận</span>
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-ink-deep">Nhãn dán của {student.name}</h2>
              <ul className="mt-4 flex flex-wrap gap-4">
                {BADGES.map((b, i) => (
                  <li key={b.type}>
                    <BadgeSticker badge={{ mark: b.mark, label: b.label, earned: earnedBadges.has(b.type) }} tilt={i % 2 === 0 ? 'left' : 'right'} />
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <NotebookSection subject="math" outline={outline} states={states} />
        {tvOutline && tvStates.length > 0 && <NotebookSection subject="tieng-viet" outline={tvOutline} states={tvStates} />}
      </main>
    </>
  )
}
