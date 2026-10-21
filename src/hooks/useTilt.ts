'use client'

import { useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { useSyncExternalStore } from 'react'

export interface Tilt {
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  onPointerMove: (event: React.PointerEvent<HTMLElement>) => void
  onPointerLeave: () => void
}

const subscribeNoop = () => () => {}
const hasFinePointer = () => window.matchMedia('(pointer: fine)').matches

/** Nghiêng nhẹ một vật theo con trỏ chuột. Tắt trên màn hình cảm ứng và khi giảm chuyển động. */
export function useTilt(maxDeg = 3): Tilt {
  const reduceMotion = useReducedMotion()
  const finePointer = useSyncExternalStore(subscribeNoop, hasFinePointer, () => false)
  const enabled = finePointer && !reduceMotion

  // Vị trí con trỏ so với tâm, từ -0.5 đến 0.5
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const spring = { stiffness: 110, damping: 18, mass: 0.6 }
  const sx = useSpring(x, spring)
  const sy = useSpring(y, spring)
  const rotateY = useTransform(sx, v => v * maxDeg * 2)
  const rotateX = useTransform(sy, v => -v * maxDeg * 2)

  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    if (!enabled) return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left) / rect.width - 0.5)
    y.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  function onPointerLeave() {
    x.set(0)
    y.set(0)
  }

  return { rotateX, rotateY, onPointerMove, onPointerLeave }
}
