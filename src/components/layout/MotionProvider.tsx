'use client'

import { MotionConfig } from 'framer-motion'

interface MotionProviderProps {
  children: React.ReactNode
}

/** Tắt animation chuyển động khi người dùng bật "giảm chuyển động" */
export default function MotionProvider({ children }: MotionProviderProps) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
