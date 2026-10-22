/** Số sao cho một câu: đúng ngay lần đầu, hoặc đúng sau khi thử lại */
export const STARS_FIRST_TRY = 2
export const STARS_AFTER_RETRY = 1

/** Tỉ lệ câu đúng ngay lần đầu để được 3 sao hoặc 2 sao khi xong bài; dưới mức 2 sao vẫn được 1 sao */
export const MEDAL_THRESHOLDS = { three: 0.8, two: 0.5 } as const

/** Số liệu dùng để xét huy hiệu */
export interface BadgeCheck {
  stars: number
  solvedCount: number
  streakDays: number
  /** Tổng số câu của lớp 1 */
  gradeTotal: number
}

export interface BadgeDefinition {
  type: string
  mark: string
  label: string
  earned: (s: BadgeCheck) => boolean
}

/** Danh mục huy hiệu. `type` được lưu ở cột badges.badge_type, đừng đổi tên sau khi đã có dữ liệu. */
export const BADGES: BadgeDefinition[] = [
  { type: 'first_correct', mark: '1', label: 'Câu đúng đầu tiên', earned: s => s.solvedCount >= 1 },
  { type: 'solved_10', mark: '10', label: '10 câu đã giải', earned: s => s.solvedCount >= 10 },
  { type: 'streak_3', mark: '3', label: '3 ngày học liền', earned: s => s.streakDays >= 3 },
  { type: 'stars_50', mark: '50', label: '50 sao', earned: s => s.stars >= 50 },
  { type: 'grade1_done', mark: 'L1', label: 'Xong toán lớp 1', earned: s => s.gradeTotal > 0 && s.solvedCount >= s.gradeTotal },
]

export function medalCount(firstTryCount: number, total: number): number {
  if (firstTryCount >= total * MEDAL_THRESHOLDS.three) return 3
  if (firstTryCount >= total * MEDAL_THRESHOLDS.two) return 2
  return 1
}
