'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const grades = [
  { g: 1, emoji: '🐣', label: 'Lớp 1', color: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  { g: 2, emoji: '🐸', label: 'Lớp 2', color: '#D1FAE5', border: '#34D399', text: '#065F46' },
  { g: 3, emoji: '🦊', label: 'Lớp 3', color: '#DBEAFE', border: '#60A5FA', text: '#1E40AF' },
  { g: 4, emoji: '🦁', label: 'Lớp 4', color: '#EDE9FE', border: '#A78BFA', text: '#4C1D95' },
  { g: 5, emoji: '🦅', label: 'Lớp 5', color: '#FFE4E6', border: '#FB7185', text: '#9F1239' },
]

const badges = [
  { emoji: '⭐', label: 'Ngôi sao đầu tiên', earned: true },
  { emoji: '🔥', label: '3 ngày liên tiếp', earned: true },
  { emoji: '🎯', label: '10 bài đúng', earned: true },
  { emoji: '🏆', label: 'Hoàn thành lớp 1', earned: false },
  { emoji: '🚀', label: 'Siêu sao tuần', earned: false },
]

const recentTopics = [
  { emoji: '➕', title: 'Cộng trừ trong 20', grade: 'Lớp 1', progress: 75, href: '/math/1/cong-tru-20' },
  { emoji: '✖️', title: 'Bảng nhân 2, 3', grade: 'Lớp 2', progress: 20, href: '/math/2/bang-nhan-2' },
]

export default function DashboardPage() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>

      {/* HEADER */}
      <header style={{ background: 'var(--surface)', borderBottom: '1.5px solid var(--border)' }}
        className="sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="text-3xl">🧮</span>
            <span style={{ color: 'var(--indigo)', fontWeight: 900, fontSize: '1.3rem' }}>
              So<span style={{ color: 'var(--coral)' }}>Learn</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--amber-light)', borderRadius: 12,
              padding: '7px 14px',
            }}>
              <span>⭐</span>
              <span style={{ fontWeight: 800, color: '#92400E' }}>128</span>
            </div>
            <div style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--indigo), #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 900, fontSize: '1rem', cursor: 'pointer',
            }}>B</div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-10">

        {/* GREETING */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 style={{ fontWeight: 900, fontSize: '1.9rem', color: 'var(--text)' }}>
            Chào buổi sáng, Bé! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginTop: 6 }}>
            Hôm nay học Toán gì nào? 🎯
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {/* STREAK CARD */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{
              background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
              borderRadius: 20, padding: '24px', color: '#fff',
            }}>
            <p style={{ fontWeight: 700, opacity: 0.85, fontSize: '0.85rem', marginBottom: 6 }}>🔥 Chuỗi liên tiếp</p>
            <p style={{ fontWeight: 900, fontSize: '2.5rem', lineHeight: 1 }}>3 ngày</p>
            <p style={{ opacity: 0.8, fontWeight: 600, fontSize: '0.8rem', marginTop: 8 }}>Tiếp tục để giữ chuỗi nhé!</p>
          </motion.div>

          {/* DAILY PROGRESS */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="card p-6">
            <p style={{ fontWeight: 700, color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 6 }}>
              📋 Mục tiêu hôm nay
            </p>
            <p style={{ fontWeight: 900, fontSize: '2.5rem', lineHeight: 1, color: 'var(--indigo)' }}>5<span style={{ fontSize: '1.2rem', opacity: 0.5 }}>/10</span></p>
            <div style={{ background: 'var(--border)', borderRadius: 99, height: 8, marginTop: 12 }}>
              <div style={{ background: 'var(--indigo)', borderRadius: 99, height: 8, width: '50%' }} />
            </div>
            <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', marginTop: 6 }}>5 bài còn lại</p>
          </motion.div>

          {/* STARS */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{
              background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
              borderRadius: 20, padding: '24px', color: '#fff',
            }}>
            <p style={{ fontWeight: 700, opacity: 0.85, fontSize: '0.85rem', marginBottom: 6 }}>⭐ Sao tích lũy</p>
            <p style={{ fontWeight: 900, fontSize: '2.5rem', lineHeight: 1 }}>128</p>
            <p style={{ opacity: 0.8, fontWeight: 600, fontSize: '0.8rem', marginTop: 8 }}>+12 sao tuần này</p>
          </motion.div>
        </div>

        {/* GRADE PICKER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="mb-10">
          <h2 style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--text)', marginBottom: 16 }}>
            📚 Chọn lớp học
          </h2>
          <div className="flex flex-wrap gap-3">
            {grades.map((g, i) => (
              <motion.div key={g.g}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.06 }}>
                <Link href={`/math/${g.g}`} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: g.color, border: `2px solid ${g.border}`,
                  borderRadius: 14, padding: '12px 20px',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}
                  className="hover:-translate-y-1 hover:shadow-md transition-all">
                  <span style={{ fontSize: 28 }}>{g.emoji}</span>
                  <span style={{ fontWeight: 800, color: g.text }}>{g.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CONTINUE LEARNING */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mb-10">
          <h2 style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--text)', marginBottom: 16 }}>
            ▶️ Học tiếp
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentTopics.map(t => (
              <Link key={t.title} href={t.href} style={{ textDecoration: 'none' }}>
                <div className="card p-5 hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="flex items-center gap-4">
                    <div style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: 'var(--indigo-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 26, flexShrink: 0,
                    }}>{t.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontWeight: 800, color: 'var(--text)', fontSize: '0.95rem' }}>{t.title}</p>
                      <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', marginTop: 2 }}>{t.grade}</p>
                      <div style={{ background: 'var(--border)', borderRadius: 99, height: 6, marginTop: 8 }}>
                        <div style={{
                          background: 'var(--indigo)', borderRadius: 99,
                          height: 6, width: `${t.progress}%`,
                        }} />
                      </div>
                    </div>
                    <span style={{ color: 'var(--indigo)', fontWeight: 800, fontSize: '1.2rem' }}>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* BADGES */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 style={{ fontWeight: 900, fontSize: '1.3rem', color: 'var(--text)', marginBottom: 16 }}>
            🏆 Huy hiệu
          </h2>
          <div className="flex flex-wrap gap-3">
            {badges.map(b => (
              <div key={b.label} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: b.earned ? 'var(--amber-light)' : 'var(--bg)',
                border: `2px solid ${b.earned ? '#F59E0B' : 'var(--border)'}`,
                borderRadius: 14, padding: '10px 16px',
                opacity: b.earned ? 1 : 0.45,
              }}>
                <span style={{ fontSize: 22 }}>{b.earned ? b.emoji : '🔒'}</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: b.earned ? '#92400E' : 'var(--text-muted)' }}>
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
