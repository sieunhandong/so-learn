'use client'

import { useState } from 'react'
import { STARS_AFTER_RETRY, STARS_FIRST_TRY } from '@/lib/rewards'

export interface QuizProgress {
  index: number
  stars: number
  firstTryCount: number
  currentSolved: boolean
  finished: boolean
  isLast: boolean
  markSolved: (firstTry: boolean) => void
  next: () => void
  restart: () => void
}

/** Đúng ngay lần đầu được 2 sao, đúng sau khi thử lại được 1 sao */
export function useQuizProgress(total: number): QuizProgress {
  const [index, setIndex] = useState(0)
  const [stars, setStars] = useState(0)
  const [firstTryCount, setFirstTryCount] = useState(0)
  const [currentSolved, setCurrentSolved] = useState(false)
  const [finished, setFinished] = useState(false)

  function markSolved(firstTry: boolean) {
    setCurrentSolved(true)
    setStars(s => s + (firstTry ? STARS_FIRST_TRY : STARS_AFTER_RETRY))
    if (firstTry) setFirstTryCount(c => c + 1)
  }

  function next() {
    if (index + 1 >= total) {
      setFinished(true)
      return
    }
    setIndex(i => i + 1)
    setCurrentSolved(false)
  }

  function restart() {
    setIndex(0)
    setStars(0)
    setFirstTryCount(0)
    setCurrentSolved(false)
    setFinished(false)
  }

  return {
    index,
    stars,
    firstTryCount,
    currentSolved,
    finished,
    isLast: index + 1 >= total,
    markSolved,
    next,
    restart,
  }
}
