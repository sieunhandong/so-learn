import Link from 'next/link'
import type { GradeInfo } from '@/types/math'

interface GradeShelfProps {
  grades: GradeInfo[]
}

/**
 * Năm cuốn vở dựng trên kệ, xoay nhẹ để lộ gáy.
 * Rê chuột hoặc focus thì cuốn vở xoay ra và nhấc lên. Trên điện thoại kéo ngang để xem.
 */
export default function GradeShelf({ grades }: GradeShelfProps) {
  return (
    <div className="relative">
      <ul className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 pt-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-7 lg:overflow-visible lg:px-4">
        {grades.map(g => (
          <li key={g.level} className="w-40 shrink-0 snap-center sm:w-44 lg:w-auto">
            <Link href={`/math/${g.level}`} className="group block rounded-xl perspective-[900px] focus-visible:outline-offset-8">
              <span className="relative block transform-3d rotate-y-[18deg] transition-transform duration-300 ease-out group-hover:-translate-y-2 group-hover:rotate-y-[30deg] group-focus-visible:-translate-y-2 group-focus-visible:rotate-y-[30deg] motion-reduce:transition-none">
                {/* Gáy vở, quay 90° về phía sau từ mép trái */}
                <span aria-hidden className={`absolute inset-y-0 left-0 w-5 origin-left rotate-y-90 rounded-l-sm brightness-[0.72] ${g.cover}`} />

                {/* Bìa trước */}
                <span className={`relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-l-sm rounded-r-xl p-3 pl-6 ${g.cover} ${g.coverText}`}>
                  <span aria-hidden className="bg-linen absolute inset-0" />
                  <span aria-hidden className="absolute inset-y-0 left-0 w-3 bg-[linear-gradient(90deg,rgb(0_0_0/0.25),rgb(0_0_0/0.05))]" />
                  <span aria-hidden className="absolute inset-y-0 left-3 w-px bg-white/25" />
                  <span className="relative font-display text-7xl font-extrabold leading-[0.8] [text-shadow:0_3px_0_rgb(0_0_0/0.15)]">{g.level}</span>
                  <span className="relative rounded-md border-4 border-double border-ink-deep/25 bg-white px-2.5 py-2 text-graphite">
                    <span className="block font-display text-xl font-bold leading-tight text-ink-deep">Lớp {g.level}</span>
                    <span className="block text-sm leading-snug text-pencil">{g.summary}</span>
                  </span>
                </span>
              </span>
              {/* Bóng cuốn vở in trên kệ */}
              <span aria-hidden className="mx-auto mt-1 block h-3 w-4/5 rounded-[50%] bg-ink-deep/25 blur-[6px] transition-transform duration-300 group-hover:scale-x-75" />
            </Link>
          </li>
        ))}
      </ul>
      {/* Mặt kệ */}
      <div aria-hidden className="h-3 rounded-full bg-ink-deep shadow-[0_10px_20px_-8px_rgb(42_22_115/0.6)]" />
    </div>
  )
}
