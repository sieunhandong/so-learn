'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAvatarId } from '@/lib/avatars'
import { ACTIVE_STUDENT_COOKIE, getStudents, getViewer } from '@/lib/data'
import { createSupabase } from '@/lib/supabase'

export interface StudentFormState {
  error?: string
  /** Tăng sau mỗi lần thêm thành công, để form tự xóa ô nhập */
  savedCount?: number
}

const ONE_YEAR = 60 * 60 * 24 * 365

async function rememberStudent(id: string) {
  ;(await cookies()).set(ACTIVE_STUDENT_COOKIE, id, { httpOnly: true, sameSite: 'lax', path: '/', maxAge: ONE_YEAR })
}

export async function addStudent(prev: StudentFormState, formData: FormData): Promise<StudentFormState> {
  const viewer = await getViewer()
  if (!viewer) redirect('/login?next=/parent')

  const name = String(formData.get('name') ?? '').trim()
  const grade = Number(formData.get('grade'))
  const avatar = String(formData.get('avatar') ?? 'sun')
  if (name.length < 1 || name.length > 40) return { ...prev, error: 'Tên của bé cần từ 1 đến 40 ký tự.' }
  if (!Number.isInteger(grade) || grade < 1 || grade > 5) return { ...prev, error: 'Hãy chọn lớp từ 1 đến 5.' }
  if (!isAvatarId(avatar)) return { ...prev, error: 'Màu hồ sơ không hợp lệ.' }

  const supabase = await createSupabase()
  const { data, error } = await supabase.from('students').insert({ parent_id: viewer.userId, name, grade, avatar }).select('id').single()
  if (error) return { ...prev, error: `Chưa lưu được hồ sơ: ${error.message}` }

  await rememberStudent(data.id)
  revalidatePath('/parent')
  return { savedCount: (prev.savedCount ?? 0) + 1 }
}

/** Chọn bé sẽ học trên máy này rồi chuyển sang trang học */
export async function selectStudent(formData: FormData): Promise<void> {
  const id = String(formData.get('studentId') ?? '')
  const students = await getStudents()
  if (students.some(s => s.id === id)) await rememberStudent(id)
  redirect('/dashboard')
}
