// Trang tạm để nghe thử giọng đọc tiếng Việt của trình duyệt. Không gắn link từ trang nào, xóa ở Task 17.
import SpeakButton from '@/components/math/SpeakButton'
import { PHASE1_UNITS, UNIT_SAY } from '@/content/tiengviet-sounds'

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

export default function ThuGiongDocPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <p className="text-lg font-semibold text-pen">Trang thử giọng đọc, sẽ xóa</p>

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
