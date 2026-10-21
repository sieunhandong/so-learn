interface ProgressRulerProps {
  value: number
  max: number
  label: string
  className?: string
}

/** Thanh tiến độ hình thước kẻ */
export default function ProgressRuler({ value, max, label, className = '' }: ProgressRulerProps) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`relative h-4 overflow-hidden rounded-md border-2 border-ink-deep/25 bg-white ${className}`}
    >
      <div
        className="h-full bg-leaf transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
      <div aria-hidden className="ruler-ticks absolute inset-0" />
    </div>
  )
}
