import Link from 'next/link'
import { grades } from '@/lib/content'

/** Chân trang: chỉ có liên kết nội bộ, không dẫn ra ngoài */
export default function SiteFooter() {
  return (
    <footer className="bg-ink-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span aria-hidden className="grid size-10 place-items-center rounded-lg bg-sun font-display text-3xl font-extrabold leading-none text-ink-deep">
              +
            </span>
            <span className="font-display text-2xl font-extrabold">SoLearn</span>
          </Link>
          <p className="mt-3 max-w-[34ch] text-base leading-relaxed text-white/70">
            Học toán tiểu học bằng hình, giọng đọc và con dấu đỏ. Lớp 1 đến lớp 5.
          </p>
        </div>

        <nav aria-label="Các lớp">
          <h2 className="font-display text-lg font-bold text-sun">Các lớp</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-base">
            {grades.map(g => (
              <li key={g.level}>
                <Link href={`/math/${g.level}`} className="text-white/80 transition-colors hover:text-white">
                  Vở toán lớp {g.level}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Học">
          <h2 className="font-display text-lg font-bold text-sun">Học</h2>
          <ul className="mt-3 space-y-2 text-base">
            <li>
              <Link href="/dashboard" className="text-white/80 transition-colors hover:text-white">
                Trang học của bé
              </Link>
            </li>
            <li>
              <Link href="/#chon-lop" className="text-white/80 transition-colors hover:text-white">
                Chương trình 5 lớp
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-sm text-white/60 md:px-8">© 2026 SoLearn. Học toán mỗi ngày.</p>
      </div>
    </footer>
  )
}
