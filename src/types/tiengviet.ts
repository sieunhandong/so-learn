export type Tone = 'ngang' | 'huyen' | 'sac' | 'hoi' | 'nga' | 'nang'
export interface PictureWord { emoji: string; word: string }
/** Một bước đánh vần: các mảnh → kết quả, kèm lời đọc ("bờ, a, ba") */
export interface SpellStep { parts: string[]; result: string; say: string }
export type ReadingVisual =
  | { kind: 'letter'; letters: string[]; say: string }                     // chữ mới, ví dụ ['A', 'a']
  | { kind: 'scene'; emoji: string[]; sentence: string; highlight: string[] } // thẻ Nhận biết (miễn kiểm tra chữ đã học)
  | { kind: 'picture'; emoji: string; word?: string }                       // không có word khi word là đáp án
  | { kind: 'pictures'; items: PictureWord[] }
  | { kind: 'spell'; steps: SpellStep[] }
  | { kind: 'sentence'; text: string; highlight: string[] }                // câu trẻ tự đọc
  | { kind: 'listen'; say: string }
  | { kind: 'tone'; emoji: string; base: string }                         // tiếng chưa có dấu
  | { kind: 'build'; emoji?: string; say: string; onsets: string[]; rimes: string[]; tones: Tone[] }
export type BuildVisual = Extract<ReadingVisual, { kind: 'build' }>
export interface ReadingIntro { text: string; visual: ReadingVisual }
export interface ReadingExerciseSeed {
  prompt: string; visual: ReadingVisual; options: string[]; answer: string; explain: string
  difficulty: 1 | 2 | 3
  /** Bài chính tả: lựa chọn sai được phép viết sai chính tả */
  allowMisspelled?: boolean
}
export interface ReadingLessonSeed {
  number: number; slug: string; title: string; mark: string; description: string
  /** Âm/chữ/vần và dấu thanh bài này dạy mới */
  teaches: { units: string[]; tones: Tone[] }
  intro: ReadingIntro[]; exercises: ReadingExerciseSeed[]
}
export interface ReadingChapterSeed { number: number; title: string; lessons: ReadingLessonSeed[] }
export interface SyllableParts { onset: string; rime: string; tone: Tone }
export interface Learned { units: Set<string>; tones: Set<Tone> }
/** Trạng thái giọng đọc tiếng Việt của trình duyệt: đang kiểm tra, có giọng vi, thiếu giọng vi, không hỗ trợ đọc */
export type VoiceStatus = 'checking' | 'ready' | 'missing' | 'unsupported'
