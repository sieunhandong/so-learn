'use client'

import { motion } from 'framer-motion'

interface HighlightMarkerProps {
  children: React.ReactNode
}

/** Vệt bút dạ quang vàng quét dưới chữ, một lần khi tải trang */
export default function HighlightMarker({ children }: HighlightMarkerProps) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.35, duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        className="absolute -inset-x-[0.08em] bottom-[0.06em] h-[0.42em] origin-left -rotate-1 rounded-[0.12em] bg-sun"
      />
      <span className="relative">{children}</span>
    </span>
  )
}
