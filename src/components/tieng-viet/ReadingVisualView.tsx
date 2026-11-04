'use client'

import { Fragment } from 'react'
import { useSpeech } from '@/hooks/useSpeech'
import type { Speech } from '@/hooks/useSpeech'
import type { ReadingVisual } from '@/types/tiengviet'

interface ReadingVisualViewProps {
  visual: ReadingVisual
}

// Thẻ bấm được: viền, bóng đặc, lún xuống khi bấm (giống ô đáp án bên toán). Padding để từng chỗ dùng tự thêm
const tapCard =
  'rounded-2xl border-2 border-ink/30 bg-white shadow-[0_5px_0_0_var(--color-grid)] transition-[transform,box-shadow] duration-100 hover:border-ink active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50'

// Nút loa tròn vàng, cùng kiểu với SpeakButton của môn Toán. Kích thước để từng chỗ dùng tự thêm
const speakRound =
  'grid shrink-0 place-items-center rounded-full bg-sun text-ink-deep shadow-[0_4px_0_0_#D9A21F] transition-transform active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50'

// Tách câu bằng split: nhờ cặp ngoặc tròn, các chữ nằm ở vị trí lẻ, xen giữa là khoảng trắng và dấu câu
const WORD_PATTERN = /(\p{L}[\p{L}\p{M}]*)/u

interface SpeakerIconProps {
  className: string
}

/** Biểu tượng loa, chỉ để trang trí nên ẩn với trình đọc màn hình */
function SpeakerIcon({ className }: SpeakerIconProps) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path d="M16.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 6a8.5 8.5 0 0 1 0 12" />
    </svg>
  )
}

interface HighlightedTextProps {
  text: string
  highlight: string[]
}

