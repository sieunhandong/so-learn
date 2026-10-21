'use client'

import { motion } from 'framer-motion'
import { useTilt } from '@/hooks/useTilt'
import { FACE_CAMERA, S, STAGE, Tower, type CubeTone } from './Cube3D'

interface TagProps {
  x: number
  y: number
  /** Độ cao so với mặt sân, px */
  z: number
  children: React.ReactNode
  /** Có thì nhãn bật lên sau khoảng trễ này (giây) */
  popDelay?: number
  className?: string
}

/** Nhãn lơ lửng, luôn quay mặt về phía người xem */
function Tag({ x, y, z, children, popDelay, className = '' }: TagProps) {
  const pill = `grid min-w-14 place-items-center rounded-2xl px-3 py-1 font-display text-4xl font-extrabold leading-tight ${className}`
  return (
    <div className="absolute grid place-items-center transform-3d" style={{ left: x * S, top: y * S, width: S, height: S }}>
      <div style={{ transform: `translateZ(${z}px) ${FACE_CAMERA}` }}>
        {popDelay === undefined ? (
          <div className={pill}>{children}</div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: popDelay, type: 'spring', stiffness: 420, damping: 18 }}
            className={pill}
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  )
}

interface CubeDioramaProps {
  first: number
  second: number
  solved: boolean
}

const tagCard = 'bg-white text-ink-deep shadow-[0_10px_18px_-8px_rgb(42_22_115/0.45)] ring-2 ring-grid'

/**
 * Sân xếp khối minh họa phép cộng: tháp thứ nhất, tháp thứ hai, và ô đáp án.
 * Khi bé trả lời đúng, các khối rơi xuống xếp thành tháp đáp án.
 */
export default function CubeDiorama({ first, second, solved }: CubeDioramaProps) {
  const tilt = useTilt(4)
  const total = first + second
  const answerCubes: CubeTone[] = [...Array<CubeTone>(first).fill('ink'), ...Array<CubeTone>(second).fill('sun')]

  return (
    <div
      aria-hidden
      onPointerMove={tilt.onPointerMove}
      onPointerLeave={tilt.onPointerLeave}
      className="relative flex h-[330px] items-end justify-center pb-10 perspective-[1600px] sm:h-[420px] lg:h-[560px] lg:justify-end lg:pb-24 lg:pr-4"
    >
      {/* Quầng sáng tím nhạt in xuống nền dưới sân khối */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-2/3 w-[130%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(123_93_242/0.22),transparent)] lg:left-[60%]" />

      <motion.div style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }} className="origin-bottom scale-[0.58] transform-3d sm:scale-75 lg:scale-100">
        <div className="relative transform-3d" style={{ width: 7 * S, height: 3.2 * S, transform: STAGE }}>
          {/* Bóng của cả sân in xuống nền */}
          <div className="absolute -inset-6 -translate-z-10 rounded-[40px] bg-ink-deep/25 blur-2xl" />

          {/* Tấm thảm ô li, có độ dày ở mép trước và mép trái */}
          <div className="absolute inset-0 rounded-[14px] border-2 border-grid bg-oli transform-3d">
            <div className="absolute inset-x-0 bottom-0 h-4 origin-bottom rotate-x-90 rounded-b-md bg-[#C9C1F1]" />
            <div className="absolute inset-y-0 left-0 w-4 origin-left rotate-y-90 rounded-l-md bg-[#B3A8EA]" />
          </div>

          <Tower x={0.7} y={1.1} cubes={Array<CubeTone>(first).fill('ink')} startDelay={0.15} />
          <Tower x={2.55} y={1.1} cubes={Array<CubeTone>(second).fill('sun')} startDelay={0.5} />

          {/* Ô đáp án: viền nét đứt khi chưa trả lời, tháp khối khi đã đúng */}
          {solved ? (
            <Tower x={4.9} y={1.1} cubes={answerCubes} startDelay={0.05} />
          ) : (
            <div
              className="absolute translate-z-[1px] rounded-md border-[3px] border-dashed border-ink/45 bg-white/60"
              style={{ left: 4.9 * S, top: 1.1 * S, width: S, height: S }}
            />
          )}

          <Tag x={0.7} y={1.1} z={first * S + 46} className={tagCard}>
            {first}
          </Tag>
          <Tag x={1.62} y={1.1} z={58} className="text-ink">
            +
          </Tag>
          <Tag x={2.55} y={1.1} z={second * S + 46} className={tagCard}>
            {second}
          </Tag>
          <Tag x={3.72} y={1.1} z={58} className="text-ink">
            =
          </Tag>
          {solved ? (
            <Tag x={4.9} y={1.1} z={total * S + 46} popDelay={0.75} className="bg-leaf text-white shadow-[0_10px_18px_-8px_rgb(31_154_91/0.6)]">
              {total}
            </Tag>
          ) : (
            <Tag x={4.9} y={1.1} z={74} className="border-[3px] border-dashed border-pen bg-white text-pen motion-safe:animate-bob">
              ?
            </Tag>
          )}
        </div>
      </motion.div>
    </div>
  )
}
