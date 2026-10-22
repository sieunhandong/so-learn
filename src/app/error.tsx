'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import ButtonLink from '@/components/ui/ButtonLink'
import NotebookPage from '@/components/ui/NotebookPage'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/** Trang báo lỗi chung, thường gặp khi chưa kết nối được database */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-16">
      <NotebookPage>
        <h1 className="font-display text-3xl font-extrabold text-ink-deep">Chưa mở được trang này</h1>
        <p className="mt-3 text-lg leading-relaxed text-graphite">
          Không lấy được dữ liệu bài học. Thường là do chưa kết nối được Supabase: khóa trong .env.local chưa đúng, hoặc chưa chạy file migration và seed.
        </p>
        {error.digest && <p className="mt-2 text-base text-pencil">Mã lỗi: {error.digest}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={reset}>Thử lại</Button>
          <ButtonLink href="/" variant="paper">
            Về trang chủ
          </ButtonLink>
        </div>
      </NotebookPage>
    </main>
  )
}
