// Tính sao, số câu đã giải và chuỗi ngày học từ các lần trả lời đã lưu (bảng progress).
// Toàn bộ là hàm thuần, không gọi database.
import { STARS_AFTER_RETRY, STARS_FIRST_TRY } from './rewards'

export interface AttemptRow {
  exercise_id: string
  is_correct: boolean
  created_at: string
}

export interface ExerciseResult {
  solved: boolean
  /** Lần trả lời đầu tiên của câu này là đúng */
  firstTry: boolean
}

export interface StudentStats {
  stars: number
  solvedCount: number
  streakDays: number
  solvedToday: number
}

/** Mục tiêu mỗi ngày: số câu giải đúng */
export const DAILY_GOAL = 10

const TIME_ZONE = 'Asia/Ho_Chi_Minh'

/** Ngày theo giờ Việt Nam, dạng YYYY-MM-DD */
export function dayKey(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
}

/** Kết quả từng câu. `rows` phải xếp theo created_at tăng dần. */
export function summarizeAttempts(rows: AttemptRow[]): Map<string, ExerciseResult> {
  const results = new Map<string, ExerciseResult>()
  for (const row of rows) {
    const current = results.get(row.exercise_id)
    if (!current) {
      results.set(row.exercise_id, { solved: row.is_correct, firstTry: row.is_correct })
    } else if (row.is_correct && !current.solved) {
      current.solved = true
    }
  }
  return results
}

/** Sao chỉ tính theo lần làm đầu tiên của mỗi câu, làm lại không cộng thêm */
export function countStars(results: Map<string, ExerciseResult>): number {
  let stars = 0
  for (const r of results.values()) {
    if (r.solved) stars += r.firstTry ? STARS_FIRST_TRY : STARS_AFTER_RETRY
  }
  return stars
}

/** Số ngày học liền nhau tính đến hôm nay (hoặc đến hôm qua nếu hôm nay chưa học) */
export function countStreak(rows: AttemptRow[], now: Date): number {
  const days = new Set(rows.map(r => dayKey(new Date(r.created_at))))
  const cursor = new Date(now)
  if (!days.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1)
  let streak = 0
  while (days.has(dayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

/** Số câu khác nhau đã trả lời đúng trong hôm nay */
export function countSolvedToday(rows: AttemptRow[], now: Date): number {
  const today = dayKey(now)
  return new Set(rows.filter(r => r.is_correct && dayKey(new Date(r.created_at)) === today).map(r => r.exercise_id)).size
}

export function computeStats(rows: AttemptRow[], now: Date): StudentStats {
  const results = summarizeAttempts(rows)
  return {
    stars: countStars(results),
    solvedCount: [...results.values()].filter(r => r.solved).length,
    streakDays: countStreak(rows, now),
    solvedToday: countSolvedToday(rows, now),
  }
}
