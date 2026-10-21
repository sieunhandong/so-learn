import { S, STAGE, Tower, type CubeTone } from './Cube3D'

interface CtaCubesProps {
  towers: { x: number; cubes: CubeTone[] }[]
  className?: string
}

/** Cụm tháp khối nhỏ đứng yên, trang trí hai bên lời mời cuối trang, cùng kiểu với hero */
export default function CtaCubes({ towers, className = '' }: CtaCubesProps) {
  return (
    // Khung cố định, sân khối căn giữa bên trong, để hình chiếu isometric không lệch ra mép section.
    // className quyết định display (ví dụ "hidden xl:grid").
    <div aria-hidden className={`pointer-events-none size-64 place-items-center perspective-[1600px] ${className}`}>
      <div className="translate-y-10 scale-75 transform-3d">
        <div className="relative transform-3d" style={{ width: 3.4 * S, height: 1.6 * S, transform: STAGE }}>
          <div className="absolute -inset-3 -translate-z-6 rounded-[28px] bg-ink-deep/20 blur-xl" />
          {towers.map(t => (
            <Tower key={t.x} x={t.x} y={0.3} cubes={t.cubes} startDelay={0} drop={false} />
          ))}
        </div>
      </div>
    </div>
  )
}
