// Truy vấn dữ liệu cho các trang (chỉ chạy ở server). Mọi truy vấn dùng client từ src/lib/supabase.ts.
import { cookies } from 'next/headers'
import { createSupabase, isSupabaseConfigured } from './supabase'
import { computeStats, summarizeAttempts, type AttemptRow, type ExerciseResult, type StudentStats } from './progress'
import { BADGES } from './rewards'
import type { ExerciseRecord, Student, TopicRecord } from '@/types/database'
import type { Question } from '@/types/math'

/** Cookie ghi id của bé đang học trên máy này (chỉ là id, RLS vẫn kiểm tra quyền) */
export const ACTIVE_STUDENT_COOKIE = 'so_learn_student'

/** Supabase trả tối đa 1000 dòng mỗi lần; đọc theo trang để không bị cắt */
const PAGE_SIZE = 1000

export interface Viewer {
  userId: string
  email: string
}

export interface LessonSummary {
  slug: string
  title: string
  mark: string
  description: string
  position: number
  exerciseIds: string[]
}

export interface ChapterSummary {
  number: number
  title: string
  lessons: LessonSummary[]
}

export interface StudentOverview {
  stats: StudentStats
  results: Map<string, ExerciseResult>
  earnedBadges: Set<string>
}

/** Phụ huynh đang đăng nhập, hoặc null nếu chưa đăng nhập / chưa cấu hình Supabase */
export async function getViewer(): Promise<Viewer | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createSupabase()
  const { data } = await supabase.auth.getUser()
  return data.user ? { userId: data.user.id, email: data.user.email ?? '' } : null
}

export async function getStudents(): Promise<Student[]> {
  const supabase = await createSupabase()
  const { data, error } = await supabase.from('students').select('*').order('created_at')
  if (error) throw error
  return data
}

/** Bé đang học: theo cookie trên máy này, nếu không có thì bé được tạo đầu tiên */
export async function getActiveStudent(): Promise<Student | null> {
  if (!(await getViewer())) return null
  const students = await getStudents()
  const id = (await cookies()).get(ACTIVE_STUDENT_COOKIE)?.value
  return students.find(s => s.id === id) ?? students[0] ?? null
}

/** Mục lục một lớp: các chủ đề, mỗi chủ đề gồm các bài và id câu hỏi của bài */
export async function getGradeOutline(grade: number): Promise<ChapterSummary[]> {
  const supabase = await createSupabase()
  const [topicsRes, exercisesRes] = await Promise.all([
    supabase.from('topics').select('id, chapter_number, chapter_title, position, title, mark, description').eq('grade', grade).order('position'),
    supabase.from('exercises').select('id, topic').eq('grade', grade).order('position'),
  ])
  if (topicsRes.error) throw topicsRes.error
  if (exercisesRes.error) throw exercisesRes.error

  const idsByTopic = new Map<string, string[]>()
  for (const e of exercisesRes.data) idsByTopic.set(e.topic, [...(idsByTopic.get(e.topic) ?? []), e.id])

  const chapters: ChapterSummary[] = []
  for (const t of topicsRes.data) {
    let chapter = chapters.find(c => c.number === t.chapter_number)
    if (!chapter) {
      chapter = { number: t.chapter_number, title: t.chapter_title, lessons: [] }
      chapters.push(chapter)
    }
    chapter.lessons.push({ slug: t.id, title: t.title, mark: t.mark, description: t.description, position: t.position, exerciseIds: idsByTopic.get(t.id) ?? [] })
  }
  return chapters
}

function toQuestion(row: ExerciseRecord): Question | null {
  const correct = row.options.indexOf(row.answer)
  if (!row.visual || correct < 0) return null
  return { id: row.id, prompt: row.question, visual: row.visual, options: row.options, correct, explain: row.explain }
}

/** Một bài học: thông tin bài và danh sách câu hỏi theo thứ tự */
export async function getLesson(slug: string): Promise<{ topic: TopicRecord; questions: Question[] } | null> {
  const supabase = await createSupabase()
  const [topicRes, exercisesRes] = await Promise.all([
    supabase.from('topics').select('*').eq('id', slug).maybeSingle(),
    supabase.from('exercises').select('*').eq('topic', slug).order('position'),
  ])
  if (topicRes.error) throw topicRes.error
  if (exercisesRes.error) throw exercisesRes.error
  if (!topicRes.data) return null
  const questions = exercisesRes.data.map(toQuestion).filter((q): q is Question => q !== null)
  return { topic: topicRes.data, questions }
}

/** Mọi lần trả lời của một bé, xếp theo thời gian */
export async function getAttempts(studentId: string): Promise<AttemptRow[]> {
  const supabase = await createSupabase()
  const rows: AttemptRow[] = []
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from('progress')
      .select('exercise_id, is_correct, created_at')
      .eq('student_id', studentId)
      .order('created_at')
      .range(from, from + PAGE_SIZE - 1)
    if (error) throw error
    rows.push(...data)
    if (data.length < PAGE_SIZE) return rows
  }
}

export async function getEarnedBadges(studentId: string): Promise<Set<string>> {
  const supabase = await createSupabase()
  const { data, error } = await supabase.from('badges').select('badge_type').eq('student_id', studentId)
  if (error) throw error
  return new Set(data.map(b => b.badge_type))
}

export async function getStudentOverview(studentId: string): Promise<StudentOverview> {
  const [attempts, earnedBadges] = await Promise.all([getAttempts(studentId), getEarnedBadges(studentId)])
  return { stats: computeStats(attempts, new Date()), results: summarizeAttempts(attempts), earnedBadges }
}

async function countGradeExercises(grade: number): Promise<number> {
  const supabase = await createSupabase()
  const { count, error } = await supabase.from('exercises').select('id', { count: 'exact', head: true }).eq('grade', grade)
  if (error) throw error
  return count ?? 0
}

/** Xét và trao các huy hiệu mới đạt được. Trả về tên các huy hiệu vừa nhận. */
export async function awardBadges(studentId: string): Promise<string[]> {
  const [attempts, earned, gradeTotal] = await Promise.all([getAttempts(studentId), getEarnedBadges(studentId), countGradeExercises(1)])
  const stats = computeStats(attempts, new Date())
  const fresh = BADGES.filter(b => !earned.has(b.type) && b.earned({ ...stats, gradeTotal }))
  if (fresh.length === 0) return []

  const supabase = await createSupabase()
  const { error } = await supabase
    .from('badges')
    .upsert(
      fresh.map(b => ({ student_id: studentId, badge_type: b.type })),
      { onConflict: 'student_id,badge_type', ignoreDuplicates: true },
    )
  if (error) throw error
  return fresh.map(b => b.label)
}
