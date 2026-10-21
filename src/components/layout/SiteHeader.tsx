import Link from 'next/link'

interface SiteHeaderProps {
  backHref?: string
  backLabel?: string
  /** "desk": nền mực tím, liền với mặt bàn của hero trang chủ */
  tone?: 'paper' | 'desk'
  children?: React.ReactNode
}

const tones = {
  paper: { bar: 'border-b-2 border-grid bg-paper/90 backdrop-blur', name: 'text-ink-deep', back: 'border-grid bg-white text-ink hover:border-ink' },
  desk: { bar: 'bg-ink-deep', name: 'text-white', back: 'border-white/30 text-white hover:border-white' },
}

export default function SiteHeader({ backHref, backLabel = 'Quay lại', tone = 'paper', children }: SiteHeaderProps) {
  const t = tones[tone]

  return (
    <header className={`sticky top-0 z-40 ${t.bar}`}>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-8">
        {backHref && (
          <Link href={backHref} aria-label={backLabel} className={`grid size-12 place-items-center rounded-xl border-2 transition-colors ${t.back}`}>
            <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </Link>
        )}
        <Link href="/" className="flex items-center gap-2">
          <span aria-hidden className="grid size-10 place-items-center rounded-lg bg-sun font-display text-3xl font-extrabold leading-none text-ink-deep">
            +
          </span>
          <span className={`font-display text-2xl font-extrabold ${t.name}`}>SoLearn</span>
        </Link>
        <div className="ml-auto flex items-center gap-3">{children}</div>
      </div>
    </header>
  )
}
