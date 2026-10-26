// Âm và chữ của bài 1–30 môn Tiếng Việt lớp 1, theo thứ tự dạy, kèm cách đọc khi dạy.
// [Unverified] Cách đọc trong UNIT_SAY chưa được người duyệt xác nhận, chờ sửa sau khi nghe thử giọng đọc.
// File này Node chạy trực tiếp (--experimental-strip-types): chỉ dùng cú pháp TypeScript xóa được.

/** 39 âm/chữ của bài 1–30, theo thứ tự dạy */
export const PHASE1_UNITS: string[] = [
  'a', 'b', 'c', 'e', 'ê', 'o', 'ô', 'd', 'đ', 'ơ',
  'i', 'k', 'h', 'l', 'u', 'ư',
  'ch', 'kh', 'm', 'n', 'g', 'gi', 'gh', 'nh', 'ng', 'ngh',
  'r', 's', 't', 'tr', 'th',
  'ia', 'ua', 'ưa',
  'ph', 'qu', 'v', 'x', 'y',
]

/** Cách đọc khi dạy: nguyên âm đọc như chữ viết, phụ âm đọc kèm "ờ", một số mục đọc riêng */
export const UNIT_SAY: Record<string, string> = {
  // Nguyên âm và vần ia, ua, ưa: đọc như chữ viết
  a: 'a',
  e: 'e',
  ê: 'ê',
  o: 'o',
  ô: 'ô',
  ơ: 'ơ',
  i: 'i',
  u: 'u',
  ư: 'ư',
  ia: 'ia',
  ua: 'ua',
  ưa: 'ưa',
  // Phụ âm: đọc kèm "ờ"
  b: 'bờ',
  c: 'cờ',
  d: 'dờ',
  đ: 'đờ',
  h: 'hờ',
  l: 'lờ',
  ch: 'chờ',
  kh: 'khờ',
  m: 'mờ',
  n: 'nờ',
  g: 'gờ',
  nh: 'nhờ',
  ng: 'ngờ',
  r: 'rờ',
  s: 'sờ',
  t: 'tờ',
  tr: 'trờ',
  th: 'thờ',
  ph: 'phờ',
  v: 'vờ',
  x: 'xờ',
  // Đọc riêng
  k: 'ca',
  gh: 'gờ kép',
  ngh: 'ngờ kép',
  gi: 'di',
  qu: 'quờ',
  y: 'i dài',
}
