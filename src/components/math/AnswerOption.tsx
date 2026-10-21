'use client'

import { motion } from 'framer-motion'

export type AnswerState = 'idle' | 'wrong' | 'correct' | 'dimmed'

interface AnswerOptionProps {
  label: string
  state: AnswerState
  onChoose: () => void
}

const stateClasses: Record<AnswerState, string> = {
  idle: 'border-ink/30 bg-white text-ink-deep shadow-[0_5px_0_0_var(--color-grid)] hover:-translate-y-0.5 hover:border-ink hover:bg-[#F3F0FF] hover:shadow-[0_7px_0_0_var(--color-grid)] active:translate-y-1 active:shadow-none',
  wrong: 'border-pen/40 bg-[#FFF1F0] text-pencil line-through decoration-pen decoration-4',
  correct: 'border-leaf bg-leaf text-white shadow-[0_5px_0_0_#167244]',
  dimmed: 'border-grid bg-white/60 text-pencil/60',
}

export default function AnswerOption({ label, state, onChoose }: AnswerOptionProps) {
  const disabled = state !== 'idle'

  return (
    <motion.button
      type="button"
      onClick={onChoose}
      disabled={disabled}
      aria-label={state === 'wrong' ? `${label}, chưa đúng` : label}
      animate={state === 'wrong' ? { x: [0, -9, 9, -6, 6, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className={`min-h-20 rounded-2xl border-2 px-4 py-3 font-display text-3xl font-bold transition-[background-color,border-color,transform,box-shadow] duration-100 disabled:cursor-default md:text-4xl ${stateClasses[state]}`}
    >
      {label}
    </motion.button>
  )
}
