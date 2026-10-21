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
}

/** Đồ dùng đếm quen thuộc: quả táo, que tính, chấm tròn */
export type CountItem = 'apple' | 'stick' | 'dot'

export type QuestionVisual =
  | { kind: 'add'; item: CountItem; groups: [number, number] }
  | { kind: 'take-away'; item: CountItem; total: number; remove: number }
  | { kind: 'compare'; left: number; right: number }

export interface Question {
  id: number
  prompt: string
  visual: QuestionVisual
  options: string[]
  correct: number
  explain: string
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
