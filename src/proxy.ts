// Chạy trước mọi request: làm mới phiên đăng nhập Supabase và chặn trang cần đăng nhập.
// (Next.js 16 đổi tên middleware.ts thành proxy.ts.)
import { NextResponse, type NextRequest } from 'next/server'
import { refreshSession } from '@/lib/supabase'

const PROTECTED = ['/dashboard', '/parent']

export async function proxy(request: NextRequest) {
  const { response, userId } = await refreshSession(request)
  const path = request.nextUrl.pathname

  if (!userId && PROTECTED.some(p => path === p || path.startsWith(`${p}/`))) {
    const login = request.nextUrl.clone()
    login.pathname = '/login'
    login.search = ''
    login.searchParams.set('next', path)
    return NextResponse.redirect(login)
  }
  return response
}

export const config = {
  // Bỏ qua file tĩnh và ảnh
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
