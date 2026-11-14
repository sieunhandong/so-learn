import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
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

const FALLBACK_TITLE = 'Vở Tiếng Việt lớp 1 – SoLearn'

// Trang và generateMetadata cùng cần bài học: cache để một lượt tải chỉ hỏi Supabase một lần
const loadLesson = cache((topic: string) => getLesson('tieng-viet', topic))

/** Tiêu đề tab theo tên bài; không tìm được bài hoặc chưa cấu hình Supabase thì dùng tiêu đề của vở */
export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { grade, topic } = await params
  if (grade !== '1' || !isSupabaseConfigured()) return { title: FALLBACK_TITLE }
  try {
    const lesson = await loadLesson(topic)
    if (!lesson || lesson.topic.grade !== 1) return { title: FALLBACK_TITLE }
    return { title: `${lesson.topic.title} – Tiếng Việt lớp 1 – SoLearn` }
  } catch {
    // Lỗi truy vấn do trang báo khi tải bài; tiêu đề chỉ cần có giá trị dự phòng
    return { title: FALLBACK_TITLE }
  }
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

  const [lesson, student] = await Promise.all([loadLesson(topic), getActiveStudent()])
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