/** Câu có các tiếng trong highlight được tô nền vàng; so khớp không phân biệt hoa thường, bỏ dấu câu */
function HighlightedText({ text, highlight }: HighlightedTextProps) {
  const marked = new Set(highlight.map(word => word.normalize('NFC').toLowerCase()))
  return (
    <>
      {text.normalize('NFC').split(WORD_PATTERN).map((part, i) =>
        i % 2 === 1 && marked.has(part.toLowerCase()) ? (
          <span key={i} className="rounded-lg bg-sun/40 px-1">
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}

interface SpeakTargetProps {
  speech: Speech
  /** Tên nút cho trình đọc màn hình, nêu rõ nội dung sẽ nghe */
  label: string
  /** Lời đọc khi bấm */
  text: string
  className: string
  children: React.ReactNode
}

/** Chỗ bấm để nghe: luôn là button thật, khóa lại khi trình duyệt không đọc được */
function SpeakTarget({ speech, label, text, className, children }: SpeakTargetProps) {
  return (
    <button type="button" onClick={() => speech.speak(text)} disabled={!speech.supported} aria-label={label} className={className}>
      {children}
    </button>
  )
}

/** Hình minh họa cho một thẻ hoặc một câu hỏi môn Tiếng Việt. Mọi phần bấm được đều đọc thành tiếng. */
export default function ReadingVisualView({ visual }: ReadingVisualViewProps) {
  const speech = useSpeech()

  switch (visual.kind) {
    case 'letter':
      return (
        <SpeakTarget
          speech={speech}
          label={`Nghe chữ ${visual.letters.join(', ')}`}
          text={visual.say}
          className={`${tapCard} flex max-w-full flex-col items-center gap-2 px-6 py-4`}
        >
          <span className="flex flex-wrap items-baseline justify-center gap-x-6 font-display text-7xl font-bold text-ink">
            {visual.letters.map((letter, i) => (
              <span key={i}>{letter}</span>
            ))}
          </span>
          <SpeakerIcon className="size-7 text-ink/60" />
        </SpeakTarget>
      )

    case 'scene':
      return (
        <div className="flex flex-col items-center gap-4">
          <div aria-hidden className="flex flex-wrap justify-center gap-3 text-6xl">
            {visual.emoji.map((emoji, i) => (
              <span key={i}>{emoji}</span>
            ))}
          </div>
          <SpeakTarget
            speech={speech}
            label={`Nghe câu ${visual.sentence}`}
            text={visual.sentence}
            className={`${tapCard} flex max-w-full items-center justify-center gap-3 px-6 py-3`}
          >
            <span className="font-display text-2xl font-bold text-ink-deep">
              <HighlightedText text={visual.sentence} highlight={visual.highlight} />
            </span>
            <SpeakerIcon className="size-6 shrink-0 text-ink/60" />
          </SpeakTarget>
        </div>
      )

    case 'picture':
      // Không có word: chữ là đáp án nên chỉ hiện hình
      if (!visual.word) {
        return (
          <div aria-hidden className="flex justify-center text-7xl">
            {visual.emoji}
          </div>
        )
      }
      return (
        <SpeakTarget
          speech={speech}
          label={`Nghe từ ${visual.word}`}
          text={visual.word}
          className={`${tapCard} flex max-w-full flex-col items-center gap-2 px-8 py-4`}
        >
          <span className="text-7xl">{visual.emoji}</span>
          <span className="flex items-center gap-2 font-display text-3xl font-bold text-ink-deep">
            {visual.word}
            <SpeakerIcon className="size-6 shrink-0 text-ink/60" />
          </span>
        </SpeakTarget>
      )

    case 'pictures':
      return (
        <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
          {visual.items.map((item, i) => (
            <li key={i} className="min-w-0">
              <SpeakTarget
                speech={speech}
                label={`Nghe từ ${item.word}`}
                text={item.word}
                className={`${tapCard} flex h-full w-full flex-col items-center gap-1 px-6 py-3`}
              >
                <span className="text-6xl">{item.emoji}</span>
                <span className="flex items-center gap-2 font-display text-2xl font-bold text-ink-deep">
                  {item.word}
                  <SpeakerIcon className="size-6 shrink-0 text-ink/60" />
                </span>
              </SpeakTarget>
            </li>
          ))}
        </ul>
      )

    case 'spell':
      return (
        <ul className="flex w-full flex-col gap-3">
          {visual.steps.map((step, i) => (
            <li key={i} className="min-w-0">
              <SpeakTarget
                speech={speech}
                label={`Nghe đánh vần ${step.result}`}
                text={step.say}
                className={`${tapCard} flex w-full flex-wrap items-center justify-center gap-x-3 gap-y-1 px-6 py-3`}
              >
                {step.parts.map((part, j) => (
                  <Fragment key={j}>
                    {j > 0 && <span className="font-display text-2xl font-bold text-pencil">+</span>}
                    <span className="font-display text-3xl font-bold text-ink">{part}</span>
                  </Fragment>
                ))}
                <span className="font-display text-2xl font-bold text-pen">→</span>
                <span className="rounded-lg bg-sun/40 px-2 font-display text-3xl font-bold text-ink-deep">{step.result}</span>
                <SpeakerIcon className="size-6 shrink-0 text-ink/60" />
              </SpeakTarget>
            </li>
          ))}
        </ul>
      )

    case 'sentence':
      return (
        <div className="flex flex-wrap items-center justify-center gap-4">
          <p className="font-display text-3xl font-bold text-graphite">
            <HighlightedText text={visual.text} highlight={visual.highlight} />
          </p>
          <SpeakTarget speech={speech} label={`Nghe câu ${visual.text}`} text={visual.text} className={`${speakRound} size-14`}>
            <SpeakerIcon className="size-7" />
          </SpeakTarget>
        </div>
      )

    case 'listen':
      // Nhãn không nêu lời đọc, vì chính lời đọc là đáp án trẻ phải nghe ra
      return (
        <SpeakTarget
          speech={speech}
          label="Nghe đọc để chọn đáp án"
          text={visual.say}
          className="group flex flex-col items-center gap-3 rounded-2xl px-6 py-3 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="grid size-28 place-items-center rounded-full bg-sun text-ink-deep shadow-[0_6px_0_0_#D9A21F] transition-transform group-active:translate-y-1.5 group-active:shadow-none">
            <SpeakerIcon className="size-14" />
          </span>
          <span className="text-lg font-semibold text-pencil">Bấm để nghe</span>
        </SpeakTarget>
      )

    case 'tone':
      return (
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span aria-hidden className="text-6xl">
            {visual.emoji}
          </span>
          <span className="flex items-center gap-2 font-display text-4xl font-bold text-ink-deep">
            {visual.base}
            {/* Ô dấu còn trống, trẻ chọn dấu thích hợp để điền vào */}
            <span aria-hidden className="size-12 rounded-xl border-4 border-dashed border-ink/40 bg-white/70" />
            <span className="sr-only">, ô dấu thanh còn trống</span>
          </span>
        </div>
      )

    case 'build':
      // Nhãn không nêu lời đọc, vì lời đọc chính là tiếng trẻ phải ghép
      return (
        <div className="flex flex-wrap items-center justify-center gap-4">
          {visual.emoji && (
            <span aria-hidden className="text-7xl">
              {visual.emoji}
            </span>
          )}
          <SpeakTarget speech={speech} label="Nghe tiếng cần ghép" text={visual.say} className={`${speakRound} size-16`}>
            <SpeakerIcon className="size-8" />
          </SpeakTarget>
        </div>
      )
  }
}
