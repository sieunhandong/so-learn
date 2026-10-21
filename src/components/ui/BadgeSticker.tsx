import { LockIcon } from './Icons'
import type { Badge } from '@/types/math'

interface BadgeStickerProps {
  badge: Badge
  /** Xoay nhẹ cho giống nhãn dán bằng tay */
  tilt?: 'left' | 'right'
}

/** Huy hiệu hình con dấu tròn bút đỏ; chưa đạt thì viền nét đứt và ổ khóa */
export default function BadgeSticker({ badge, tilt = 'left' }: BadgeStickerProps) {
  return (
    <div className={`flex w-28 flex-col items-center gap-1 text-center ${tilt === 'left' ? '-rotate-3' : 'rotate-2'}`}>
      <span
        aria-hidden
        className={`grid size-20 place-items-center rounded-full p-1.5 ${
          badge.earned ? 'border-4 border-pen bg-white text-pen' : 'border-2 border-dashed border-pencil/40 text-pencil/50'
        }`}
      >
        <span className={`grid size-full place-items-center rounded-full font-display text-2xl font-extrabold ${badge.earned ? 'border-2 border-pen/60' : ''}`}>
          {badge.earned ? badge.mark : <LockIcon className="size-6" />}
        </span>
      </span>
      <span className={`text-sm font-semibold ${badge.earned ? 'text-graphite' : 'text-pencil'}`}>
        {badge.label}
        {!badge.earned && <span className="sr-only"> (chưa mở)</span>}
      </span>
    </div>
  )
}
