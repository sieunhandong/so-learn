'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { STARS_AFTER_RETRY, STARS_FIRST_TRY } from '@/lib/rewards'
import RedStamp from '@/components/ui/RedStamp'

interface SolvedFeedbackProps {
  solved: boolean
  /** Đúng ngay lần đầu, quyết định số sao ghi trên con dấu */
  firstTry: boolean
  /** Ghi số sao nhận được lên con dấu */
  showReward: boolean
  /** Lời giải hiện sau khi làm đúng */
  explain: string
  /** Lời nhắc nhẹ nhàng khi vừa làm sai */
  wrongHint: string
  /** Đã có lần làm sai chưa */
  hasWrong: boolean
  /** Hiện bên dưới sau khi bé làm đúng */
  children?: React.ReactNode
}

/** Phần phản hồi dưới câu hỏi, dùng chung cho các dạng bài: con dấu và lời giải khi đúng, lời nhắc khi sai */
export default function SolvedFeedback({ solved, firstTry, showReward, explain, wrongHint, hasWrong, children }: SolvedFeedbackProps) {
  return (
    <>
      <div aria-live="polite" className={`relative text-lg ${solved ? 'mt-5 min-h-28 pr-32' : 'mt-4'}`}>
        <AnimatePresence>
          {solved && (
            <RedStamp
              title="Đúng!"
              note={showReward ? `+${firstTry ? STARS_FIRST_TRY : STARS_AFTER_RETRY} sao` : 'Giỏi quá'}
              className="absolute -right-2 -top-4 md:-right-6"
            />
          )}
        </AnimatePresence>
        {solved ? (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-graphite">
            <strong className="text-leaf">Đúng rồi! </strong>
            {explain}
          </motion.p>
        ) : (
          hasWrong && <p className="text-pencil">{wrongHint}</p>
        )}
      </div>

      {solved && children}
    </>
  )
}
