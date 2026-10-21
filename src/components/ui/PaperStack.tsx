interface PaperStackProps {
  /** Số tờ giấy lộ ra bên dưới, từ 0 đến 3 */
  sheets: number
  children: React.ReactNode
  className?: string
}

// Tờ càng sâu càng lệch và xoay nhiều hơn
const offsets = [
  'translate-x-1.5 translate-y-2 rotate-[0.8deg]',
  'translate-x-3 translate-y-4 rotate-[1.6deg]',
  'translate-x-[1.1rem] translate-y-6 rotate-[2.4deg]',
]

/** Chồng giấy phía dưới một trang vở */
export default function PaperStack({ sheets, children, className = '' }: PaperStackProps) {
  const visible = offsets.slice(0, Math.max(0, Math.min(sheets, offsets.length))).reverse()

  return (
    <div className={`relative isolate ${className}`}>
      {visible.map(offset => (
        <div
          key={offset}
          aria-hidden
          className={`absolute inset-0 -z-10 rounded-2xl border-2 border-grid bg-paper shadow-[0_8px_16px_-12px_rgb(42_22_115/0.5)] transition-transform duration-500 ${offset}`}
        />
      ))}
      {children}
    </div>
  )
}
