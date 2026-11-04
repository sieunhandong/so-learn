'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import SolvedFeedback from '@/components/learn/SolvedFeedback'
import SpeakButton from '@/components/learn/SpeakButton'
import ReadingVisualView from '@/components/tieng-viet/ReadingVisualView'
import NotebookPage from '@/components/ui/NotebookPage'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { EMPTY_BUILD, evaluate, pickTile, undoTile } from '@/lib/build-state'
import { composeSyllable, toneLabel } from '@/lib/tiengviet'
import type { BuildQuestion } from '@/types/lesson'
import type { BuildState, BuildVisual } from '@/types/tiengviet'

interface BuildSyllableProps {
  question: BuildQuestion
  wrongHint: string
  onSolved?: (firstTry: boolean) => void
  /** Gọi sau mỗi lần chấm (đủ ba ô), kèm số giây suy nghĩ kể từ lần chấm trước */
  onAttempt?: (isCorrect: boolean, seconds: number) => void
  /** Ghi số sao nhận được lên con dấu */
  showReward?: boolean
  /** Hiện bên dưới sau khi bé làm đúng */
  children?: React.ReactNode
}

type Slot = 'onset' | 'rime' | 'tone'

interface Tile {
  /** Giá trị đặt vào ô (với dấu là tên thanh, ví dụ 'huyen') */
  value: string
  /** Chữ hiện trên mảnh */
  text: string
}

/** Ba ô theo thứ tự từ trái sang phải, kèm tên hiện cho bé */
const SLOTS: { slot: Slot; label: string }[] = [
  { slot: 'onset', label: 'Âm đầu' },
  { slot: 'rime', label: 'Vần' },
  { slot: 'tone', label: 'Dấu' },
]

/** Ghép sai: giữ nguyên các ô để bé thấy, rồi xóa trống sau ngần này mili giây */
const RESET_DELAY_MS = 600

const tileBase =
  'min-h-16 max-w-full rounded-2xl border-2 px-5 py-2 font-display text-2xl font-bold transition-[background-color,border-color,transform,box-shadow] duration-100 disabled:cursor-default'

/** Màu và bóng của một mảnh: chưa chọn, đang chọn, hoặc sau khi ghép đúng */
function tileLook(picked: boolean, solved: boolean): string {
  if (solved) {
    return picked
      ? 'border-leaf bg-leaf text-white shadow-[0_5px_0_0_#167244]'
      : 'border-grid bg-white/60 text-pencil/60'
  }
  if (picked) return 'border-ink bg-[#F3F0FF] text-ink-deep shadow-[0_5px_0_0_var(--color-grid)]'
  return 'border-ink/30 bg-white text-ink-deep shadow-[0_5px_0_0_var(--color-grid)] enabled:hover:-translate-y-0.5 enabled:hover:border-ink enabled:hover:bg-[#F3F0FF] enabled:active:translate-y-1 enabled:active:shadow-none'
}

/** Các mảnh bé được chọn cho một ô; mảnh dấu hiện nhãn của thanh */
function tilesOf(visual: BuildVisual, slot: Slot): Tile[] {
  if (slot === 'tone') return visual.tones.map((t) => ({ value: t, text: toneLabel(t) }))
  return (slot === 'onset' ? visual.onsets : visual.rimes).map((v) => ({ value: v, text: v }))
}

/**
 * Số giây từ mốc `since` (mili giây) đến bây giờ, chưa có mốc thì là 0. Chỉ gọi trong lúc xử lý sự kiện bấm.
 * Tách ra ngoài component vì quy tắc lint "purity" hiểu nhầm hàm xử lý bấm nằm trong .map là code chạy lúc render.
 */
function elapsedSince(since: number | null): { now: number; seconds: number } {
  const now = Date.now()
  return { now, seconds: since === null ? 0 : (now - since) / 1000 }
}

/** Chữ hiện trong ô trống đã được điền: với dấu là nhãn của thanh */
function slotText(state: BuildState, slot: Slot): string | null {
  if (slot === 'tone') return state.tone === null ? null : toneLabel(state.tone)
  return state[slot]
}

