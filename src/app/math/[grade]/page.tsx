import Link from 'next/link'
import { notFound } from 'next/navigation'
import AccountNav from '@/components/layout/AccountNav'
import SetupNotice from '@/components/layout/SetupNotice'
import SiteHeader from '@/components/layout/SiteHeader'
import TopicMark from '@/components/math/TopicMark'
import { LockIcon, PenTick } from '@/components/ui/Icons'
import NotebookPage from '@/components/ui/NotebookPage'
import PaperStack from '@/components/ui/PaperStack'
import ProgressRuler from '@/components/ui/ProgressRuler'
import { READY_GRADES, getGrade, getTopics } from '@/lib/content'
import { getActiveStudent, getGradeOutline, getStudentOverview, type ChapterSummary } from '@/lib/data'
import { lessonStates, sumProgress, type LessonState } from '@/lib/outline'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { GradeInfo } from '@/types/math'

interface GradePageProps {
  params: Promise<{ grade: string }>
}

type LessonStatus = { kind: 'locked' } | { kind: 'done' } | { kind: 'progress'; solved: number; total: number } | { kind: 'soon' } | { kind: 'open'; total: number }

function Status({ status }: { status: LessonStatus }) {
  switch (status.kind) {
    case 'locked':
      return (
        <span className="flex shrink-0 items-center gap-1 text-base text-pencil">
          <LockIcon className="size-5" /> Chưa mở
        </span>
      )
    case 'done':
      return (
        <span className="flex shrink-0 items-center gap-1 font-display text-lg font-bold text-pen">
          <PenTick className="size-6" /> Xong
        </span>
      )
    case 'progress':
      return (
        <span className="shrink-0 font-display text-lg font-bold text-ink">
          {status.solved}/{status.total}
        </span>
      )
    case 'soon':
      return <span className="shrink-0 rounded-full bg-grid/60 px-3 py-1 text-sm font-semibold text-pencil">Sắp có</span>
    case 'open':
      return <span className="shrink-0 text-base text-pencil">{status.total} câu</span>
  }
}

interface RowProps {
  href: string | null
  mark: string
  label: string
  title: string
  description: string
  status: LessonStatus
}

/** Một dòng trong mục lục; không có href thì không bấm được (bài khóa hoặc chưa có) */
function LessonRow({ href, mark, label, title, description, status }: RowProps) {
  const content = (
    <>
      <TopicMark mark={mark} />
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-bold text-pencil">{label}</span>
        <span className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold leading-tight text-ink-deep">{title}</span>
          <span aria-hidden className="mb-1.5 hidden flex-1 border-b-2 border-dotted border-ink/25 sm:block" />
        </span>
        <span className="block text-base text-pencil">{description}</span>
      </span>
      <Status status={status} />
    </>
  )
  return (
    <li className="border-b-2 border-grid/70 last:border-b-0">
      {href ? (
        <Link
          href={href}
          className="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-4 transition-[background-color,translate] duration-200 hover:translate-x-1 hover:bg-[#F3F0FF] [&>*:first-child]:transition-transform hover:[&>*:first-child]:-rotate-6"
        >
          {content}
        </Link>
      ) : (
        <div aria-disabled className="flex items-center gap-4 py-4 opacity-60">
          {content}
        </div>
      )}
    </li>
  )
}

function Cover({ info, solved, total, note }: { info: GradeInfo; solved: number | null; total: number; note: string }) {
  return (
    <div className={`relative overflow-hidden ${info.cover} ${info.coverText}`}>
      <span aria-hidden className="bg-linen absolute inset-0" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-4 bg-[linear-gradient(to_top,rgb(0_0_0/0.22),transparent)]" />
      <div className="relative mx-auto flex max-w-4xl flex-wrap items-end gap-6 px-4 pb-10 pt-6 md:px-8">
        <span className="font-display text-[7rem] font-extrabold leading-[0.8] [text-shadow:0_4px_0_rgb(0_0_0/0.15)]">{info.level}</span>
        <div className="min-w-64 flex-1 -rotate-1 rounded-lg border-[6px] border-double border-ink-deep/25 bg-white p-5 text-graphite shadow-[0_16px_24px_-16px_rgb(0_0_0/0.5)]">
          <h1 className="font-display text-3xl font-extrabold text-ink-deep">Vở toán lớp {info.level}</h1>
          <p className="text-lg text-pencil">{info.summary}</p>
          {solved !== null && <ProgressRuler value={solved} max={total} label={`Tiến độ lớp ${info.level}`} className="mt-4" />}
          <p className="mt-2 text-base text-pencil">{note}</p>
        </div>
      </div>
    </div>
  )
}

