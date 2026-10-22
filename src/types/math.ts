export type GradeLevel = 1 | 2 | 3 | 4 | 5

export interface GradeInfo {
  level: GradeLevel
  summary: string
  /** Tailwind class màu bìa vở */
  cover: string
  /** Tailwind class màu chữ trên bìa */
  coverText: string
}

export interface Topic {
  id: string
  title: string
  /** Ký hiệu toán đại diện cho chủ đề, ví dụ "+", "½", "m²" */
  mark: string
  description: string
  total: number
  done: number
  /** Tên các bài nhỏ bên trong (dùng khi một mục là cả một chủ đề) */
  items?: string[]
}

/** Đồ dùng đếm quen thuộc: quả táo, que tính, chấm tròn */
export type CountItem = 'apple' | 'stick' | 'dot'

export type ShapeKind = 'square' | 'circle' | 'triangle' | 'rectangle'
export type SolidKind = 'cube' | 'box'
export type Placement = 'above' | 'below' | 'left' | 'right' | 'between'

export type QuestionVisual =
  /** Một nhóm đồ vật để đếm */
  | { kind: 'count'; item: CountItem; count: number }
  /** Gộp hai nhóm */
  | { kind: 'add'; item: CountItem; groups: [number, number] }
  /** Bớt đi: phần bị bớt gạch bút đỏ */
  | { kind: 'take-away'; item: CountItem; total: number; remove: number }
  /** So sánh hai số có hai chữ số bằng bó chục và que lẻ */
  | { kind: 'compare'; left: number; right: number }
  /** So sánh hai nhóm đồ vật đặt cạnh nhau */
  | { kind: 'compare-groups'; item: CountItem; left: number; right: number }
  /** Mấy và mấy: một nhóm tách làm hai phần màu khác nhau */
  | { kind: 'split'; item: CountItem; total: number; first: number }
  /** Một hàng hình phẳng */
  | { kind: 'shapes'; shapes: ShapeKind[] }
  /** Một hàng khối */
  | { kind: 'solids'; solids: SolidKind[] }
  /** Quả bóng đặt ở một vị trí so với cái hộp */
  | { kind: 'position'; place: Placement }
  /** Một số có hai chữ số: bó chục và que lẻ */
  | { kind: 'tens-ones'; value: number }
  /** Cộng hoặc trừ số có hai chữ số, vẽ bằng bó chục và que lẻ */
  | { kind: 'tens-calc'; a: number; b: number; op: '+' | '-' }
  /** Dãy số có ô trống (null) */
  | { kind: 'number-row'; numbers: (number | null)[] }
  /** Hai bút chì dài ngắn khác nhau, độ dài tính theo ô */
  | { kind: 'length'; a: number; b: number }
  /** Bút chì đặt trên thước, độ dài theo xăng-ti-mét */
  | { kind: 'ruler'; length: number }
  /** Đồng hồ chỉ giờ đúng, 1 đến 12 */
  | { kind: 'clock'; hour: number }
  /** Bảng các ngày trong tuần, ô highlight là "hôm nay" (0 là thứ Hai, -1 là không đánh dấu) */
  | { kind: 'week'; highlight: number }

export interface Question {
  id: string
  prompt: string
  visual: QuestionVisual
  options: string[]
  correct: number
  explain: string
}

/** Một bài tập trong file nội dung, dùng để sinh dữ liệu seed cho database */
export interface ExerciseSeed {
  prompt: string
  visual: QuestionVisual
  options: string[]
  answer: string
  explain: string
  difficulty: 1 | 2 | 3
}

/** Phần "Cùng học" ở đầu mỗi bài */
export interface LessonIntro {
  text: string
  visual: QuestionVisual
}

export interface LessonSeed {
  /** Mã bài, dùng trong URL: /math/1/<slug> */
  slug: string
  title: string
  mark: string
  description: string
  intro: LessonIntro[]
  exercises: ExerciseSeed[]
}

export interface ChapterSeed {
  number: number
  title: string
  lessons: LessonSeed[]
}

export interface Badge {
  /** Chữ hoặc số in trên huy hiệu */
  mark: string
  label: string
  earned: boolean
}

export interface ContinueItem {
  grade: GradeLevel
  topicId: string
}
