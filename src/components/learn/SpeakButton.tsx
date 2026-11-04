'use client'

import { useSpeech } from '@/hooks/useSpeech'

interface SpeakButtonProps {
  text: string
}

export default function SpeakButton({ text }: SpeakButtonProps) {
  const { supported, speaking, speak, stop } = useSpeech()
  if (!supported) return null

  return (
    <button
      type="button"
      onClick={() => (speaking ? stop() : speak(text))}
      aria-label={speaking ? 'Dừng đọc' : 'Nghe đọc đề'}
      aria-pressed={speaking}
      className={`grid size-14 shrink-0 place-items-center rounded-full bg-sun text-ink-deep shadow-[0_4px_0_0_#D9A21F] transition-transform active:translate-y-1 active:shadow-none ${speaking ? 'animate-pulse' : ''}`}
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
        <path d="M16.5 8.5a5 5 0 0 1 0 7" />
        <path d="M19 6a8.5 8.5 0 0 1 0 12" />
      </svg>
    </button>
  )
}
