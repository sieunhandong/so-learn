import Link from 'next/link'
import { LockIcon, PenTick } from '@/components/ui/Icons'
import type { LessonState } from '@/lib/outline'
import TopicMark from './TopicMark'

export type LessonStatus = { kind: 'locked' } | { kind: 'done' } | { kind: 'progress'; solved: number; total: number } | { kind: 'soon' } | { kind: 'open'; total: number }

function Status({ status }: { status: LessonStatus }) {
  switch (status.kind) {
    case 'locked':
      return (
        <span className="flex shrink-0 items-center gap-1 text-base text-pencil">
          <LockIcon className="size-5" /> Chưa mở
        </span>
      )
    case 'done':
      return (
        <span className="flex shrink-0 items-center gap-1 font-display text-lg font-bold text-pen">
          <PenTick className="size-6" /> Xong
        </span>
      )
    case 'progress':
      return (
        <span className="shrink-0 font-display text-lg font-bold text-ink">
          {status.solved}/{status.total}
        </span>
      )
    case 'soon':
      return <span className="shrink-0 rounded-full bg-grid/60 px-3 py-1 text-sm font-semibold text-pencil">Sắp có</span>
    case 'open':
      return <span className="shrink-0 text-base text-pencil">{status.total} câu</span>
  }
}

interface RowProps {
  href: string | null
  mark: string
  label: string
  title: string
  description: string
  status: LessonStatus
}

/** Một dòng trong mục lục; không có href thì không bấm được (bài khóa hoặc chưa có) */
export default function LessonRow({ href, mark, label, title, description, status }: RowProps) {
  const content = (
    <>
      <TopicMark mark={mark} />
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-bold text-pencil">{label}</span>
        <span className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold leading-tight text-ink-deep">{title}</span>
          <span aria-hidden className="mb-1.5 hidden flex-1 border-b-2 border-dotted border-ink/25 sm:block" />
        </span>
        <span className="block text-base text-pencil">{description}</span>
      </span>
      <Status status={status} />
    </>
  )
  return (
    <li className="border-b-2 border-grid/70 last:border-b-0">
      {href ? (
        <Link
          href={href}
          className="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-4 transition-[background-color,translate] duration-200 hover:translate-x-1 hover:bg-[#F3F0FF] [&>*:first-child]:transition-transform hover:[&>*:first-child]:-rotate-6"
        >
          {content}
        </Link>
      ) : (
        <div aria-disabled className="flex items-center gap-4 py-4 opacity-60">
          {content}
        </div>
      )}
    </li>
  )
}

export function statusOf(s: LessonState, hasStudent: boolean): LessonStatus {
  if (s.locked) return { kind: 'locked' }
  if (!hasStudent) return { kind: 'open', total: s.total }
  if (s.total > 0 && s.solved >= s.total) return { kind: 'done' }
  return { kind: 'progress', solved: s.solved, total: s.total }
}
