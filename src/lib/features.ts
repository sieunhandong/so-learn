/** Công tắc hiện các lối vào Tiếng Việt (trang chủ, dashboard, footer). URL /tieng-viet/1 vẫn mở được khi tắt. Chỉ gọi ở server. */
export function isTiengVietEnabled(): boolean {
  return process.env.TIENG_VIET_ENABLED === 'true'
}