export default function BuildSyllable({ question, wrongHint, onSolved, onAttempt, showReward = false, children }: BuildSyllableProps) {
  const [state, setState] = useState<BuildState>(EMPTY_BUILD)
  const [wrongCount, setWrongCount] = useState(0)
  const [solved, setSolved] = useState(false)
  // Đang rung sau khi ghép sai: khóa các mảnh cho đến lúc xóa trống
  const [shaking, setShaking] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Mốc thời gian để đo bé suy nghĩ bao lâu cho mỗi lần chấm (giống QuestionSheet)
  const lastAttemptAt = useRef<number | null>(null)
  useEffect(() => {
    lastAttemptAt.current = Date.now()
    // Rời trang giữa lúc đang rung thì hủy hẹn giờ, khỏi cập nhật trạng thái của component đã gỡ
    return () => {
      if (resetTimer.current !== null) clearTimeout(resetTimer.current)
    }
  }, [])

  const { visual } = question
  const locked = solved || shaking
  const empty = state.onset === null && state.rime === null && state.tone === null
  const preview =
    state.onset !== null && state.rime !== null && state.tone !== null
      ? composeSyllable(state.onset, state.rime, state.tone)
      : null

  function handleAttempt(isCorrect: boolean) {
    const { now, seconds } = elapsedSince(lastAttemptAt.current)
    lastAttemptAt.current = now
    onAttempt?.(isCorrect, seconds)
  }

  function handlePick(slot: Slot, value: string) {
    if (locked) return
    const next = pickTile(state, slot, value)
    setState(next)
    const result = evaluate(next, question.answer)
    if (result === 'incomplete') return

    handleAttempt(result === 'correct')
    if (result === 'correct') {
      setSolved(true)
      onSolved?.(wrongCount === 0)
    } else {
      setWrongCount((n) => n + 1)
      setShaking(true)
      resetTimer.current = setTimeout(() => {
        setState(EMPTY_BUILD)
        setShaking(false)
      }, RESET_DELAY_MS)
    }
  }

  const slotLook = solved
    ? 'border-leaf bg-leaf text-white'
    : shaking
      ? 'border-pen/50 bg-[#FFF1F0] text-pencil'
      : 'border-ink bg-white text-ink-deep'

  return (
    <NotebookPage>
      <div className="flex items-start justify-between gap-4">
        <p className="font-display text-2xl font-bold leading-snug text-ink-deep md:text-3xl">{question.prompt}</p>
        <SpeakButton text={question.prompt} />
      </div>

      <div className="my-5">
        <ReadingVisualView visual={visual} />
      </div>

      <motion.div
        animate={shaking ? { x: [0, -9, 9, -6, 6, 0] } : { x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-3"
      >
        <ul className="flex flex-wrap gap-3">
          {SLOTS.map(({ slot, label }) => {
            const text = slotText(state, slot)
            return (
              <li key={slot} className="flex flex-col gap-1">
                <span className="text-lg font-semibold text-pencil">{label}</span>
                <span
                  className={`grid min-h-16 min-w-16 place-items-center rounded-2xl border-4 px-2 font-display text-2xl font-bold ${
                    text === null ? 'border-dashed border-ink/40 bg-white/70' : `border-solid ${slotLook}`
                  }`}
                >
                  {text === null ? <span className="sr-only">còn trống</span> : text}
                </span>
              </li>
            )
          })}
        </ul>

        {/* Ô xem trước: luôn chiếm chỗ để bố cục không nhảy khi ghép đủ ba ô */}
        <p className="flex min-h-16 flex-wrap items-center gap-3 text-lg font-semibold text-pencil">
          Tiếng ghép được:
          <span className={`font-display text-4xl font-bold ${solved ? 'text-leaf' : shaking ? 'text-pen' : 'text-ink-deep'}`}>
            {preview}
          </span>
        </p>
      </motion.div>

      <div className="mt-2 flex flex-col gap-4">
        {SLOTS.map(({ slot, label }) => (
          <div key={slot} role="group" aria-label={label} className="flex flex-col gap-2">
            <span className="text-lg font-semibold text-pencil">{label}</span>
            <div className="flex flex-wrap gap-3">
              {tilesOf(visual, slot).map(({ value, text }) => {
                const picked = state[slot] === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handlePick(slot, value)}
                    disabled={locked}
                    aria-pressed={picked}
                    className={`${tileBase} ${tileLook(picked, solved)}`}
                  >
                    {text}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setState(undoTile(state))}
        disabled={locked || empty}
        className={`${buttonClasses('paper', 'mt-5')} disabled:cursor-default disabled:opacity-50`}
      >
        Xóa
      </button>

      <SolvedFeedback
        solved={solved}
        firstTry={wrongCount === 0}
        showReward={showReward}
        explain={question.explain}
        wrongHint={wrongHint}
        hasWrong={wrongCount > 0}
      >
        {children}
      </SolvedFeedback>
    </NotebookPage>
  )
}