function statusOf(s: LessonState, hasStudent: boolean): LessonStatus {
  if (s.locked) return { kind: 'locked' }
  if (!hasStudent) return { kind: 'open', total: s.total }
  if (s.total > 0 && s.solved >= s.total) return { kind: 'done' }
  return { kind: 'progress', solved: s.solved, total: s.total }
}

/** Lớp 1: mục lục từ database, có tiến độ và khóa bài khi có bé đang học */
async function GradeOne({ info }: { info: GradeInfo }) {
  const [outline, student] = await Promise.all([getGradeOutline(1), getActiveStudent()])
  const results = student ? (await getStudentOverview(student.id)).results : null
  const states = lessonStates(outline, results)
  const { solved, total } = sumProgress(states)

  return (
    <>
      <Cover
        info={info}
        solved={results ? solved : null}
        total={total}
        note={student ? `${student.name} đã giải ${solved}/${total} câu` : `${states.length} bài, ${total} câu luyện tập`}
      />
      <main className="relative mx-auto -mt-4 w-full max-w-4xl space-y-10 px-4 pb-14 md:px-8">
        {!student && (
          <p className="relative rounded-2xl border-2 border-sun bg-white px-5 py-4 text-lg text-graphite shadow-sheet">
            Bé đang học thử, sao chưa được lưu.{' '}
            <Link href="/login?next=/math/1" className="font-semibold text-ink underline underline-offset-2">
              Bố mẹ đăng nhập
            </Link>{' '}
            để lưu tiến độ và mở bài theo thứ tự.
          </p>
        )}
        {outline.map((chapter: ChapterSummary) => (
          <PaperStack key={chapter.number} sheets={1}>
            <NotebookPage>
              <p className="font-display text-lg font-bold text-pen">Chủ đề {chapter.number}</p>
              <h2 className="font-display text-3xl font-extrabold leading-tight text-ink-deep">{chapter.title}</h2>
              <ol className="mt-4">
                {states
                  .filter(s => s.chapterNumber === chapter.number)
                  .map(s => (
                    <LessonRow
                      key={s.lesson.slug}
                      href={s.locked ? null : `/math/1/${s.lesson.slug}`}
                      mark={s.lesson.mark}
                      label={`Bài ${s.numberInChapter}`}
                      title={s.lesson.title}
                      description={s.lesson.description}
                      status={statusOf(s, results !== null)}
                    />
                  ))}
              </ol>
            </NotebookPage>
          </PaperStack>
        ))}
      </main>
    </>
  )
}

/** Lớp 2–5: chưa có bài trong database, chỉ hiện dự kiến mục lục */
function GradeSoon({ info }: { info: GradeInfo }) {
  const topics = getTopics(info.level)
  return (
    <>
      <Cover info={info} solved={null} total={0} note="Bài học của lớp này đang được soạn." />
      <main className="relative mx-auto -mt-4 w-full max-w-4xl px-4 pb-12 md:px-8">
        <PaperStack sheets={2}>
          <NotebookPage>
            <h2 className="font-display text-3xl font-extrabold text-ink-deep">Mục lục dự kiến</h2>
            <ol className="mt-4">
              {topics.map((t, i) => (
                <LessonRow key={t.id} href={null} mark={t.mark} label={`Bài ${i + 1}`} title={t.title} description={t.description} status={{ kind: 'soon' }} />
              ))}
            </ol>
          </NotebookPage>
        </PaperStack>
      </main>
    </>
  )
}

export default async function GradePage({ params }: GradePageProps) {
  const { grade } = await params
  const info = getGrade(Number(grade))
  if (!info) notFound()

  const ready = READY_GRADES.includes(info.level)
  return (
    <>
      <SiteHeader backHref="/dashboard" backLabel="Về trang học">
        <AccountNav />
      </SiteHeader>
      {!ready ? <GradeSoon info={info} /> : isSupabaseConfigured() ? <GradeOne info={info} /> : <SetupNotice />}
    </>
  )
}
