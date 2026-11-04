import type { Subject, SubjectInfo } from '../types/lesson'

/** Thông tin hiển thị của từng môn: đường dẫn, tên, tên vở, nhãn cho một phần của lớp và lời nhắc khi bé chọn sai */
export const SUBJECTS: Record<Subject, SubjectInfo> = {
  math: {
    id: 'math',
    path: '/math',
    name: 'Toán',
    notebook: 'Vở toán',
    chapterLabel: 'Chủ đề',
    wrongHint: 'Chưa đúng, bé đếm lại rồi chọn tiếp nhé.',
  },
  'tieng-viet': {
    id: 'tieng-viet',
    path: '/tieng-viet',
    name: 'Tiếng Việt',
    notebook: 'Vở Tiếng Việt',
    chapterLabel: 'Phần',
    wrongHint: 'Chưa đúng, bé nghe lại rồi chọn tiếp nhé.',
  },
}

/** Trang mục lục một lớp, ví dụ /math/1 */
export function gradeHref(subject: Subject, grade: number): string {
  return `${SUBJECTS[subject].path}/${grade}`
}

/** Trang một bài học, ví dụ /math/1/cac-so-0-den-5 */
export function lessonHref(subject: Subject, grade: number, slug: string): string {
  return `${gradeHref(subject, grade)}/${slug}`
}
