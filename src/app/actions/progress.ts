'use server'

import { awardBadges, getActiveStudent } from '@/lib/data'
import { createSupabase, isSupabaseConfigured } from '@/lib/supabase'

export interface AttemptInput {
  exerciseId: string
  isCorrect: boolean
  /** Thời gian suy nghĩ cho lần chọn này, giây */
  timeSpent: number
}

export interface AttemptResult {
  saved: boolean
  /** Tên các huy hiệu bé vừa nhận */
  newBadges: string[]
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const NOT_SAVED: AttemptResult = { saved: false, newBadges: [] }

/** Ghi một lần bé chọn đáp án vào bảng progress. Khách chưa đăng nhập thì bỏ qua, không báo lỗi. */
export async function recordAttempt(input: AttemptInput): Promise<AttemptResult> {
  if (!isSupabaseConfigured()) return NOT_SAVED
  if (!UUID.test(input.exerciseId) || typeof input.isCorrect !== 'boolean') return NOT_SAVED

  const student = await getActiveStudent()
  if (!student) return NOT_SAVED

  const timeSpent = Math.max(0, Math.min(3600, Math.round(Number(input.timeSpent) || 0)))
  const supabase = await createSupabase()
  const { error } = await supabase.from('progress').insert({
    student_id: student.id,
    exercise_id: input.exerciseId,
    is_correct: input.isCorrect,
    time_spent: timeSpent,
  })
  if (error) {
    console.error('Không lưu được tiến độ', error)
    return NOT_SAVED
  }

  if (!input.isCorrect) return { saved: true, newBadges: [] }
  try {
    return { saved: true, newBadges: await awardBadges(student.id) }
  } catch (badgeError) {
    // Tiến độ đã lưu; lỗi xét huy hiệu không làm hỏng bài làm của bé
    console.error('Không xét được huy hiệu', badgeError)
    return { saved: true, newBadges: [] }
  }
}
