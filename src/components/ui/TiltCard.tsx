'use client'

import { motion } from 'framer-motion'
import { useTilt } from '@/hooks/useTilt'

interface TiltCardProps {
  children: React.ReactNode
  /** Góc nghiêng tối đa theo con trỏ, độ */
  maxDeg?: number
  className?: string
  /** Class cho lớp xoay bên trong, ví dụ để đặt sẵn một góc nghiêng tĩnh */
  innerClassName?: string
}

/**
 * Khung có phối cảnh, nghiêng theo con trỏ chuột.
 * Con bên trong dùng translate-z-* để nổi lên các lớp khác nhau (parallax).
 */
export default function TiltCard({ children, maxDeg = 4, className = '', innerClassName = '' }: TiltCardProps) {
  const tilt = useTilt(maxDeg)

  return (
    <div className={`perspective-[1400px] ${className}`} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}>
      <motion.div style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }} className="relative h-full transform-3d">
        <div className={`relative h-full transform-3d ${innerClassName}`}>{children}</div>
      </motion.div>
    </div>
  )
}
