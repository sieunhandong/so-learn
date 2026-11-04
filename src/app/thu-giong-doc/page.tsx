// Trang tạm để nghe thử giọng đọc tiếng Việt của trình duyệt. Không gắn link từ trang nào, xóa ở Task 17.
import SpeakButton from '@/components/learn/SpeakButton'
import BuildSyllable from '@/components/tieng-viet/BuildSyllable'
import ReadingVisualView from '@/components/tieng-viet/ReadingVisualView'
import VoiceStatusLine from '@/components/tieng-viet/VoiceStatusLine'
import { PHASE1_UNITS, UNIT_SAY } from '@/content/tiengviet-sounds'
import { toneLabel } from '@/lib/tiengviet'
import type { BuildQuestion } from '@/types/lesson'
import type { ReadingVisual } from '@/types/tiengviet'

// Dấu thanh: đọc cả cụm "dấu ..." để nghe thử
const TONE_MARKS: string[] = ['dấu huyền', 'dấu sắc', 'dấu hỏi', 'dấu ngã', 'dấu nặng']

// Chuỗi đánh vần mẫu: âm, vần, tiếng, dấu thanh
const SPELLINGS: string[] = [
  'bờ, a, ba',
  'ba, huyền, bà',
  'cờ, o, co, hỏi, cỏ',
  'trờ, ưa, trưa',
  'quờ, a, qua, sắc, quá',
  'ngờ kép, e, nghe',
]

// Mỗi kind hình minh họa một mẫu cố định để xem và nghe thử
const VISUAL_SAMPLES: { title: string; visual: ReadingVisual }[] = [
  { title: 'letter', visual: { kind: 'letter', letters: ['B', 'b'], say: 'bờ' } },
  { title: 'scene', visual: { kind: 'scene', emoji: ['🐄', '👵'], sentence: 'Bà có bò.', highlight: ['bà', 'bò'] } },
  { title: 'picture (có chữ)', visual: { kind: 'picture', emoji: '🐄', word: 'bò' } },
  { title: 'picture (không chữ)', visual: { kind: 'picture', emoji: '🐟' } },
  {
    title: 'pictures',
    visual: {
      kind: 'pictures',
      items: [
        { emoji: '🐟', word: 'cá' },
        { emoji: '🐄', word: 'bò' },
        { emoji: '👵', word: 'bà' },
        { emoji: '🚩', word: 'cờ' },
      ],
    },
  },
  {
    title: 'spell',
    visual: {
      kind: 'spell',
      steps: [
        { parts: ['b', 'a'], result: 'ba', say: 'bờ, a, ba' },
        { parts: ['ba', toneLabel('huyen')], result: 'bà', say: 'ba, huyền, bà' },
      ],
    },
  },
  { title: 'sentence', visual: { kind: 'sentence', text: 'Bé có cá.', highlight: ['cá'] } },
  { title: 'listen', visual: { kind: 'listen', say: 'bờ' } },
  { title: 'tone', visual: { kind: 'tone', emoji: '👵', base: 'ba' } },
  {
    title: 'build',
    visual: { kind: 'build', emoji: '🐟', say: 'cá', onsets: ['c'], rimes: ['a'], tones: ['ngang', 'sac'] },
  },
]

// Một câu ghép tiếng mẫu để thử ghép, rung khi sai, con dấu khi đúng
const BUILD_SAMPLE: BuildQuestion = {
  type: 'build',
  id: 'thu-ghep-1',
  prompt: 'Nghe rồi ghép thành tiếng.',
  visual: { kind: 'build', emoji: '🐄', say: 'bò', onsets: ['b', 'c'], rimes: ['a', 'o'], tones: ['ngang', 'huyen', 'sac'] },
  answer: 'bò',
  explain: 'Bờ ghép với o được bo, thêm dấu huyền thành bò.',
}

export default function ThuGiongDocPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <p className="text-lg font-semibold text-pen">Trang thử giọng đọc, sẽ xóa</p>
      <div className="mt-3">
        <VoiceStatusLine />
      </div>

      <section className="mt-6">
        <h2 className="font-display text-2xl font-bold text-ink-deep">Hình minh họa</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {VISUAL_SAMPLES.map(({ title, visual }) => (
            <li key={title} className="flex min-w-0 flex-col gap-3 rounded-2xl border-2 border-grid bg-paper px-4 py-3">
              <span className="text-lg font-semibold text-pencil">{title}</span>
              <div className="flex flex-1 items-center justify-center">
                <ReadingVisualView visual={visual} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-2xl font-bold text-ink-deep">Ghép tiếng</h2>
        <div className="mt-4">
          <BuildSyllable question={BUILD_SAMPLE} wrongHint="Chưa đúng, bé ghép lại nhé." />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-2xl font-bold text-ink-deep">Âm và chữ</h2>
        <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {PHASE1_UNITS.map(unit => (
            <li key={unit} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-grid bg-paper px-4 py-3">
              <span className="font-display text-4xl font-bold text-ink">{unit}</span>
              <SpeakButton text={UNIT_SAY[unit]} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-ink-deep">Dấu thanh</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {TONE_MARKS.map(mark => (
            <li key={mark} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-grid bg-paper px-4 py-3">
              <span className="text-lg font-semibold text-graphite">{mark}</span>
              <SpeakButton text={mark} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-bold text-ink-deep">Đánh vần</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {SPELLINGS.map(spelling => (
            <li key={spelling} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-grid bg-paper px-4 py-3">
              <span className="text-lg font-semibold text-graphite">{spelling}</span>
              <SpeakButton text={spelling} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
