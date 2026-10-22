import Link from 'next/link'
import { redirect } from 'next/navigation'
import AccountNav from '@/components/layout/AccountNav'
import SetupNotice from '@/components/layout/SetupNotice'
import SiteHeader from '@/components/layout/SiteHeader'
import TopicMark from '@/components/math/TopicMark'
import BadgeSticker from '@/components/ui/BadgeSticker'
import ButtonLink from '@/components/ui/ButtonLink'
import { PenTick, StarIcon } from '@/components/ui/Icons'
import NotebookPage from '@/components/ui/NotebookPage'
import PaperStack from '@/components/ui/PaperStack'
import ProgressRuler from '@/components/ui/ProgressRuler'
import { getActiveStudent, getGradeOutline, getStudentOverview } from '@/lib/data'
import { lessonStates, nextLesson, sumProgress } from '@/lib/outline'
import { DAILY_GOAL } from '@/lib/progress'
import { BADGES } from '@/lib/rewards'
import { isSupabaseConfigured } from '@/lib/supabase'

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

  const [outline, overview] = await Promise.all([getGradeOutline(1), getStudentOverview(student.id)])
  const { stats, results, earnedBadges } = overview
  const states = lessonStates(outline, results)
  const next = nextLesson(states)
  const allDone = states.length > 0 && !next

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

            {next && (
              <PaperStack sheets={2} className="mt-8">
                <NotebookPage>
                  <p className="text-lg text-pencil">
                    Chủ đề {next.chapterNumber}, bài {next.numberInChapter}
                  </p>
                  <h2 className="mt-2 flex items-center gap-3 font-display text-3xl font-extrabold leading-tight text-ink-deep md:text-4xl">
                    <TopicMark mark={next.lesson.mark} size="lg" />
                    {next.lesson.title}
                  </h2>
                  <p className="mt-2 text-lg text-pencil">
                    Đã giải {next.solved}/{next.total} câu
                  </p>
                  <ProgressRuler value={next.solved} max={next.total} label={`Tiến độ ${next.lesson.title}`} className="mt-3" />
                  <ButtonLink href={`/math/1/${next.lesson.slug}`} className="mt-6">
                    {next.solved === 0 ? 'Bắt đầu bài này' : 'Học tiếp bài này'}
                  </ButtonLink>
                </NotebookPage>
              </PaperStack>
            )}
            {allDone && (
              <NotebookPage className="mt-8">
                <h2 className="font-display text-3xl font-extrabold text-ink-deep">Bé đã giải hết toán lớp 1!</h2>
                <p className="mt-2 text-lg text-pencil">Bé có thể mở lại bất kỳ bài nào để ôn tập.</p>
                <ButtonLink href="/math/1" className="mt-6">
                  Mở vở lớp 1
                </ButtonLink>
              </NotebookPage>
            )}
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

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-3xl font-extrabold text-ink-deep">Vở toán lớp 1</h2>
            <Link href="/math/1" className="font-display text-lg font-bold text-ink underline underline-offset-4">
              Xem mục lục đầy đủ
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outline.map(chapter => {
              const { solved, total } = sumProgress(states.filter(s => s.chapterNumber === chapter.number))
              return (
                <li key={chapter.number} className="rounded-2xl border-2 border-grid bg-white p-5">
                  <p className="flex items-center justify-between font-display text-base font-bold text-pencil">
                    Chủ đề {chapter.number}
                    {solved === total && total > 0 && <PenTick className="size-6" />}
                  </p>
                  <p className="mt-1 font-display text-xl font-bold leading-tight text-ink-deep">{chapter.title}</p>
                  <ProgressRuler value={solved} max={total} label={`Tiến độ chủ đề ${chapter.number}`} className="mt-3" />
                  <p className="mt-2 text-base text-pencil">
                    {solved}/{total} câu
                  </p>
                </li>
              )
            })}
          </ul>
        </section>
      </main>
    </>
  )
}
