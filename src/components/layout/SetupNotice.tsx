import NotebookPage from '@/components/ui/NotebookPage'

/** Hiện khi chưa khai báo biến môi trường Supabase, thay vì để trang lỗi */
export default function SetupNotice() {
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <NotebookPage>
        <h1 className="font-display text-3xl font-extrabold text-ink-deep">Chưa kết nối Supabase</h1>
        <p className="mt-3 text-lg leading-relaxed text-graphite">Trang này cần database. Làm theo các bước sau rồi tải lại trang:</p>
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-lg text-graphite">
          <li>Tạo project trên Supabase.</li>
          <li>
            Tạo file <code className="rounded bg-grid/50 px-1.5 font-mono text-base">.env.local</code> có <code className="rounded bg-grid/50 px-1.5 font-mono text-base">SUPABASE_URL</code> và{' '}
            <code className="rounded bg-grid/50 px-1.5 font-mono text-base">SUPABASE_ANON_KEY</code>.
          </li>
          <li>
            Chạy <code className="rounded bg-grid/50 px-1.5 font-mono text-base">supabase/migrations/…_init.sql</code> rồi{' '}
            <code className="rounded bg-grid/50 px-1.5 font-mono text-base">supabase/seed.sql</code> trong SQL Editor.
          </li>
          <li>Khởi động lại <code className="rounded bg-grid/50 px-1.5 font-mono text-base">npm run dev</code>.</li>
        </ol>
        <p className="mt-4 text-base text-pencil">Hướng dẫn chi tiết: docs/supabase-setup.md trong mã nguồn.</p>
      </NotebookPage>
    </main>
  )
}
