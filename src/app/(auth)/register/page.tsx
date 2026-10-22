import AuthForm from '@/components/auth/AuthForm'
import AuthShell from '@/components/auth/AuthShell'
import { signUp } from '../actions'

export default function RegisterPage() {
  return (
    <AuthShell title="Tạo tài khoản bố mẹ" lede="Tài khoản dành cho bố mẹ. Sau đó bố mẹ tạo hồ sơ cho bé ngay trong trang phụ huynh.">
      <AuthForm mode="register" action={signUp} />
    </AuthShell>
  )
}
