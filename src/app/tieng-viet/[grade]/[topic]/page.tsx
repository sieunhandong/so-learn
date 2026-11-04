import { notFound } from 'next/navigation'
import AccountNav from '@/components/layout/AccountNav'
import SetupNotice from '@/components/layout/SetupNotice'
import SiteHeader from '@/components/layout/SiteHeader'
import LessonView from '@/components/learn/LessonView'
import { getActiveStudent, getLesson } from '@/lib/data'
import { gradeHref } from '@/lib/subjects'
import { isSupabaseConfigured } from '@/lib/supabase'

interface TopicPageProps {
  params: Promise<{ grade: string; topic: string }>
}

/** Một bài Tiếng Việt lớp 1; lớp khác, bài không có hoặc bài chưa có câu nào đều trả về 404 */
export default async function TopicPage({ params }: TopicPageProps) {
  const { grade, topic } = await params
  if (grade !== '1') notFound()
  const backHref = gradeHref('tieng-viet', 1)

  const header = (
    <SiteHeader backHref={backHref} backLabel="Về mục lục lớp 1">
      <AccountNav />
    </SiteHeader>
  )

  if (!isSupabaseConfigured()) {
    return (
      <>
        {header}
        <SetupNotice />
      </>
    )
  }

  const [lesson, student] = await Promise.all([getLesson('tieng-viet', topic), getActiveStudent()])
  if (!lesson || lesson.topic.grade !== 1 || lesson.questions.length === 0) notFound()

  return (
    <>
      {header}
      <LessonView
        subject="tieng-viet"
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
