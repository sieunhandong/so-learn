/** Số sao cho một câu: đúng ngay lần đầu, hoặc đúng sau khi thử lại */
export const STARS_FIRST_TRY = 2
export const STARS_AFTER_RETRY = 1

/** Tỉ lệ câu đúng ngay lần đầu để được 3 sao hoặc 2 sao khi xong bài; dưới mức 2 sao vẫn được 1 sao */
export const MEDAL_THRESHOLDS = { three: 0.8, two: 0.5 } as const

export function medalCount(firstTryCount: number, total: number): number {
  if (firstTryCount >= total * MEDAL_THRESHOLDS.three) return 3
  if (firstTryCount >= total * MEDAL_THRESHOLDS.two) return 2
  return 1
}
