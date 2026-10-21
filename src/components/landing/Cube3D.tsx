'use client'

import { motion } from 'framer-motion'

/** Cạnh một khối lập phương, px. Class translate-z-[52px] bên dưới phải khớp giá trị này. */
export const S = 52

// Góc nhìn isometric của sân khối, và phép quay ngược để nhãn luôn quay mặt về phía bé
export const STAGE = 'rotateX(58deg) rotateZ(-40deg)'
export const FACE_CAMERA = 'rotateZ(40deg) rotateX(-58deg)'

export type CubeTone = 'ink' | 'sun' | 'leaf' | 'pen'

// Ánh sáng chiếu từ trên xuống: mặt trên sáng nhất, mặt trước vừa, mặt bên tối nhất
const faces: Record<CubeTone, { top: string; front: string; side: string; nub: string }> = {
  ink: { top: 'bg-[#7B5DF2]', front: 'bg-ink', side: 'bg-[#33208A]', nub: 'bg-[#6142DE]' },
  sun: { top: 'bg-[#FFE38F]', front: 'bg-sun', side: 'bg-[#D99A12]', nub: 'bg-[#FFD24A]' },
  leaf: { top: 'bg-[#4FC98A]', front: 'bg-leaf', side: 'bg-[#147044]', nub: 'bg-[#2FB06E]' },
  pen: { top: 'bg-[#FF7A70]', front: 'bg-pen', side: 'bg-[#A8231B]', nub: 'bg-[#F2554A]' },
}

interface CubeProps {
  tone: CubeTone
  level: number
  delay: number
  /** false: đứng yên ngay tại chỗ, không rơi xuống khi xuất hiện */
  drop?: boolean
}

/** Một khối ghép có núm trên đầu, rơi từ trên cao xuống đúng tầng của nó */
export function Cube({ tone, level, delay, drop = true }: CubeProps) {
  const f = faces[tone]
  return (
    <motion.div
      className="absolute inset-0 transform-3d"
      initial={drop ? { z: (level + 6) * S } : false}
      animate={{ z: level * S }}
      transition={{ delay, type: 'spring', stiffness: 340, damping: 26 }}
    >
      <div className={`absolute inset-0 origin-bottom -rotate-x-90 rounded-[5px] shadow-[inset_0_2px_0_rgb(255_255_255/0.22)] ${f.front}`} />
      <div className={`absolute inset-0 origin-left -rotate-y-90 rounded-[5px] ${f.side}`} />
      <div className={`absolute inset-0 translate-z-[52px] rounded-[6px] shadow-[inset_0_0_0_2px_rgb(255_255_255/0.28)] ${f.top}`}>
        <div className={`absolute inset-[27%] rounded-full shadow-[inset_0_-3px_0_rgb(0_0_0/0.16),0_2px_0_rgb(255_255_255/0.35)] ${f.nub}`} />
      </div>
    </motion.div>
  )
}

interface TowerProps {
  x: number
  y: number
  cubes: CubeTone[]
  startDelay: number
  drop?: boolean
}

export function Tower({ x, y, cubes, startDelay, drop = true }: TowerProps) {
  return (
    <div className="absolute transform-3d" style={{ left: x * S, top: y * S, width: S, height: S }}>
      {cubes.map((tone, level) => (
        <Cube key={level} tone={tone} level={level} delay={startDelay + level * 0.07} drop={drop} />
      ))}
    </div>
  )
}
