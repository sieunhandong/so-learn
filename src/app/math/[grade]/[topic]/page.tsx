'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface Question {
  id: number
  question: string
  visual: string
  options: string[]
  correct: number
  explain: string
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Có 5 quả táo, thêm 3 quả nữa. Tất cả bao nhiêu quả?',
    visual: '🍎🍎🍎🍎🍎 + 🍎🍎🍎',
    options: ['6', '7', '8', '9'],
    correct: 2,
    explain: '5 + 3 = 8 quả táo',
  },
  {
    id: 2,
    question: 'Tính: 7 + 4 = ?',
    visual: '🔢',
    options: ['10', '11', '12', '13'],
    correct: 1,
    explain: '7 + 4 = 11',
  },
  {
    id: 3,
    question: '10 con bướm bay đi 3 con. Còn lại mấy con?',
    visual: '🦋🦋🦋🦋🦋🦋🦋 ✂️ 🦋🦋🦋',
    options: ['5', '6', '7', '8'],
    correct: 2,
    explain: '10 − 3 = 7 con bướm',
  },
  {
    id: 4,
    question: 'Số nào lớn hơn?',
    visual: '15  vs  12',
    options: ['12', '15', 'Bằng nhau', 'Không biết'],
    correct: 1,
    explain: '15 > 12 vì 15 có nhiều hơn',
  },
  {
    id: 5,
    question: 'Tính: 6 + 6 = ?',
    visual: '🎲🎲🎲🎲🎲🎲 + 🎲🎲🎲🎲🎲🎲',
    options: ['10', '11', '12', '13'],
    correct: 2,
    explain: '6 + 6 = 12',
  },
]

