import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AccountNav from '@/components/layout/AccountNav'
import SetupNotice from '@/components/layout/SetupNotice'
import SiteHeader from '@/components/layout/SiteHeader'
import LessonRow, { statusOf } from '@/components/learn/LessonRow'
import NotebookCover from '@/components/learn/NotebookCover'
import NotebookPage from '@/components/ui/NotebookPage'
import PaperStack from '@/components/ui/PaperStack'
import { getActiveStudent, getGradeOutline, getStudentOverview, type ChapterSummary } from '@/lib/data'
import { lessonStates, sumProgress } from '@/lib/outline'
import { SUBJECTS, lessonHref } from '@/lib/subjects'
import { isSupabaseConfigured } from '@/lib/supabase'

interface GradePageProps {
  params: Promise<{ grade: string }>
}

// Không có thì trang thừa hưởng tiêu đề "Học toán" của layout gốc
export const metadata: Metadata = {
  title: 'Vở Tiếng Việt lớp 1 – SoLearn',
  description: 'Vở Tiếng Việt lớp 1 trên SoLearn: học âm, chữ và dấu thanh, có giọng đọc hướng dẫn cho bé.',
}

/** Mục lục Tiếng Việt lớp 1: có tiến độ và khóa bài khi có bé đang học, như vở toán */
async function GradeOne() {
  const [outline, student] = await Promise.all([getGradeOutline('tieng-viet', 1), getActiveStudent()])
  const results = student ? (await getStudentOverview(student.id)).results : null
  const states = lessonStates(outline, results)
  const { solved, total } = sumProgress(states)
  const subject = SUBJECTS['tieng-viet']

  return (
    <>
      <NotebookCover
        big="1"
        title={`${subject.notebook} lớp 1`}
        summary="Học âm, chữ và dấu thanh theo sách Kết nối tri thức"
        coverClass="bg-leaf"
        textClass="text-white"
        solved={results ? solved : null}
        total={total}
        note={student ? `${student.name} đã giải ${solved}/${total} câu` : `${states.length} bài, ${total} câu luyện tập`}
      />
      <main className="relative mx-auto -mt-4 w-full max-w-4xl space-y-10 px-4 pb-14 md:px-8">
        {!student && (
          <p className="relative rounded-2xl border-2 border-sun bg-white px-5 py-4 text-lg text-graphite shadow-sheet">
            Bé đang học thử, sao chưa được lưu.{' '}
            <Link href="/login?next=/tieng-viet/1" className="font-semibold text-ink underline underline-offset-2">
              Bố mẹ đăng nhập
            </Link>{' '}
            để lưu tiến độ và mở bài theo thứ tự.
          </p>
        )}
        {outline.length === 0 && (
          <PaperStack sheets={1}>
            <NotebookPage>
              <p className="font-display text-2xl font-bold text-ink-deep">Bài học đang được soạn</p>
            </NotebookPage>
          </PaperStack>
        )}
        {outline.map((chapter: ChapterSummary) => (
          <PaperStack key={chapter.number} sheets={1}>
            <NotebookPage>
              <p className="font-display text-lg font-bold text-pen">
                {subject.chapterLabel} {chapter.number}
              </p>
              <h2 className="font-display text-3xl font-extrabold leading-tight text-ink-deep">{chapter.title}</h2>
              <ol className="mt-4">
                {states
                  .filter(s => s.chapterNumber === chapter.number)
                  .map(s => (
                    <LessonRow
                      key={s.lesson.slug}
                      href={s.locked ? null : lessonHref('tieng-viet', 1, s.lesson.slug)}
                      mark={s.lesson.mark}
                      label={`Bài ${s.lesson.position}`}
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

/** Chỉ có lớp 1; lớp khác trả về 404. URL luôn mở được, không phụ thuộc công tắc TIENG_VIET_ENABLED. */
export default async function GradePage({ params }: GradePageProps) {
  const { grade } = await params
  if (grade !== '1') notFound()

  return (
    <>
      <SiteHeader backHref="/dashboard" backLabel="Về trang học">
        <AccountNav />
      </SiteHeader>
      {isSupabaseConfigured() ? <GradeOne /> : <SetupNotice />}
    </>
  )
}
