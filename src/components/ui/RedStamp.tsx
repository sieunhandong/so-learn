'use client'

import { motion } from 'framer-motion'

interface RedStampProps {
  title: string
  note?: string
  size?: 'md' | 'lg'
  /** "mount": đóng dấu ngay; "inView": đóng dấu khi cuộn tới */
  trigger?: 'mount' | 'inView'
  className?: string
}

const sizes = {
  md: { outer: 'size-32', inner: 'size-[6.6rem]', title: 'text-3xl' },
  lg: { outer: 'size-44', inner: 'size-[9.4rem]', title: 'text-4xl' },
}

const stamped = { scale: 1, opacity: 1, rotate: -12 }

/** Con dấu bút đỏ cô chấm: đóng xuống khi bé làm đúng */
export default function RedStamp({ title, note, size = 'md', trigger = 'mount', className = '' }: RedStampProps) {
  const s = sizes[size]

  return (
    <motion.div
      role="status"
      initial={{ scale: 2.4, opacity: 0, rotate: -32 }}
      {...(trigger === 'mount' ? { animate: stamped } : { whileInView: stamped, viewport: { once: true, amount: 0.8 } })}
      exit={{ opacity: 0 }}
      transition={{ type: 'spring', stiffness: 460, damping: 20 }}
      className={`pointer-events-none grid place-items-center rounded-full border-4 border-pen bg-white/70 text-pen mix-blend-multiply ${s.outer} ${className}`}
    >
      <div className={`flex flex-col items-center justify-center rounded-full border-2 border-pen/70 text-center ${s.inner}`}>
        <span className={`font-display font-extrabold leading-none ${s.title}`}>{title}</span>
        {note && <span className="mt-1 text-sm font-bold">{note}</span>}
      </div>
    </motion.div>
  )
}
