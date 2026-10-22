'use server'

import { revalidatePath } from 'next/cache'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ACTIVE_STUDENT_COOKIE } from '@/lib/data'
import { safeRedirectPath } from '@/lib/safe-redirect'
import { createSupabase, isSupabaseConfigured } from '@/lib/supabase'

export interface AuthFormState {
  error?: string
  message?: string
}

const NOT_CONFIGURED = 'Chưa kết nối Supabase. Xem hướng dẫn trong docs/supabase-setup.md.'

// Thông báo lỗi theo mã lỗi của Supabase Auth
const authErrors: Record<string, string> = {
  invalid_credentials: 'Email hoặc mật khẩu chưa đúng.',
  email_not_confirmed: 'Email chưa được xác nhận. Bố mẹ mở hộp thư và bấm vào đường link xác nhận nhé.',
  user_already_exists: 'Email này đã có tài khoản. Bố mẹ hãy đăng nhập.',
  weak_password: 'Mật khẩu quá yếu. Hãy dùng ít nhất 6 ký tự.',
  over_email_send_rate_limit: 'Đã gửi email quá nhiều lần. Bố mẹ thử lại sau vài phút.',
  over_request_rate_limit: 'Thử quá nhiều lần. Bố mẹ đợi một chút rồi thử lại.',
}

function describe(error: { code?: string; message: string }): string {
  return (error.code && authErrors[error.code]) || `Chưa thực hiện được: ${error.message}`
}

function readCredentials(formData: FormData): { email: string; password: string } | { error: string } {
  const email = String(formData.get('email') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  if (!email.includes('@')) return { error: 'Email chưa đúng định dạng.' }
  if (password.length < 6) return { error: 'Mật khẩu cần ít nhất 6 ký tự.' }
  return { email, password }
}

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED }
  const credentials = readCredentials(formData)
  if ('error' in credentials) return credentials

  const supabase = await createSupabase()
  const { error } = await supabase.auth.signInWithPassword(credentials)
  if (error) return { error: describe(error) }

  revalidatePath('/', 'layout')
  redirect(safeRedirectPath(formData.get('next')))
}

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED }
  const credentials = readCredentials(formData)
  if ('error' in credentials) return credentials

  const origin = (await headers()).get('origin') ?? ''
  const supabase = await createSupabase()
  const { data, error } = await supabase.auth.signUp({
    ...credentials,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/parent` },
  })
  if (error) return { error: describe(error) }

  // Project tắt "Confirm email" thì có phiên ngay; bật thì phải bấm link trong email trước
  if (data.session) {
    revalidatePath('/', 'layout')
    redirect('/parent')
  }
  return { message: `Đã gửi email xác nhận tới ${credentials.email}. Bố mẹ mở thư và bấm vào đường link để hoàn tất đăng ký.` }
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabase()
    await supabase.auth.signOut()
  }
  ;(await cookies()).delete(ACTIVE_STUDENT_COOKIE)
  revalidatePath('/', 'layout')
  redirect('/')
}
