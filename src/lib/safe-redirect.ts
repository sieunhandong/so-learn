const BASE = 'http://so-learn.local'

/**
 * Chỉ cho chuyển tiếp tới đường dẫn bên trong app.
 * Chặn "//evil.com", "/\evil.com" và mọi dạng khác mà trình duyệt hiểu thành trang ngoài.
 */
function looksExternal(path: string): boolean {
  return !path.startsWith('/') || path.startsWith('//') || /[\\\t\r\n]/.test(path)
}

export function safeRedirectPath(value: unknown, fallback = '/parent'): string {
  const raw = typeof value === 'string' ? value : ''
  if (looksExternal(raw)) return fallback
  try {
    const url = new URL(raw, BASE)
    if (url.origin !== BASE) return fallback
    // Kiểm tra cả kết quả sau chuẩn hóa: "/.//evil.com" thành "//evil.com" sau khi bỏ đoạn "."
    const out = url.pathname + url.search + url.hash
    return looksExternal(out) ? fallback : out
  } catch {
    return fallback
  }
}
