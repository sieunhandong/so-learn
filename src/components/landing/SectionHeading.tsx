interface SectionHeadingProps {
  title: React.ReactNode
  lede?: string
  /** stack: lede dưới tiêu đề; split: lede bên phải; center: căn giữa */
  layout?: 'stack' | 'split' | 'center'
}

/** Chữ nhấn trong tiêu đề: chuyển màu từ mực tím sang xanh trời */
export function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-[linear-gradient(90deg,var(--color-ink),var(--color-sky))] box-decoration-clone bg-clip-text text-transparent">
      {children}
    </span>
  )
}

const titleClass = 'font-display text-4xl font-extrabold leading-[1.08] text-ink-deep md:text-5xl'
const ledeClass = 'text-lg leading-relaxed text-pencil md:text-xl'

/** Tiêu đề section trên trang chủ */
export default function SectionHeading({ title, lede, layout = 'stack' }: SectionHeadingProps) {
  if (layout === 'split') {
    return (
      <div className="grid items-end gap-4 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <h2 className={`max-w-[18ch] ${titleClass}`}>{title}</h2>
        {lede && <p className={`max-w-[44ch] lg:pb-2 ${ledeClass}`}>{lede}</p>}
      </div>
    )
  }

  const center = layout === 'center'
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-xl'}>
      <h2 className={titleClass}>{title}</h2>
      {lede && <p className={`mt-4 ${ledeClass} ${center ? 'mx-auto max-w-[52ch]' : ''}`}>{lede}</p>}
    </div>
  )
}
