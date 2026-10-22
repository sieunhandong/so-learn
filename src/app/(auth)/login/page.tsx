import AuthForm from '@/components/auth/AuthForm'
import AuthShell from '@/components/auth/AuthShell'
import { signIn } from '../actions'

interface LoginPageProps {
  searchParams: Promise<{ next?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, error } = await searchParams
  return (
    <AuthShell title="Bố mẹ đăng nhập" lede="Đăng nhập để chọn hồ sơ của bé và lưu tiến độ học.">
      <AuthForm
        mode="login"
        action={signIn}
        next={next}
        initialError={error === 'link' ? 'Đường link xác nhận không hợp lệ hoặc đã hết hạn. Bố mẹ thử đăng nhập lại nhé.' : undefined}
      />
    </AuthShell>
  )
}
