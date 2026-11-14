'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { STARS_AFTER_RETRY, STARS_FIRST_TRY } from '@/lib/rewards'
import SpeakButton from '@/components/learn/SpeakButton'
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
        {/* Có loa đọc lời giải và lời nhắc, vì bé lớp 1 chưa tự đọc được hết; loa nằm ngay sau chữ, chữ dài hoặc màn hẹp thì loa xuống dòng dưới */}
        {solved ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="min-w-0 text-graphite">
              <strong className="text-leaf">Đúng rồi! </strong>
              {explain}
            </motion.p>
            <SpeakButton text={explain} label="Nghe đọc lời giải" />
          </div>
        ) : (
          hasWrong && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <p className="min-w-0 text-pencil">{wrongHint}</p>
              <SpeakButton text={wrongHint} label="Nghe đọc lời nhắc" />
            </div>
          )
        )}
      </div>

      {solved && children}
    </>
  )
}
