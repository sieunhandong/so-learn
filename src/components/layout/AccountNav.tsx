import Link from 'next/link'
import ButtonLink from '@/components/ui/ButtonLink'
import { avatarClass } from '@/lib/avatars'
import { getActiveStudent, getViewer } from '@/lib/data'
import { isSupabaseConfigured } from '@/lib/supabase'
import type { Student } from '@/types/database'

/** Góc phải header: đăng nhập/đăng ký, hoặc hồ sơ bé đang học */
export default async function AccountNav() {
  if (!isSupabaseConfigured()) return <ButtonLink href="/math/1">Vào học</ButtonLink>

  const viewer = await getViewer()
  if (!viewer) {
    return (
      <>
        <Link href="/login" className="rounded-xl px-3 py-2 font-display text-lg font-bold text-ink hover:bg-[#F3F0FF]">
          Đăng nhập
        </Link>
        <ButtonLink href="/register" className="hidden sm:inline-flex">
          Đăng ký
        </ButtonLink>
      </>
    )
  }

  let student: Student | null = null
  try {
    student = await getActiveStudent()
  } catch {
    // Chưa chạy migration hoặc mất kết nối: vẫn hiện header bình thường
  }

  return (
    <>
      <Link
        href="/parent"
        aria-label={student ? `Hồ sơ của ${student.name}, bấm để đổi` : 'Trang phụ huynh'}
        className="flex items-center gap-2 rounded-full border-2 border-grid bg-white py-1 pl-1 pr-1 font-display text-lg font-bold text-ink-deep transition-colors hover:border-ink sm:pr-4"
      >
        <span className={`grid size-9 place-items-center rounded-full ${student ? avatarClass(student.avatar) : 'bg-grid text-ink'}`}>
          {student ? student.name.charAt(0).toUpperCase() : 'P'}
        </span>
        <span className="hidden sm:inline">{student ? student.name : 'Phụ huynh'}</span>
      </Link>
      <ButtonLink href="/dashboard">Vào học</ButtonLink>
    </>
  )
}
