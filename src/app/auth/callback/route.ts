// Đích của đường link xác nhận trong email đăng ký: đổi mã một lần lấy phiên đăng nhập.
import { NextResponse } from 'next/server'
import { safeRedirectPath } from '@/lib/safe-redirect'
import { createSupabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeRedirectPath(searchParams.get('next'))

  if (code && isSupabaseConfigured()) {
    const supabase = await createSupabase()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }
  return NextResponse.redirect(`${origin}/login?error=link`)
}
