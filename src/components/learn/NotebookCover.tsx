import ProgressRuler from '@/components/ui/ProgressRuler'
import type { NotebookCoverProps } from '@/types/lesson'

/** Bìa vở của một lớp: số lớn, tờ nhãn có tiêu đề, tóm tắt, thanh tiến độ (khi có bé) và ghi chú */
export default function NotebookCover({ big, title, summary, coverClass, textClass, solved, total, note }: NotebookCoverProps) {
  return (
    <div className={`relative overflow-hidden ${coverClass} ${textClass}`}>
      <span aria-hidden className="bg-linen absolute inset-0" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-4 bg-[linear-gradient(to_top,rgb(0_0_0/0.22),transparent)]" />
      <div className="relative mx-auto flex max-w-4xl flex-wrap items-end gap-6 px-4 pb-10 pt-6 md:px-8">
        <span className="font-display text-[7rem] font-extrabold leading-[0.8] [text-shadow:0_4px_0_rgb(0_0_0/0.15)]">{big}</span>
        <div className="min-w-64 flex-1 -rotate-1 rounded-lg border-[6px] border-double border-ink-deep/25 bg-white p-5 text-graphite shadow-[0_16px_24px_-16px_rgb(0_0_0/0.5)]">
          <h1 className="font-display text-3xl font-extrabold text-ink-deep">{title}</h1>
          <p className="text-lg text-pencil">{summary}</p>
          {solved !== null && <ProgressRuler value={solved} max={total} label={`Tiến độ lớp ${big}`} className="mt-4" />}
          <p className="mt-2 text-base text-pencil">{note}</p>
        </div>
      </div>
    </div>
  )
}
