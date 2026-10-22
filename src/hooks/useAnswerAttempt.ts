'use client'

import { useState } from 'react'

export interface AnswerAttempt {
  wrongPicks: number[]
  solved: boolean
  firstTry: boolean
  choose: (index: number) => void
}

/**
 * Một câu hỏi, thử lại không giới hạn cho đến khi đúng.
 * onAttempt được gọi sau mỗi lần chọn (đúng hoặc sai), onSolved khi chọn đúng.
 */
export function useAnswerAttempt(
  correctIndex: number,
  onSolved?: (firstTry: boolean) => void,
  onAttempt?: (isCorrect: boolean) => void,
): AnswerAttempt {
  const [wrongPicks, setWrongPicks] = useState<number[]>([])
  const [solved, setSolved] = useState(false)

  function choose(index: number) {
    if (solved || wrongPicks.includes(index)) return
    const isCorrect = index === correctIndex
    onAttempt?.(isCorrect)
    if (isCorrect) {
      setSolved(true)
      onSolved?.(wrongPicks.length === 0)
    } else {
      setWrongPicks(picks => [...picks, index])
    }
  }

  return { wrongPicks, solved, firstTry: solved && wrongPicks.length === 0, choose }
}
