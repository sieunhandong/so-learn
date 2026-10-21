interface TopicMarkProps {
  mark: string
  size?: 'md' | 'lg'
}

const sizes = {
  md: 'size-12 text-xl',
  lg: 'size-14 text-2xl',
}

/** Ô vuông ghi ký hiệu toán của chủ đề, như ô đầu bài trong vở */
export default function TopicMark({ mark, size = 'md' }: TopicMarkProps) {
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-xl border-2 border-ink-deep bg-white font-display font-extrabold leading-none text-ink shadow-[3px_3px_0_0_var(--color-grid)] ${sizes[size]}`}
    >
      {mark}
    </span>
  )
}
