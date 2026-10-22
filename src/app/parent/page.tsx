import { redirect } from 'next/navigation'
import { signOut } from '@/app/(auth)/actions'
import SetupNotice from '@/components/layout/SetupNotice'
import SiteHeader from '@/components/layout/SiteHeader'
import StudentForm from '@/components/parent/StudentForm'
import NotebookPage from '@/components/ui/NotebookPage'
import { StarIcon } from '@/components/ui/Icons'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { avatarClass } from '@/lib/avatars'
import { getActiveStudent, getStudentOverview, getStudents, getViewer } from '@/lib/data'
import { BADGES } from '@/lib/rewards'
import { isSupabaseConfigured } from '@/lib/supabase'
import { selectStudent } from './actions'

export default async function ParentPage() {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <SiteHeader backHref="/" backLabel="Về trang chủ" />
        <SetupNotice />
      </>
    )
  }

  const viewer = await getViewer()
  if (!viewer) redirect('/login?next=/parent')

  const [students, active] = await Promise.all([getStudents(), getActiveStudent()])
  const overviews = await Promise.all(students.map(s => getStudentOverview(s.id)))

  return (
    <>
      <SiteHeader backHref="/" backLabel="Về trang chủ">
        <form action={signOut}>
          <button type="submit" className="rounded-xl px-3 py-2 font-display text-lg font-bold text-ink hover:bg-[#F3F0FF]">
            Đăng xuất
          </button>
        </form>
      </SiteHeader>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8">
        <h1 className="font-display text-4xl font-extrabold text-ink-deep md:text-5xl">Trang phụ huynh</h1>
        <p className="mt-2 text-lg text-pencil">Đăng nhập bằng {viewer.email}</p>

        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.4fr_1fr]">
          <section>
            <h2 className="font-display text-2xl font-extrabold text-ink-deep">Hồ sơ các bé</h2>
            {students.length === 0 ? (
              <p className="mt-4 rounded-2xl border-2 border-dashed border-grid bg-white px-6 py-8 text-lg text-pencil">
                Chưa có hồ sơ nào. Tạo hồ sơ cho bé ở khung bên cạnh để bắt đầu học.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {students.map((s, i) => {
                  const { stats, earnedBadges } = overviews[i]
                  const isActive = active?.id === s.id
                  return (
                    <li key={s.id} className={`rounded-2xl border-2 bg-white p-5 ${isActive ? 'border-ink shadow-[0_8px_0_-2px_var(--color-grid)]' : 'border-grid'}`}>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className={`grid size-14 place-items-center rounded-full font-display text-2xl font-extrabold ${avatarClass(s.avatar)}`}>
                          {s.name.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-2xl font-extrabold text-ink-deep">{s.name}</p>
                          <p className="text-base text-pencil">
                            Lớp {s.grade}
                            {isActive && ', đang học trên máy này'}
                          </p>
                        </div>
                        <form action={selectStudent}>
                          <input type="hidden" name="studentId" value={s.id} />
                          <button type="submit" className={buttonClasses(isActive ? 'ink' : 'paper')}>
                            Học với bé này
                          </button>
                        </form>
                      </div>
                      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl bg-sun/25 p-3">
                          <dt className="text-sm text-graphite">Sao</dt>
                          <dd className="flex items-center gap-1 font-display text-2xl font-extrabold text-ink-deep">
                            {stats.stars} <StarIcon className="size-5" />
                          </dd>
                        </div>
                        <div className="rounded-xl bg-[#EAF7F0] p-3">
                          <dt className="text-sm text-graphite">Câu đã giải</dt>
                          <dd className="font-display text-2xl font-extrabold text-ink-deep">{stats.solvedCount}</dd>
                        </div>
                        <div className="rounded-xl bg-[#FFE9DC] p-3">
                          <dt className="text-sm text-graphite">Ngày học liền</dt>
                          <dd className="font-display text-2xl font-extrabold text-ink-deep">{stats.streakDays}</dd>
                        </div>
                        <div className="rounded-xl bg-[#F1EEFC] p-3">
                          <dt className="text-sm text-graphite">Huy hiệu</dt>
                          <dd className="font-display text-2xl font-extrabold text-ink-deep">
                            {earnedBadges.size}/{BADGES.length}
                          </dd>
                        </div>
                      </dl>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <NotebookPage>
            <h2 className="font-display text-2xl font-extrabold text-ink-deep">Thêm hồ sơ cho bé</h2>
            <p className="mb-5 mt-1 text-base text-pencil">Hiện đã có bài học cho lớp 1. Các lớp khác đang được soạn.</p>
            <StudentForm />
          </NotebookPage>
        </div>
      </main>
    </>
  )
}
