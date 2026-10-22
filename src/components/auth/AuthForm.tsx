'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { buttonClasses } from '@/components/ui/buttonStyles'
import type { AuthFormState } from '@/app/(auth)/actions'

interface AuthFormProps {
  mode: 'login' | 'register'
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>
  /** Trang chuyển tới sau khi đăng nhập */
  next?: string
  /** Lỗi truyền từ URL, ví dụ link xác nhận đã hết hạn */
  initialError?: string
}

const inputClass =
  'mt-1 w-full rounded-xl border-2 border-grid bg-white px-4 py-3 text-lg text-ink-deep outline-none transition-colors placeholder:text-pencil/60 focus:border-ink'

export default function AuthForm({ mode, action, next, initialError }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, { error: initialError })
  const isLogin = mode === 'login'

  return (
    <form action={formAction} className="space-y-5">
      {next && <input type="hidden" name="next" value={next} />}
      <label className="block">
        <span className="font-display text-lg font-bold text-ink-deep">Email của bố mẹ</span>
        <input name="email" type="email" required autoComplete="email" placeholder="bome@email.com" className={inputClass} />
      </label>
      <label className="block">
        <span className="font-display text-lg font-bold text-ink-deep">Mật khẩu</span>
        <input
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={isLogin ? 'current-password' : 'new-password'}
          placeholder="Ít nhất 6 ký tự"
          className={inputClass}
        />
      </label>

      <div aria-live="polite">
        {state.error && <p className="rounded-xl border-2 border-pen/30 bg-[#FFF1F0] px-4 py-3 text-base text-pen">{state.error}</p>}
        {state.message && <p className="rounded-xl border-2 border-leaf/30 bg-[#EAF7F0] px-4 py-3 text-base text-[#146B40]">{state.message}</p>}
      </div>

      <button type="submit" disabled={pending} className={buttonClasses('ink', 'w-full disabled:opacity-60', 'lg')}>
        {pending ? 'Đang gửi…' : isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}
      </button>

      <p className="text-center text-base text-pencil">
        {isLogin ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
        <Link href={isLogin ? '/register' : '/login'} className="font-semibold text-ink underline underline-offset-2">
          {isLogin ? 'Đăng ký' : 'Đăng nhập'}
        </Link>
      </p>
    </form>
  )
}
