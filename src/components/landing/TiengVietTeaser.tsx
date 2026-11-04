import ButtonLink from '@/components/ui/ButtonLink'

/** Dải giới thiệu Tiếng Việt lớp 1 dưới hero. Chỉ hiện khi bật công tắc (page.tsx đọc công tắc ở server). */
export default function TiengVietTeaser() {
  return (
    <section className="bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-4 py-12 md:flex-row md:items-center md:gap-10 md:px-8 md:py-16">
        {/* Bìa vở xanh lá, cùng màu với vở Tiếng Việt trong trang học */}
        <span
          aria-hidden
          className="grid size-24 shrink-0 -rotate-3 place-items-center rounded-2xl bg-leaf font-display text-5xl font-extrabold leading-none text-white shadow-[0_6px_0_0_#167244]"
        >
          Aa
        </span>
        <div className="flex-1">
          <h2 className="font-display text-3xl font-extrabold leading-tight text-ink-deep md:text-4xl">Mới: Tiếng Việt lớp 1</h2>
          <p className="mt-3 max-w-[52ch] text-lg leading-relaxed text-pencil md:text-xl">
            Học âm, chữ và dấu thanh theo thứ tự sách Kết nối tri thức. Có giọng đọc mẫu cho từng âm.
          </p>
        </div>
        <ButtonLink href="/tieng-viet/1" size="lg">
          Mở vở Tiếng Việt
        </ButtonLink>
      </div>
    </section>
  )
}
