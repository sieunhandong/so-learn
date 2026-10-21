import BadgeSticker from '@/components/ui/BadgeSticker'
import { StarIcon } from '@/components/ui/Icons'
import RedStamp from '@/components/ui/RedStamp'
import TiltCard from '@/components/ui/TiltCard'
import { badges } from '@/lib/content'
import { MEDAL_THRESHOLDS, STARS_AFTER_RETRY, STARS_FIRST_TRY } from '@/lib/rewards'

function Stars({ count }: { count: number }) {
  return (
    <span className="flex shrink-0 gap-0.5" aria-label={`${count} sao`}>
      {Array.from({ length: count }, (_, i) => (
        <StarIcon key={i} className="size-7" />
      ))}
    </span>
  )
}

const perQuestion = [
  { rule: 'Đúng ngay lần đầu', stars: STARS_FIRST_TRY },
  { rule: 'Thử lại rồi mới đúng', stars: STARS_AFTER_RETRY },
]

const perLesson = [
  { rule: `Từ ${Math.round(MEDAL_THRESHOLDS.three * 100)}% câu đúng ngay lần đầu`, stars: 3 },
  { rule: `Từ ${Math.round(MEDAL_THRESHOLDS.two * 100)}% câu đúng ngay lần đầu`, stars: 2 },
  { rule: 'Làm xong cả bài', stars: 1 },
]

/** Hai thẻ quy tắc (tối, sáng) nghiêng theo con trỏ, và tờ nhãn dán bên dưới */
export default function RewardsSection() {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <TiltCard maxDeg={4}>
          <div className="h-full rounded-[1.75rem] bg-ink-deep p-7 text-white shadow-[0_30px_50px_-30px_rgb(42_22_115/0.9)] md:p-9">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-sun">Sau mỗi câu</span>
            <h3 className="mt-4 font-display text-3xl font-extrabold">Sao cộng dồn</h3>
            <p className="mt-2 max-w-[38ch] text-base leading-relaxed text-white/70">
              Sao được cộng ngay khi bé chọn đúng, và hiện ở góc trên của bài làm.
            </p>
            <ul className="mt-6 divide-y divide-white/15 border-t border-white/15">
              {perQuestion.map(r => (
                <li key={r.rule} className="flex items-center justify-between gap-4 py-4 text-lg">
                  {r.rule}
                  <Stars count={r.stars} />
                </li>
              ))}
            </ul>
          </div>
          <span aria-hidden className="absolute -right-3 -top-6 rotate-12 drop-shadow-[0_12px_10px_rgb(0_0_0/0.3)] translate-z-[60px]">
            <StarIcon className="size-20" />
          </span>
        </TiltCard>

        <TiltCard maxDeg={4}>
          <div className="h-full rounded-[1.75rem] bg-[#F1EEFC] p-7 ring-2 ring-grid md:p-9">
            <span className="inline-block rounded-full bg-white px-3 py-1 text-sm font-semibold text-ink">Khi xong bài</span>
            <h3 className="mt-4 font-display text-3xl font-extrabold text-ink-deep">Xếp hạng 1 đến 3 sao</h3>
            <p className="mt-2 max-w-[38ch] text-base leading-relaxed text-pencil">
              Tính theo số câu bé đúng ngay lần đầu, không tính theo tốc độ.
            </p>
            <ul className="mt-6 divide-y-2 divide-white border-t-2 border-white">
              {perLesson.map(r => (
                <li key={r.rule} className="flex items-center justify-between gap-4 py-4 text-lg text-graphite">
                  {r.rule}
                  <Stars count={r.stars} />
                </li>
              ))}
            </ul>
          </div>
          <span className="absolute -right-4 -top-10 translate-z-[60px]">
            <RedStamp title="Xong bài!" note="Giỏi quá" trigger="inView" />
          </span>
        </TiltCard>
      </div>

      {/* Tờ nhãn dán */}
      <div className="flex flex-col gap-6 rounded-[1.75rem] border-2 border-grid bg-white p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="max-w-[30ch]">
          <h3 className="font-display text-2xl font-extrabold text-ink-deep">Tờ nhãn dán</h3>
          <p className="mt-1 text-base leading-relaxed text-pencil">Học đều thì mở thêm nhãn mới. Nhãn chưa mở có viền nét đứt.</p>
        </div>
        <ul className="flex flex-wrap gap-x-2 gap-y-4">
          {badges.map((b, i) => (
            <li key={b.label}>
              <BadgeSticker badge={b} tilt={i % 2 === 0 ? 'left' : 'right'} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
