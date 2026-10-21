import type { Metadata } from 'next'
import { Baloo_2, Be_Vietnam_Pro } from 'next/font/google'
import MotionProvider from '@/components/layout/MotionProvider'
import './globals.css'

const display = Baloo_2({
  subsets: ['latin', 'vietnamese'],
  weight: ['600', '700', '800'],
  variable: '--font-baloo',
})

const body = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bevn',
})

export const metadata: Metadata = {
  title: 'SoLearn – Học toán mỗi ngày',
  description: 'Web học toán tương tác dành cho học sinh tiểu học lớp 1–5',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
