// Kiểu dữ liệu các bảng Supabase, viết tay khớp với supabase/migrations/20261022000000_init.sql.
// Nếu đổi schema, sửa cả file này (hoặc sinh lại bằng `npx supabase gen types typescript`).
import type { LessonIntro, QuestionVisual } from './math'

type UserRow = {
  id: string
  email: string
  created_at: string
}

type StudentRow = {
  id: string
  parent_id: string
  name: string
  grade: number
  avatar: string
  created_at: string
}

type TopicRow = {
  id: string
  grade: number
  chapter_number: number
  chapter_title: string
  position: number
  title: string
  mark: string
  description: string
  intro: LessonIntro[]
}

type ExerciseRow = {
  id: string
  slug: string
  grade: number
  topic: string
  position: number
  question: string
  answer: string
  options: string[]
  type: 'multiple_choice' | 'drag_drop' | 'fill_blank'
  difficulty: number
  visual: QuestionVisual | null
  explain: string
  image_url: string | null
  audio_url: string | null
}

type ProgressRow = {
  id: string
  student_id: string
  exercise_id: string
  is_correct: boolean
  time_spent: number
  created_at: string
}

type BadgeRow = {
  id: string
  student_id: string
  badge_type: string
  earned_at: string
}

/** Bảng chỉ đọc từ app: không cho Insert/Update */
type ReadOnly<Row> = { Row: Row; Insert: never; Update: never; Relationships: [] }

export type Database = {
  public: {
    Tables: {
      users: ReadOnly<UserRow>
      topics: ReadOnly<TopicRow>
      exercises: ReadOnly<ExerciseRow>
      students: {
        Row: StudentRow
        Insert: { parent_id: string; name: string; grade: number; avatar?: string }
        Update: { name?: string; grade?: number; avatar?: string }
        Relationships: []
      }
      progress: {
        Row: ProgressRow
        Insert: { student_id: string; exercise_id: string; is_correct: boolean; time_spent?: number }
        Update: never
        Relationships: []
      }
      badges: {
        Row: BadgeRow
        Insert: { student_id: string; badge_type: string }
        Update: never
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

export type Student = StudentRow
export type TopicRecord = TopicRow
export type ExerciseRecord = ExerciseRow
export type ProgressRecord = ProgressRow
