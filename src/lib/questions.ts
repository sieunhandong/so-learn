// Chuyển một dòng bảng exercises thành câu hỏi để hiển thị, và nhận biết hình minh họa của môn nào.
// File này Node chạy trực tiếp (--experimental-strip-types): chỉ dùng cú pháp TypeScript xóa được, import kiểu dùng `import type`.
import type { ExerciseRecord } from '../types/database'
import type { BuildQuestion, ChoiceQuestion, LessonQuestion, LessonVisual } from '../types/lesson'
import type { ReadingVisual } from '../types/tiengviet'

/** Các `kind` của hình minh họa môn Tiếng Việt; `kind` của Toán không trùng tên với các giá trị này */
const READING_KINDS: ReadonlySet<string> = new Set(['letter', 'scene', 'picture', 'pictures', 'spell', 'sentence', 'listen', 'tone', 'build'])

/** Hình minh họa này thuộc môn Tiếng Việt (vẽ bằng ReadingVisualView) hay không */
export function isReadingVisual(v: LessonVisual): v is ReadingVisual {
  return READING_KINDS.has(v.kind)
}

/**
 * Dòng bài tập thành câu hỏi: dạng `drag_drop` với hình `build` là câu ghép tiếng, còn lại là câu chọn đáp án.
 * Trả về null khi dòng thiếu hình hoặc đáp án không nằm trong các lựa chọn (dữ liệu hỏng, bỏ qua câu đó).
 */
export function toQuestion(row: ExerciseRecord): LessonQuestion | null {
  const { visual } = row
  if (!visual) return null

  if (row.type === 'drag_drop' && visual.kind === 'build' && row.answer) {
    const build: BuildQuestion = { type: 'build', id: row.id, prompt: row.question, visual, answer: row.answer.normalize('NFC'), explain: row.explain }
    return build
  }

  // So khớp sau khi chuẩn hóa NFC hai bên (dấu tiếng Việt có thể gõ dạng tổ hợp hoặc dựng sẵn), nhưng giữ nguyên chuỗi lựa chọn để hiển thị
  const answer = row.answer.normalize('NFC')
  const correct = row.options.map(option => option.normalize('NFC')).indexOf(answer)
  if (correct < 0) return null
  const choice: ChoiceQuestion = { type: 'choice', id: row.id, prompt: row.question, visual, options: row.options, correct, explain: row.explain }
  return choice
}
