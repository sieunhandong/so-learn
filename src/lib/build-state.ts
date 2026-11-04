// Trạng thái ghép tiếng: ba ô âm đầu, vần, dấu. Hàm thuần, không phụ thuộc React.
// File này Node chạy trực tiếp (--experimental-strip-types): chỉ dùng cú pháp TypeScript xóa được.
import type { BuildState, Tone } from '../types/tiengviet'
import { composeSyllable, TONES } from './tiengviet.ts'

/** Ba ô trống, lúc bắt đầu và sau khi ghép sai */
export const EMPTY_BUILD: BuildState = { onset: null, rime: null, tone: null }

/** Chuỗi có phải tên một thanh không (để thu hẹp kiểu string thành Tone) */
function isTone(value: string): value is Tone {
  return TONES.some((t) => t === value)
}

/** Đặt một mảnh vào ô của nó, thay mảnh cũ nếu có. Ô dấu gặp giá trị không phải dấu thanh thì giữ nguyên */
export function pickTile(s: BuildState, slot: 'onset' | 'rime' | 'tone', value: string): BuildState {
  if (slot === 'tone') return isTone(value) ? { ...s, tone: value } : s
  return { ...s, [slot]: value }
}

/** Xóa ô cuối còn giá trị, theo thứ tự dấu, vần, âm đầu */
export function undoTile(s: BuildState): BuildState {
  if (s.tone !== null) return { ...s, tone: null }
  if (s.rime !== null) return { ...s, rime: null }
  if (s.onset !== null) return { ...s, onset: null }
  return s
}

/** Chưa đủ ba ô thì incomplete; đủ thì so tiếng ghép được với đáp án */
export function evaluate(s: BuildState, answer: string): 'incomplete' | 'correct' | 'wrong' {
  if (s.onset === null || s.rime === null || s.tone === null) return 'incomplete'
  return composeSyllable(s.onset, s.rime, s.tone) === answer.normalize('NFC') ? 'correct' : 'wrong'
}
