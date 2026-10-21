import Link from 'next/link'
import SiteHeader from '@/components/layout/SiteHeader'
import GradeShelf from '@/components/math/GradeShelf'
import ButtonLink from '@/components/ui/ButtonLink'
import NotebookPage from '@/components/ui/NotebookPage'
import ProgressRuler from '@/components/ui/ProgressRuler'
import PaperStack from '@/components/ui/PaperStack'
import StarCount from '@/components/ui/StarCount'
import BadgeSticker from '@/components/ui/BadgeSticker'
import { StarIcon } from '@/components/ui/Icons'
import TopicMark from '@/components/math/TopicMark'
import { badges, getTopic, getTopics, grades, studentSummary } from '@/lib/content'

export default function DashboardPage() {
  const s = studentSummary
  const continueTopics = s.continueWith.flatMap(item => {
    const topic = getTopic(item.grade, item.topicId)
    if (!topic) return []
    const lessonNumber = getTopics(item.grade).findIndex(t => t.id === topic.id) + 1
    return [{ ...item, topic, lessonNumber }]
  })
  const [current, ...others] = continueTopics

  return (
    <>
      <SiteHeader>
        <StarCount value={s.stars} />
        <span aria-label={`Hồ sơ của ${s.name}`} className="grid size-12 place-items-center rounded-full bg-sun font-display text-xl font-extrabold text-ink-deep">
          {s.name.charAt(0)}
        </span>
      </SiteHeader>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <section>
            <h1 className="font-display text-5xl font-extrabold leading-tight text-ink-deep">Chào {s.name}, học tiếp nhé!</h1>
            <p className="mt-2 text-xl text-pencil">
              Hôm nay bé đã làm {s.todayDone} trên {s.todayGoal} bài.
            </p>
            <ProgressRuler value={s.todayDone} max={s.todayGoal} label="Mục tiêu hôm nay" className="mt-4 h-5" />

            {current && (
              <PaperStack sheets={2} className="mt-8">
                <NotebookPage>
                  <p className="text-lg text-pencil">
                    Lớp {current.grade}, bài {current.lessonNumber}
                  </p>
                  <h2 className="mt-2 flex items-center gap-3 font-display text-4xl font-extrabold leading-tight text-ink-deep">
                    <TopicMark mark={current.topic.mark} size="lg" />
                    {current.topic.title}
                  </h2>
                  <p className="mt-2 text-lg text-pencil">
                    Đã làm {current.topic.done}/{current.topic.total} câu
                  </p>
                  <ProgressRuler value={current.topic.done} max={current.topic.total} label={`Tiến độ ${current.topic.title}`} className="mt-3" />
                  <ButtonLink href={`/math/${current.grade}/${current.topic.id}`} className="mt-6">
                    Học tiếp bài này
                  </ButtonLink>
                </NotebookPage>
              </PaperStack>
            )}

            {others.length > 0 && (
              <ul className="mt-10 divide-y-2 divide-grid overflow-hidden rounded-2xl border-2 border-grid bg-white">
                {others.map(o => (
                  <li key={o.topic.id}>
                    <Link
                      href={`/math/${o.grade}/${o.topic.id}`}
                      className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#F3F0FF] [&>*]:transition-transform [&>*]:duration-200 hover:[&>*:first-child]:-rotate-6"
                    >
                      <TopicMark mark={o.topic.mark} />
                      <span className="flex-1">
                        <span className="block font-display text-xl font-bold text-ink-deep">{o.topic.title}</span>
                        <span className="block text-base text-pencil">
                          Lớp {o.grade}, đã làm {o.topic.done}/{o.topic.total} câu
                        </span>
                      </span>
                      <span className="font-display text-lg font-bold text-ink">Mở bài</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <aside className="space-y-8">
            {/* Hai tờ giấy nhớ dán băng keo */}
            <div className="flex gap-5 pt-3">
              <p className="relative flex-1 -rotate-2 rounded-sm bg-[#FFE3D3] p-4 pt-5 shadow-[0_14px_20px_-14px_rgb(42_22_115/0.55)]">
                <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 rotate-3 bg-white/70 shadow-sm" />
                <span className="block font-display text-5xl font-extrabold leading-none text-[#B4400F]">{s.streakDays}</span>
                <span className="mt-1 block text-lg text-graphite">ngày học liền</span>
              </p>
              <p className="relative flex-1 rotate-1 rounded-sm bg-[#FFF0B8] p-4 pt-5 shadow-[0_14px_20px_-14px_rgb(42_22_115/0.55)]">
                <span aria-hidden className="absolute -top-3 left-1/2 h-6 w-16 -translate-x-1/2 -rotate-2 bg-white/70 shadow-sm" />
                <span className="flex items-center gap-2 font-display text-5xl font-extrabold leading-none text-ink-deep">
                  {s.stars}
                  <StarIcon className="size-9" />
                </span>
                <span className="mt-1 block text-lg text-graphite">sao đã nhận</span>
              </p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-ink-deep">Nhãn dán của bé</h2>
              <ul className="mt-4 flex flex-wrap gap-4">
                {badges.map((b, i) => (
                  <li key={b.label}>
                    <BadgeSticker badge={b} tilt={i % 2 === 0 ? 'left' : 'right'} />
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="mb-6 font-display text-3xl font-extrabold text-ink-deep">Đổi lớp</h2>
          <GradeShelf grades={grades} />
        </section>
      </main>
    </>
  )
}
