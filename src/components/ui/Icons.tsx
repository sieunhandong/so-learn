interface IconProps {
  className?: string
}

export function StarIcon({ className = 'size-6' }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      <path
        d="M12 2.8l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.6l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z"
        className="fill-sun stroke-ink-deep"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Dấu tích bút đỏ như cô chấm bài */
export function PenTick({ className = 'size-7' }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 28 28" className={className} fill="none">
      <path d="M4 15.5c2.5 1.5 4.5 4 6 7 3.5-8 8-13.5 14-18" className="stroke-pen" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function LockIcon({ className = 'size-6' }: IconProps) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  )
}
