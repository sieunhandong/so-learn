'use client'

import { useState } from 'react'

export interface AnswerAttempt {
  wrongPicks: number[]
  solved: boolean
  firstTry: boolean
  choose: (index: number) => void
}

/** Một câu hỏi, thử lại không giới hạn cho đến khi đúng */
export function useAnswerAttempt(
  correctIndex: number,
  onSolved?: (firstTry: boolean) => void,
): AnswerAttempt {
  const [wrongPicks, setWrongPicks] = useState<number[]>([])
  const [solved, setSolved] = useState(false)

  function choose(index: number) {
    if (solved || wrongPicks.includes(index)) return
    if (index === correctIndex) {
      setSolved(true)
      onSolved?.(wrongPicks.length === 0)
    } else {
      setWrongPicks(picks => [...picks, index])
    }
  }

  return { wrongPicks, solved, firstTry: solved && wrongPicks.length === 0, choose }
}
