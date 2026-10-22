// Mọi truy cập Supabase trong app đi qua file này (theo CLAUDE.md).
// Client chạy ở server (Server Component, Server Action, Route Handler, proxy) và đọc/ghi phiên đăng nhập qua cookie.
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/types/database'

function env() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  }
}

/** Đã khai báo NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY trong .env.local chưa */
export function isSupabaseConfigured(): boolean {
  const { url, key } = env()
  return Boolean(url && key)
}

/** Client Supabase cho Server Component, Server Action và Route Handler */
export async function createSupabase() {
  const { url, key } = env()
  if (!url || !key) {
    throw new Error('Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc NEXT_PUBLIC_SUPABASE_ANON_KEY trong .env.local')
  }
  const cookieStore = await cookies()
  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Server Component không được ghi cookie. Phiên vẫn được làm mới trong src/proxy.ts.
        }
      },
    },
  })
}

/**
 * Dùng trong src/proxy.ts: làm mới phiên đăng nhập trên mỗi request và trả về người dùng hiện tại.
 * Phải trả đúng `response` này (đã gắn cookie mới) về cho trình duyệt.
 */
export async function refreshSession(request: NextRequest) {
  let response = NextResponse.next({ request })
  const { url, key } = env()
  if (!url || !key) return { response, userId: null }

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  // getUser() gọi về Supabase để xác thực token, an toàn hơn getSession()
  const { data } = await supabase.auth.getUser()
  return { response, userId: data.user?.id ?? null }
}
