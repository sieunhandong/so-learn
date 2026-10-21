import { notFound } from 'next/navigation'
import SiteHeader from '@/components/layout/SiteHeader'
import QuizRunner from '@/components/math/QuizRunner'
import { getGrade, getQuestions, getTopic } from '@/lib/content'

interface TopicPageProps {
  params: Promise<{ grade: string; topic: string }>
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { grade, topic } = await params
  const info = getGrade(Number(grade))
  const current = info && getTopic(info.level, topic)
  if (!info || !current) notFound()

  const backHref = `/math/${info.level}`

  return (
    <>
      <SiteHeader backHref={backHref} backLabel={`Về mục lục lớp ${info.level}`} />
      <QuizRunner questions={getQuestions()} topicTitle={current.title} backHref={backHref} />
    </>
  )
}
