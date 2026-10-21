import Link from 'next/link'
import { notFound } from 'next/navigation'
import SiteHeader from '@/components/layout/SiteHeader'
import NotebookPage from '@/components/ui/NotebookPage'
import PaperStack from '@/components/ui/PaperStack'
import ProgressRuler from '@/components/ui/ProgressRuler'
import { LockIcon, PenTick } from '@/components/ui/Icons'
import TopicMark from '@/components/math/TopicMark'
import { getGrade, getTopics, isTopicLocked } from '@/lib/content'
import type { Topic } from '@/types/math'

interface GradePageProps {
  params: Promise<{ grade: string }>
}

function TopicStatus({ topic, locked }: { topic: Topic; locked: boolean }) {
  if (locked)
    return (
      <span className="flex items-center gap-1 text-base text-pencil">
        <LockIcon className="size-5" /> Chưa mở
      </span>
    )
  if (topic.done >= topic.total)
    return (
      <span className="flex items-center gap-1 font-display text-lg font-bold text-pen">
        <PenTick className="size-6" /> Xong
      </span>
    )
  return (
    <span className="font-display text-lg font-bold text-ink">
      {topic.done}/{topic.total}
    </span>
  )
}

export default async function GradePage({ params }: GradePageProps) {
  const { grade } = await params
  const info = getGrade(Number(grade))
  if (!info) notFound()

  const topics = getTopics(info.level)
  const done = topics.reduce((sum, t) => sum + t.done, 0)
  const total = topics.reduce((sum, t) => sum + t.total, 0)

  return (
    <>
      <SiteHeader backHref="/dashboard" backLabel="Về trang học" />

      {/* Bìa vở: vân vải, mép gáy tối, nhãn vở viền kép */}
      <div className={`relative overflow-hidden ${info.cover} ${info.coverText}`}>
        <span aria-hidden className="bg-linen absolute inset-0" />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-4 bg-[linear-gradient(to_top,rgb(0_0_0/0.22),transparent)]" />
        <div className="relative mx-auto flex max-w-4xl flex-wrap items-end gap-6 px-4 pb-10 pt-6 md:px-8">
          <span className="font-display text-[7rem] font-extrabold leading-[0.8] [text-shadow:0_4px_0_rgb(0_0_0/0.15)]">{info.level}</span>
          <div className="min-w-64 flex-1 -rotate-1 rounded-lg border-[6px] border-double border-ink-deep/25 bg-white p-5 text-graphite shadow-[0_16px_24px_-16px_rgb(0_0_0/0.5)]">
            <h1 className="font-display text-3xl font-extrabold text-ink-deep">Vở toán lớp {info.level}</h1>
            <p className="text-lg text-pencil">{info.summary}</p>
            <ProgressRuler value={done} max={total} label={`Tiến độ lớp ${info.level}`} className="mt-4" />
            <p className="mt-2 text-base text-pencil">
              Đã làm {done}/{total} câu
            </p>
          </div>
        </div>
      </div>

      <main className="relative mx-auto -mt-4 w-full max-w-4xl px-4 pb-12 md:px-8">
        <PaperStack sheets={2}>
          <NotebookPage>
            <h2 className="font-display text-3xl font-extrabold text-ink-deep">Mục lục</h2>
            <ol className="mt-4">
              {topics.map((topic, i) => {
                const locked = isTopicLocked(topics, i)
                const row = (
                  <>
                    <TopicMark mark={topic.mark} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-base font-bold text-pencil">Bài {i + 1}</span>
                      <span className="flex items-baseline gap-2">
                        <span className="font-display text-2xl font-bold leading-tight text-ink-deep">{topic.title}</span>
                        <span aria-hidden className="mb-1.5 hidden flex-1 border-b-2 border-dotted border-ink/25 sm:block" />
                      </span>
                      <span className="block text-base text-pencil">{topic.description}</span>
                    </span>
                    <TopicStatus topic={topic} locked={locked} />
                  </>
                )
  
                return (
                  <li key={topic.id} className="border-b-2 border-grid/70 last:border-b-0">
                    {locked ? (
                      <div aria-disabled className="flex items-center gap-4 py-4 opacity-60">
                        {row}
                      </div>
                    ) : (
                      <Link
                        href={`/math/${info.level}/${topic.id}`}
                        className="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-4 transition-[background-color,translate] duration-200 hover:translate-x-1 hover:bg-[#F3F0FF] [&>*:first-child]:transition-transform hover:[&>*:first-child]:-rotate-6"
                      >
                        {row}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ol>
          </NotebookPage>
        </PaperStack>
      </main>
    </>
  )
}
