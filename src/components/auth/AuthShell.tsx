import SiteHeader from '@/components/layout/SiteHeader'
import NotebookPage from '@/components/ui/NotebookPage'

interface AuthShellProps {
  title: string
  lede: string
  children: React.ReactNode
}

/** Khung chung của trang đăng nhập và đăng ký */
export default function AuthShell({ title, lede, children }: AuthShellProps) {
  return (
    <>
      <SiteHeader backHref="/" backLabel="Về trang chủ" />
      <main className="mx-auto grid w-full max-w-5xl items-center gap-10 px-4 py-12 md:px-8 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-tight text-ink-deep md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-[36ch] text-xl leading-relaxed text-pencil">{lede}</p>
          <ul className="mt-6 space-y-2 text-lg text-graphite">
            <li>Một tài khoản bố mẹ, tạo được nhiều hồ sơ cho các bé.</li>
            <li>Sao, chuỗi ngày học và huy hiệu được lưu cho từng bé.</li>
          </ul>
        </div>
        <NotebookPage>{children}</NotebookPage>
      </main>
    </>
  )
}
