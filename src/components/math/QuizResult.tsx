'use client'

import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import ButtonLink from '@/components/ui/ButtonLink'
import NotebookPage from '@/components/ui/NotebookPage'
import RedStamp from '@/components/ui/RedStamp'
import { StarIcon } from '@/components/ui/Icons'
import { medalCount } from '@/lib/rewards'

interface QuizResultProps {
  topicTitle: string
  total: number
  firstTryCount: number
  stars: number
  backHref: string
  onRestart: () => void
}

const messages = ['', 'Bé đã làm xong cả bài, luyện thêm là giỏi ngay!', 'Giỏi lắm, chỉ còn vài câu phải thử lại thôi.', 'Xuất sắc, gần như câu nào cũng đúng ngay!']

export default function QuizResult({ topicTitle, total, firstTryCount, stars, backHref, onRestart }: QuizResultProps) {
  const medals = medalCount(firstTryCount, total)

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-8 perspective-[1400px]">
      <motion.div
        initial={{ rotateX: 12, y: 24, opacity: 0 }}
        animate={{ rotateX: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <NotebookPage className="text-center">
          <div className="flex justify-center">
            <RedStamp title="Xong bài!" note={`+${stars} sao`} size="lg" />
          </div>
          <p className="mt-4 font-display text-xl font-semibold text-pencil">{topicTitle}</p>
  
          <h1 className="mt-2 text-balance font-display text-3xl font-extrabold leading-tight text-ink-deep md:text-4xl">
            {messages[medals]}
          </h1>
  
          <div className="mt-6 flex justify-center gap-3" aria-label={`${medals} trên 3 ngôi sao`}>
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                aria-hidden
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.35 + i * 0.15, type: 'spring', stiffness: 300 }}
                className={i < medals ? '' : 'opacity-25 grayscale'}
              >
                <StarIcon className="size-14" />
              </motion.span>
            ))}
          </div>
  
          <p className="mt-6 text-lg text-pencil">
            Đúng ngay lần đầu {firstTryCount}/{total} câu. Bé nhận được {stars} sao.
          </p>
  
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={onRestart} variant="paper" className="flex-1">
              Làm lại bài này
            </Button>
            <ButtonLink href={backHref} className="flex-1">
              Chọn bài khác
            </ButtonLink>
          </div>
        </NotebookPage>
      </motion.div>
    </main>
  )
}
