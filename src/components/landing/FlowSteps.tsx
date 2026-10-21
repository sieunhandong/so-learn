import TopicMark from '@/components/math/TopicMark'

const flow = [
  { mark: '1–5', title: 'Chọn lớp', body: 'Mở vở đúng lớp của bé, từ lớp 1 đến lớp 5.' },
  { mark: '≡', title: 'Mở bài', body: 'Chọn bài trong mục lục. Bài sau mở khi bé đã bắt đầu bài trước.' },
  { mark: '?', title: 'Làm từng câu', body: 'Nghe đề, đếm hình, chọn đáp án. Sai thì thử lại.' },
  { mark: '★', title: 'Xem kết quả', body: 'Nhận sao, con dấu Xong bài! và làm lại bài nếu muốn.' },
]

/** Bốn bước của một buổi học, theo đúng thứ tự các trang trong ứng dụng */
export default function FlowSteps() {
  return (
    <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {flow.map((step, i) => (
        <li key={step.title} className="group perspective-[900px]">
          <div className="relative h-full rounded-[1.5rem] border-2 border-grid bg-white p-6 shadow-[0_10px_0_-4px_var(--color-grid)] transition-[translate,rotate,transform,box-shadow] duration-300 ease-out transform-3d group-hover:-translate-y-2 group-hover:rotate-x-[10deg] group-hover:shadow-[0_22px_30px_-18px_rgb(42_22_115/0.45)] motion-reduce:transition-none">
            <div className="flex items-start justify-between">
              <span className="transition-[translate] duration-300 group-hover:translate-z-[36px]">
                <TopicMark mark={step.mark} />
              </span>
              <span className="font-display text-5xl font-extrabold leading-none text-ink/20">{i + 1}</span>
            </div>
            <h3 className="mt-6 font-display text-2xl font-extrabold text-ink-deep">{step.title}</h3>
            <p className="mt-2 text-base leading-relaxed text-pencil">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