const optionStyle = [
  { bg: '#DBEAFE', border: '#60A5FA', text: '#1E40AF' },
  { bg: '#D1FAE5', border: '#34D399', text: '#065F46' },
  { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  { bg: '#FFE4E6', border: '#FB7185', text: '#9F1239' },
]

export default function ExercisePage() {
  const params = useParams()
  const grade = params.grade as string
  const topic = params.topic as string

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [showPop, setShowPop] = useState(false)

  const q = questions[current]
  const total = questions.length

  function select(idx: number) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === q.correct) {
      setScore(s => s + 1)
      setShowPop(true)
      setTimeout(() => setShowPop(false), 700)
    }
  }

  function next() {
    if (current + 1 >= total) { setDone(true); return }
    setCurrent(c => c + 1)
    setSelected(null)
    setAnswered(false)
  }

  function restart() {
    setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setDone(false)
  }

  const topicLabel = topic.replace(/-/g, ' ')
  const stars = score >= total * 0.8 ? 3 : score >= total * 0.5 ? 2 : 1

  /* ── RESULT SCREEN ── */
  if (done) return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="card" style={{ padding: '48px 36px', textAlign: 'center', maxWidth: 420, width: '100%' }}>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
          style={{ fontSize: 80, marginBottom: 16 }}>
          {stars === 3 ? '🏆' : stars === 2 ? '🥈' : '🎖️'}
        </motion.div>

        <h1 style={{ fontWeight: 900, fontSize: '1.8rem', color: 'var(--text)', marginBottom: 8 }}>
          {stars === 3 ? 'Xuất sắc!' : stars === 2 ? 'Giỏi lắm!' : 'Cố lên nhé!'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 24 }}>
          Bé đã hoàn thành bài luyện tập 🎉
        </p>

        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2].map(i => (
            <motion.span key={i} initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.12, type: 'spring' }}
              style={{ fontSize: 40, filter: i < stars ? 'none' : 'grayscale(1)', opacity: i < stars ? 1 : 0.25 }}>
              ⭐
            </motion.span>
          ))}
        </div>

        <div style={{
          background: 'var(--indigo-light)', borderRadius: 16,
          padding: '20px', marginBottom: 24,
        }}>
          <p style={{ fontWeight: 900, fontSize: '2.5rem', color: 'var(--indigo)', lineHeight: 1 }}>
            {score}<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/{total}</span>
          </p>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.9rem', marginTop: 4 }}>câu trả lời đúng</p>
        </div>

        <div className="flex gap-3">
          <button onClick={restart} className="btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>
            🔄 Làm lại
          </button>
          <Link href={`/math/${grade}`} className="btn-primary" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>
            📚 Chủ đề khác
          </Link>
        </div>
      </motion.div>
    </div>
  )

  /* ── QUIZ SCREEN ── */
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <header style={{ background: 'var(--surface)', borderBottom: '1.5px solid var(--border)' }}>
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href={`/math/${grade}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--bg)', border: '1.5px solid var(--border)',
            textDecoration: 'none', color: 'var(--text)', fontSize: '1.1rem',
          }}>←</Link>
          <span style={{ fontWeight: 800, color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'capitalize' }}>
            {topicLabel}
          </span>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--amber-light)', borderRadius: 10, padding: '6px 12px',
          }}>
            <span>⭐</span>
            <span style={{ fontWeight: 800, color: '#92400E' }}>{score * 20}</span>
          </div>
        </div>
      </header>

      {/* PROGRESS */}
      <div style={{ background: 'var(--surface)', borderBottom: '1.5px solid var(--border)', padding: '10px 20px' }}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0 }}>
            {current + 1} / {total}
          </span>
          <div style={{ flex: 1, background: 'var(--border)', borderRadius: 99, height: 8 }}>
            <motion.div
              animate={{ width: `${(current / total) * 100}%` }}
              transition={{ duration: 0.4 }}
              style={{ background: 'var(--indigo)', borderRadius: 99, height: 8 }}
            />
          </div>
        </div>
      </div>

      {/* STAR POP */}
      <AnimatePresence>
        {showPop && (
          <motion.div initial={{ scale: 0.5, opacity: 1, y: 0 }} animate={{ scale: 2.5, opacity: 0, y: -80 }}
            exit={{}} transition={{ duration: 0.6 }}
            style={{ position: 'fixed', top: '40%', left: '50%', transform: 'translateX(-50%)', fontSize: 60, pointerEvents: 'none', zIndex: 99 }}>
            ⭐
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN */}
      <main style={{ flex: 1, maxWidth: 640, width: '100%', margin: '0 auto', padding: '32px 20px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={q.id}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.25 }}>

            {/* QUESTION CARD */}
            <div className="card" style={{ padding: '28px', marginBottom: 20, textAlign: 'center' }}>
              <div style={{
                fontSize: '1.8rem', marginBottom: 14, lineHeight: 1.6,
                background: 'var(--indigo-light)', borderRadius: 14, padding: '16px 20px',
                wordBreak: 'break-word',
              }}>
                {q.visual}
              </div>
              <p style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text)', lineHeight: 1.5 }}>
                {q.question}
              </p>
            </div>

            {/* OPTIONS */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {q.options.map((opt, idx) => {
                const s = optionStyle[idx]
                const isCorrect = idx === q.correct
                const isSelected = selected === idx

                let bg = s.bg, border = s.border, text = s.text, scale = 1
                if (answered) {
                  if (isCorrect) { bg = '#D1FAE5'; border = '#34D399'; text = '#065F46' }
                  else if (isSelected) { bg = '#FFE4E6'; border = '#FB7185'; text = '#9F1239' }
                  else { bg = 'var(--bg)'; border = 'var(--border)'; text = 'var(--text-muted)' }
                }

                return (
                  <motion.button key={idx}
                    whileTap={answered ? {} : { scale: 0.96 }}
                    onClick={() => select(idx)}
                    style={{
                      background: bg, border: `2px solid ${border}`, color: text,
                      borderRadius: 16, padding: '18px 12px',
                      fontWeight: 800, fontSize: '1.3rem',
                      cursor: answered ? 'default' : 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                    className={answered ? '' : 'hover:shadow-md hover:-translate-y-0.5'}
                  >
                    {answered && isCorrect && <span>✅</span>}
                    {answered && isSelected && !isCorrect && <span>❌</span>}
                    {opt}
                  </motion.button>
                )
              })}
            </div>

            {/* FEEDBACK */}
            <AnimatePresence>
              {answered && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <div style={{
                    background: selected === q.correct ? 'var(--mint-light)' : 'var(--coral-light)',
                    border: `2px solid ${selected === q.correct ? 'var(--mint)' : 'var(--coral)'}`,
                    borderRadius: 16, padding: '14px 20px', marginBottom: 14, textAlign: 'center',
                  }}>
                    <p style={{ fontWeight: 800, fontSize: '1rem', color: selected === q.correct ? '#065F46' : '#9F1239' }}>
                      {selected === q.correct ? '🎉 Đúng rồi! Bé giỏi quá!' : `😊 Chưa đúng! Đáp án: ${q.options[q.correct]}`}
                    </p>
                    <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      💡 {q.explain}
                    </p>
                  </div>
                  <button onClick={next} className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem', padding: '16px' }}>
                    {current + 1 >= total ? '🏁 Xem kết quả' : 'Câu tiếp theo →'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
