import CountingVisual from '@/components/math/CountingVisual'
import RedStamp from '@/components/ui/RedStamp'
import StarCount from '@/components/ui/StarCount'
import TiltCard from '@/components/ui/TiltCard'
import { getQuestions } from '@/lib/content'
import SectionHeading, { Accent } from './SectionHeading'

const steps = [
  { title: 'Nghe đề', body: 'Bấm loa vàng, máy đọc đề cho bé. Bé chưa đọc thông vẫn làm được bài.' },
  { title: 'Đếm rồi chọn', body: 'Quả táo, que tính, bó chục giúp bé nhìn thấy phép tính trước khi chọn số.' },
  { title: 'Được chấm', body: 'Đúng thì cô đóng dấu đỏ. Sai thì đáp án bị gạch đi, bé chọn lại.' },
]

/** Nhãn chú thích dán đè lên cửa sổ bài học, nổi ở lớp gần người xem hơn */
function Callout({ n, children, className }: { n: number; children: React.ReactNode; className: string }) {
  return (
    <span className={`absolute z-10 flex items-center gap-2 rounded-full border-2 border-white bg-ink-deep py-1.5 pl-1.5 pr-4 text-sm font-semibold text-white shadow-[0_14px_24px_-10px_rgb(42_22_115/0.6)] translate-z-[70px] ${className}`}>
      <span className="grid size-6 place-items-center rounded-full bg-pen font-display text-sm font-extrabold">{n}</span>
      {children}
    </span>
  )
}

// Ô đáp án tĩnh, cùng kiểu với AnswerOption trong bài làm thật
const optionStyles = {
  correct: 'border-leaf bg-leaf text-white shadow-[0_5px_0_0_#167244]',
  wrong: 'border-pen/40 bg-[#FFF1F0] text-pencil line-through decoration-pen decoration-4',
  dimmed: 'border-grid bg-white/60 text-pencil/60',
} as const

function SpeakerDot() {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sun text-ink-deep shadow-[0_4px_0_0_#D9A21F]">
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        <path d="M16.5 8.5a5 5 0 0 1 0 7" />
      </svg>
    </span>
  )
}

/** Chữ bên trái, cửa sổ bài học minh họa 3D bên phải */
export default function HowItWorks() {
  const sample = getQuestions().find(q => q.visual.kind === 'take-away')
  const wrongPick = 1

  function stateOf(index: number): keyof typeof optionStyles {
    if (index === sample?.correct) return 'correct'
    return index === wrongPick ? 'wrong' : 'dimmed'
  }

  return (
    <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
      <div>
        <SectionHeading
          title={
            <>
              Một câu hỏi,
              <br />
              <Accent>ba bước nhỏ</Accent>
            </>
          }
          lede="Câu nào cũng đi theo cùng một nhịp: nghe đề, đếm hình, chọn đáp án."
        />
        <ol className="mt-8 space-y-3">
          {steps.map((s, i) => (
            <li key={s.title} className="flex items-start gap-4 rounded-2xl border-2 border-grid bg-white p-4 shadow-[0_6px_0_-2px_var(--color-grid)]">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-pen/10 font-display text-xl font-extrabold text-pen">{i + 1}</span>
              <span>
                <span className="block font-display text-xl font-bold text-ink-deep">{s.title}</span>
                <span className="block text-base leading-relaxed text-pencil">{s.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      {sample && (
        <div className="relative">
          <div aria-hidden className="absolute inset-x-8 -bottom-10 top-16 rounded-full bg-[radial-gradient(closest-side,rgb(123_93_242/0.32),transparent)] blur-2xl" />
          <TiltCard maxDeg={5} innerClassName="lg:rotate-x-[6deg] lg:rotate-y-[-12deg]">
            {/* Cửa sổ bài học minh họa, chỉ để xem nên tắt tương tác */}
            <div aria-hidden inert className="relative rounded-[1.75rem] bg-white p-3 shadow-[0_50px_70px_-40px_rgb(42_22_115/0.65)] ring-2 ring-grid">
              <div className="flex items-center gap-3 px-3 pb-3 pt-1">
                <span className="flex gap-1.5">
                  <span className="size-3 rounded-full bg-pen/70" />
                  <span className="size-3 rounded-full bg-sun" />
                  <span className="size-3 rounded-full bg-leaf/70" />
                </span>
                <span className="flex-1 truncate font-display text-base font-bold text-pencil">Cộng trừ trong 20, câu 3/5</span>
                <StarCount value={4} />
              </div>
              <div className="relative rounded-2xl border-2 border-grid bg-oli p-5 pl-12 before:absolute before:inset-y-0 before:left-7 before:w-0.5 before:bg-pen/35">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-xl font-bold leading-snug text-ink-deep md:text-2xl">{sample.prompt}</p>
                  <SpeakerDot />
                </div>
                <div className="my-4">
                  <CountingVisual visual={sample.visual} />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {sample.options.map((o, i) => (
                    <span
                      key={o}
                      className={`grid min-h-16 place-items-center rounded-2xl border-2 font-display text-3xl font-bold ${optionStyles[stateOf(i)]}`}
                    >
                      {o}
                    </span>
                  ))}
                </div>
                <p className="mt-3 pr-28 text-base text-graphite">
                  <strong className="text-leaf">Đúng rồi! </strong>
                  {sample.explain}
                </p>
                <RedStamp title="Đúng!" note="+1 sao" trigger="inView" className="absolute -bottom-6 -right-4" />
              </div>
            </div>

            <Callout n={1} className="-right-3 -top-4 md:-right-6">
              Bấm loa để nghe đề
            </Callout>
            <Callout n={2} className="-left-3 bottom-36 md:-left-8">
              Sai thì gạch đi, chọn lại
            </Callout>
            <Callout n={3} className="-bottom-5 left-10">
              Đúng thì được đóng dấu
            </Callout>
          </TiltCard>
        </div>
      )}
    </div>
  )
}
