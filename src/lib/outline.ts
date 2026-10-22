// Trạng thái từng bài trong mục lục, tính từ kết quả làm bài của bé. Hàm thuần, không gọi database.
import type { ChapterSummary, LessonSummary } from './data'
import type { ExerciseResult } from './progress'

export interface LessonState {
  lesson: LessonSummary
  chapterNumber: number
  /** Thứ tự bài trong chủ đề, bắt đầu từ 1 */
  numberInChapter: number
  solved: number
  total: number
  started: boolean
  /** Bài sau chỉ mở khi bé đã bắt đầu bài liền trước. Khách (không có kết quả) thì không khóa. */
  locked: boolean
}

export function lessonStates(outline: ChapterSummary[], results: Map<string, ExerciseResult> | null): LessonState[] {
  const states: LessonState[] = []
  for (const chapter of outline) {
    chapter.lessons.forEach((lesson, i) => {
      const ids = lesson.exerciseIds
      const previous = states.at(-1)
      states.push({
        lesson,
        chapterNumber: chapter.number,
        numberInChapter: i + 1,
        solved: results ? ids.filter(id => results.get(id)?.solved).length : 0,
        total: ids.length,
        started: results ? ids.some(id => results.has(id)) : false,
        locked: results !== null && previous !== undefined && !previous.started,
      })
    })
  }
  return states
}

/** Bài đầu tiên theo thứ tự chương trình còn câu chưa giải */
export function nextLesson(states: LessonState[]): LessonState | undefined {
  return states.find(s => s.solved < s.total)
}

/** Tổng số câu đã giải và tổng số câu của một nhóm bài */
export function sumProgress(states: LessonState[]): { solved: number; total: number } {
  return states.reduce((acc, s) => ({ solved: acc.solved + s.solved, total: acc.total + s.total }), { solved: 0, total: 0 })
}
