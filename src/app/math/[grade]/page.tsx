import Link from 'next/link'
import { notFound } from 'next/navigation'
import AccountNav from '@/components/layout/AccountNav'
import SetupNotice from '@/components/layout/SetupNotice'
import SiteHeader from '@/components/layout/SiteHeader'
import LessonRow, { statusOf } from '@/components/learn/LessonRow'
import NotebookCover from '@/components/learn/NotebookCover'
import NotebookPage from '@/components/ui/NotebookPage'
import PaperStack from '@/components/ui/PaperStack'
import { READY_GRADES, getGrade, getTopics } from '@/lib/content'
import { getActiveStudent, getGradeOutline, getStudentOverview, type ChapterSummary } from '@/lib/data'
import { lessonStates, sumProgress } from '@/lib/outline'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { GradeInfo } from '@/types/math'

interface GradePageProps {
  params: Promise<{ grade: string }>
}

/** Bìa vở toán: đổi thông tin lớp sang các thuộc tính của bìa dùng chung */
function MathCover({ info, solved, total, note }: { info: GradeInfo; solved: number | null; total: number; note: string }) {
  return (
    <NotebookCover
      big={String(info.level)}
      title={`Vở toán lớp ${info.level}`}
      summary={info.summary}
      coverClass={info.cover}
      textClass={info.coverText}
      solved={solved}
      total={total}
      note={note}
    />
  )
}

/** Lớp 1: mục lục từ database, có tiến độ và khóa bài khi có bé đang học */
async function GradeOne({ info }: { info: GradeInfo }) {
  const [outline, student] = await Promise.all([getGradeOutline('math', 1), getActiveStudent()])
  const results = student ? (await getStudentOverview(student.id)).results : null
  const states = lessonStates(outline, results)
  const { solved, total } = sumProgress(states)

  return (
    <>
      <MathCover
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
      <MathCover info={info} solved={null} total={0} note="Bài học của lớp này đang được soạn." />
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
