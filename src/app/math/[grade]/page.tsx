'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'

export const dynamic = 'force-dynamic'

const gradeConfig: Record<number, { emoji: string; name: string; color: string; light: string; text: string; border: string }> = {
  1: { emoji: '🐣', name: 'Lớp 1', color: '#F59E0B', light: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  2: { emoji: '🐸', name: 'Lớp 2', color: '#34D399', light: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  3: { emoji: '🦊', name: 'Lớp 3', color: '#60A5FA', light: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  4: { emoji: '🦁', name: 'Lớp 4', color: '#A78BFA', light: '#EDE9FE', text: '#4C1D95', border: '#C4B5FD' },
  5: { emoji: '🦅', name: 'Lớp 5', color: '#FB7185', light: '#FFE4E6', text: '#9F1239', border: '#FCA5A5' },
}

const topicsByGrade: Record<number, { id: string; title: string; emoji: string; desc: string; total: number; done: number }[]> = {
  1: [
    { id: 'dem-so', title: 'Đếm số 1–100', emoji: '🔢', desc: 'Nhận biết, đọc và viết số', total: 10, done: 10 },
    { id: 'cong-tru-10', title: 'Cộng trừ trong 10', emoji: '➕', desc: 'Phép tính cơ bản trong 10', total: 12, done: 12 },
    { id: 'cong-tru-20', title: 'Cộng trừ trong 20', emoji: '🧮', desc: 'Mở rộng phép tính đến 20', total: 12, done: 4 },
    { id: 'hinh-hoc', title: 'Hình học cơ bản', emoji: '🔷', desc: 'Hình vuông, tròn, tam giác', total: 8, done: 0 },
  ],
  2: [
    { id: 'cong-tru-co-nho', title: 'Cộng trừ có nhớ', emoji: '➕', desc: 'Phép tính có nhớ và vay', total: 15, done: 5 },
    { id: 'bang-nhan-2', title: 'Bảng nhân 2, 3', emoji: '✖️', desc: 'Thuộc bảng nhân 2 và 3', total: 10, done: 0 },
    { id: 'bang-nhan-4', title: 'Bảng nhân 4, 5', emoji: '✖️', desc: 'Thuộc bảng nhân 4 và 5', total: 10, done: 0 },
    { id: 'do-luong', title: 'Đo lường cơ bản', emoji: '📏', desc: 'cm, kg, lít cơ bản', total: 8, done: 0 },
  ],
  3: [
    { id: 'nhan-chia', title: 'Nhân chia cơ bản', emoji: '✖️', desc: 'Nhân chia số có 2–3 chữ số', total: 15, done: 0 },
    { id: 'phan-so', title: 'Phân số đơn giản', emoji: '½', desc: 'Khái niệm và so sánh phân số', total: 10, done: 0 },
    { id: 'chu-vi', title: 'Chu vi hình học', emoji: '📐', desc: 'Chu vi hình chữ nhật, vuông', total: 8, done: 0 },
    { id: 'thoi-gian', title: 'Thời gian & Lịch', emoji: '⏰', desc: 'Giờ, phút, ngày, tháng', total: 8, done: 0 },
  ],
  4: [
    { id: 'phan-so-4', title: 'Phân số nâng cao', emoji: '½', desc: 'Cộng trừ nhân chia phân số', total: 15, done: 0 },
    { id: 'goc', title: 'Góc và đường thẳng', emoji: '📐', desc: 'Góc vuông, nhọn, tù', total: 10, done: 0 },
    { id: 'dien-tich', title: 'Diện tích hình chữ nhật', emoji: '🟦', desc: 'Tính diện tích cơ bản', total: 10, done: 0 },
    { id: 'so-lon', title: 'Số lớn đến triệu', emoji: '🔢', desc: 'Đọc viết số đến hàng triệu', total: 12, done: 0 },
  ],
  5: [
    { id: 'so-thap-phan', title: 'Số thập phân', emoji: '0.5', desc: 'Đọc, viết và tính toán số thập phân', total: 15, done: 0 },
    { id: 'ti-le', title: 'Tỉ lệ và tỉ số', emoji: '📊', desc: 'Bài toán tỉ lệ thuận, nghịch', total: 10, done: 0 },
    { id: 'the-tich', title: 'Thể tích hình hộp', emoji: '📦', desc: 'Tính thể tích hình hộp chữ nhật', total: 10, done: 0 },
    { id: 'thong-ke', title: 'Thống kê đơn giản', emoji: '📈', desc: 'Đọc biểu đồ và bảng số liệu', total: 8, done: 0 },
  ],
}

export default function GradePage() {
  const params = useParams()
  const grade = parseInt(params.grade as string)
  const cfg = gradeConfig[grade] ?? gradeConfig[1]
  const topics = topicsByGrade[grade] ?? topicsByGrade[1]
  const totalDone = topics.reduce((a, t) => a + t.done, 0)
  const totalAll = topics.reduce((a, t) => a + t.total, 0)

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* HEADER */}
      <header style={{ background: 'var(--surface)', borderBottom: '1.5px solid var(--border)' }}
        className="sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center gap-3">
          <Link href="/dashboard" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--bg)', border: '1.5px solid var(--border)',
            textDecoration: 'none', fontSize: '1.1rem', color: 'var(--text)',
            transition: 'all 0.15s',
          }}
            className="hover:border-indigo-400 transition">←</Link>
          <span className="text-2xl">🧮</span>
          <span style={{ color: 'var(--indigo)', fontWeight: 900, fontSize: '1.2rem' }}>
            So<span style={{ color: 'var(--coral)' }}>Learn</span>
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10">
        {/* GRADE BANNER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: `linear-gradient(135deg, ${cfg.color}22 0%, ${cfg.border}33 100%)`,
            border: `2px solid ${cfg.border}`,
            borderRadius: 24, padding: '28px 32px', marginBottom: 32,
          }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-5">
              <span style={{ fontSize: 64 }}>{cfg.emoji}</span>
              <div>
                <h1 style={{ fontWeight: 900, fontSize: '2rem', color: cfg.text }}>{cfg.name}</h1>
                <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginTop: 4 }}>
                  {topics.length} chủ đề · {totalAll} bài học
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 900, fontSize: '1.8rem', color: cfg.text }}>
                {Math.round((totalDone / totalAll) * 100)}%
              </p>
              <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>đã hoàn thành</p>
            </div>
          </div>
          <div style={{ background: '#fff', borderRadius: 99, height: 10, marginTop: 20 }}>
            <div style={{
              background: cfg.color, borderRadius: 99,
              height: 10, width: `${(totalDone / totalAll) * 100}%`,
              transition: 'width 0.6s ease',
            }} />
          </div>
        </motion.div>

        {/* TOPICS */}
        <h2 style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--text)', marginBottom: 16 }}>
          Chọn chủ đề 📖
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {topics.map((t, i) => {
            const pct = Math.round((t.done / t.total) * 100)
            const isComplete = pct === 100
            const isLocked = i > 0 && topics[i - 1].done === 0

            return (
              <motion.div key={t.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}>
                <Link href={isLocked ? '#' : `/math/${grade}/${t.id}`}
                  style={{ textDecoration: 'none', opacity: isLocked ? 0.5 : 1 }}>
                  <div className={`card p-5 transition-all ${isLocked ? 'cursor-not-allowed' : 'hover:shadow-md hover:-translate-y-1 cursor-pointer'}`}>
                    <div className="flex items-start gap-4">
                      <div style={{
                        width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                        background: isComplete ? 'var(--mint-light)' : isLocked ? 'var(--bg)' : 'var(--indigo-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 28, border: '1.5px solid var(--border)',
                      }}>
                        {isLocked ? '🔒' : isComplete ? '✅' : t.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p style={{ fontWeight: 800, color: 'var(--text)', fontSize: '1rem' }}>{t.title}</p>
                          {isComplete && (
                            <span style={{
                              background: 'var(--mint-light)', color: '#065F46',
                              borderRadius: 99, padding: '2px 10px',
                              fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                            }}>Hoàn thành</span>
                          )}
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.82rem', marginTop: 3 }}>
                          {t.desc} · {t.total} bài
                        </p>
                        <div style={{ background: 'var(--border)', borderRadius: 99, height: 6, marginTop: 10 }}>
                          <div style={{
                            background: isComplete ? 'var(--mint)' : 'var(--indigo)',
                            borderRadius: 99, height: 6, width: `${pct}%`,
                          }} />
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', marginTop: 4 }}>
                          {t.done}/{t.total} bài · {pct}%
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
