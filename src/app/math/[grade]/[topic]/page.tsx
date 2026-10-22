import { notFound } from 'next/navigation'
import AccountNav from '@/components/layout/AccountNav'
import SetupNotice from '@/components/layout/SetupNotice'
import SiteHeader from '@/components/layout/SiteHeader'
import LessonView from '@/components/math/LessonView'
import ButtonLink from '@/components/ui/ButtonLink'
import NotebookPage from '@/components/ui/NotebookPage'
import { READY_GRADES, getGrade } from '@/lib/content'
import { getActiveStudent, getLesson } from '@/lib/data'
import { isSupabaseConfigured } from '@/lib/supabase'

interface TopicPageProps {
  params: Promise<{ grade: string; topic: string }>
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { grade, topic } = await params
  const info = getGrade(Number(grade))
  if (!info) notFound()
  const backHref = `/math/${info.level}`

  const header = (
    <SiteHeader backHref={backHref} backLabel={`Về mục lục lớp ${info.level}`}>
      <AccountNav />
    </SiteHeader>
  )

  if (!READY_GRADES.includes(info.level)) {
    return (
      <>
        {header}
        <main className="mx-auto w-full max-w-2xl px-4 py-12">
          <NotebookPage>
            <h1 className="font-display text-3xl font-extrabold text-ink-deep">Bài này đang được soạn</h1>
            <p className="mt-3 text-lg text-graphite">Toán lớp {info.level} sẽ sớm có bài học. Trong lúc chờ, bé có thể ôn toán lớp 1.</p>
            <ButtonLink href="/math/1" className="mt-6">
              Mở vở lớp 1
            </ButtonLink>
          </NotebookPage>
        </main>
      </>
    )
  }

  if (!isSupabaseConfigured()) {
    return (
      <>
        {header}
        <SetupNotice />
      </>
    )
  }

  const [lesson, student] = await Promise.all([getLesson(topic), getActiveStudent()])
  if (!lesson || lesson.topic.grade !== info.level || lesson.questions.length === 0) notFound()

  return (
    <>
      {header}
      <LessonView
        lesson={{
          title: lesson.topic.title,
          mark: lesson.topic.mark,
          description: lesson.topic.description,
          chapterNumber: lesson.topic.chapter_number,
          chapterTitle: lesson.topic.chapter_title,
          intro: lesson.topic.intro,
        }}
        questions={lesson.questions}
        backHref={backHref}
        studentName={student?.name ?? null}
      />
    </>
  )
}
