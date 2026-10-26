import type { QuestionVisual } from './math'
import type { BuildVisual, ReadingVisual } from './tiengviet'

export type Subject = 'math' | 'tieng-viet'
export type LessonVisual = QuestionVisual | ReadingVisual   // hai bộ `kind` không trùng tên
export interface LessonIntroItem { text: string; visual: LessonVisual }
export interface ChoiceQuestion { type: 'choice'; id: string; prompt: string; visual: LessonVisual; options: string[]; correct: number; explain: string }
export interface BuildQuestion { type: 'build'; id: string; prompt: string; visual: BuildVisual; answer: string; explain: string }
export type LessonQuestion = ChoiceQuestion | BuildQuestion
export interface SubjectInfo { id: Subject; path: string; name: string; notebook: string; chapterLabel: string; wrongHint: string }
