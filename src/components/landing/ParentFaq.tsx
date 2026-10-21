import { STARS_AFTER_RETRY, STARS_FIRST_TRY } from '@/lib/rewards'

const faqs = [
  {
    q: 'SoLearn dành cho bé mấy tuổi?',
    a: 'Cho học sinh tiểu học từ lớp 1 đến lớp 5, khoảng 6 đến 11 tuổi. Mỗi lớp có bộ chủ đề riêng, từ đếm số ở lớp 1 đến số thập phân ở lớp 5.',
  },
  {
    q: 'Bé chưa đọc thông có học được không?',
    a: 'Được. Mỗi đề có nút loa để nghe đọc đề bằng giọng tiếng Việt có sẵn trong trình duyệt, kèm hình để bé đếm. Giọng đọc nghe khác nhau tùy máy.',
  },
  {
    q: 'Bé làm sai thì sao?',
    a: `Đáp án sai được gạch đi và bé chọn lại, không giới hạn số lần. Đúng ngay lần đầu được ${STARS_FIRST_TRY} sao, đúng sau khi thử lại được ${STARS_AFTER_RETRY} sao.`,
  },
  {
    q: 'Có quảng cáo hay đường link ra ngoài không?',
    a: 'Không. Giao diện học của bé không có quảng cáo và không có đường link dẫn sang trang khác.',
  },
  {
    q: 'Có cần cài ứng dụng không?',
    a: 'Không. SoLearn chạy ngay trên trình duyệt của máy tính, máy tính bảng hoặc điện thoại.',
  },
]

/** Câu hỏi thường gặp của bố mẹ, dùng thẻ details nên mở/đóng được không cần JavaScript */
export default function ParentFaq() {
  return (
    <div className="divide-y-2 divide-grid border-y-2 border-grid">
      {faqs.map(f => (
        <details key={f.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-4 font-display text-xl font-bold text-ink-deep transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
            {f.q}
            <span
              aria-hidden
              className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-grid text-2xl leading-none text-ink transition-transform duration-200 group-open:rotate-45 group-open:border-ink"
            >
              +
            </span>
          </summary>
          <p className="max-w-[60ch] pb-5 text-lg leading-relaxed text-graphite">{f.a}</p>
        </details>
      ))}
    </div>
  )
}
