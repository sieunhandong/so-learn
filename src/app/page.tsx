'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const grades = [
  { g: 1, label: 'Lớp 1', emoji: '🐣', bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  { g: 2, label: 'Lớp 2', emoji: '🐸', bg: '#D1FAE5', border: '#34D399', text: '#065F46' },
  { g: 3, label: 'Lớp 3', emoji: '🦊', bg: '#DBEAFE', border: '#60A5FA', text: '#1E40AF' },
  { g: 4, label: 'Lớp 4', emoji: '🦁', bg: '#EDE9FE', border: '#A78BFA', text: '#4C1D95' },
  { g: 5, label: 'Lớp 5', emoji: '🦅', bg: '#FFE4E6', border: '#FB7185', text: '#9F1239' },
]

const features = [
  { icon: '🎯', title: 'Bài tập tương tác',     desc: 'Trắc nghiệm, kéo thả với hình ảnh minh họa sinh động.', bg: '#EDEDFF' },
  { icon: '🔊', title: 'Đọc đề bằng giọng nói', desc: 'Hệ thống tự đọc câu hỏi — bé chưa đọc thông vẫn học được.', bg: '#FEF3C7' },
  { icon: '⭐', title: 'Thu sao & huy hiệu',     desc: 'Làm đúng để nhận sao vàng, mở khóa huy hiệu đặc biệt.', bg: '#D1FAE5' },
  { icon: '📊', title: 'Báo cáo phụ huynh',     desc: 'Xem bé học bao lâu, đúng bao nhiêu bài — mỗi ngày.', bg: '#E0F2FE' },
]

const topics = [
  { emoji: '➕', label: 'Phép cộng',  sub: 'Lớp 1–2' },
  { emoji: '✖️', label: 'Bảng nhân',  sub: 'Lớp 2–3' },
  { emoji: '½',  label: 'Phân số',    sub: 'Lớp 3–4' },
  { emoji: '📐', label: 'Hình học',   sub: 'Lớp 3–5' },
  { emoji: '0.5',label: 'Thập phân',  sub: 'Lớp 5'   },
  { emoji: '📈', label: 'Thống kê',   sub: 'Lớp 5'   },
]

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay },
})

const px = '5vw'

export default function HomePage() {
  return (
    <div style={{ background: 'var(--bg)', width: '100%', minHeight: '100vh' }}>

      {/* ── NAV ── */}
      <header style={{
        background: 'var(--surface)', borderBottom: '1.5px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50, width: '100%',
      }}>
        <div style={{ padding: `14px ${px}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <span style={{ fontSize: 28 }}>🧮</span>
            <span style={{ fontWeight: 900, fontSize: '1.4rem', color: 'var(--indigo)' }}>
              So<span style={{ color: 'var(--coral)' }}>Learn</span>
            </span>
          </Link>
          <nav style={{ display: 'flex', gap: 32 }}>
            {['Trang chủ','Các lớp','Chủ đề','Xếp hạng'].map(n => (
              <a key={n} href="#" style={{ color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none' }}>{n}</a>
            ))}
          </nav>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/auth/login" style={{
              padding: '10px 20px', borderRadius: 12, fontWeight: 700,
              color: 'var(--indigo)', border: '2px solid var(--border)',
              textDecoration: 'none', fontSize: '0.92rem',
            }}>Đăng nhập</Link>
            <Link href="/auth/register" style={{
              padding: '10px 20px', borderRadius: 12, fontWeight: 800,
              background: 'var(--indigo)', color: '#fff',
              textDecoration: 'none', fontSize: '0.92rem',
            }}>Bắt đầu miễn phí →</Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{
        width: '100%', padding: `80px ${px} 64px`,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        alignItems: 'center', gap: '6vw',
      }}>
        <motion.div {...up(0)}>
          <span style={{
            display: 'inline-block', background: 'var(--indigo-light)', color: 'var(--indigo)',
            borderRadius: 999, padding: '6px 18px', fontWeight: 700, fontSize: '0.85rem', marginBottom: 22,
          }}>✨ Miễn phí · Không quảng cáo · An toàn cho bé</span>

          <h1 style={{ fontWeight: 900, fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)', lineHeight: 1.2, color: 'var(--text)', marginBottom: 18 }}>
            Học Toán thật vui<br />
            <span style={{ color: 'var(--indigo)' }}>cho bé tiểu học</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.8, marginBottom: 36 }}>
            Bài tập có hình ảnh, âm thanh hướng dẫn và hệ thống thu sao vàng —
            giúp bé học Toán mỗi ngày mà không chán.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{
              padding: '15px 32px', borderRadius: 14, fontWeight: 800,
              background: 'var(--indigo)', color: '#fff', textDecoration: 'none',
              fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(91,91,214,0.35)',
            }}>🚀 Học ngay!</Link>
            <a href="#grades" style={{
              padding: '14px 28px', borderRadius: 14, fontWeight: 700,
              border: '2px solid var(--border)', color: 'var(--indigo)',
              textDecoration: 'none', fontSize: '1.05rem', background: 'var(--surface)',
            }}>Xem các lớp</a>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.83rem', fontWeight: 600, marginTop: 22 }}>
            🎓 Bám sát chương trình Bộ GD&ĐT · Lớp 1 → Lớp 5
          </p>
        </motion.div>

        <motion.div {...up(0.15)} className="float" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            width: 'min(380px, 38vw)', height: 'min(380px, 38vw)', borderRadius: '50%',
            background: 'linear-gradient(135deg, #EDEDFF 0%, #E0F2FE 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 'min(120px, 12vw)', position: 'relative',
            boxShadow: '0 24px 72px rgba(91,91,214,0.13)',
          }}>
            🧮
            <span style={{ position: 'absolute', top: '8%', right: '8%', fontSize: 'min(48px,4.5vw)' }}>⭐</span>
            <span style={{ position: 'absolute', bottom: '10%', left: '8%', fontSize: 'min(40px,3.8vw)' }}>🎯</span>
            <span style={{ position: 'absolute', top: '28%', left: '-2%', fontSize: 'min(30px,2.8vw)' }}>✨</span>
          </div>
        </motion.div>
      </section>

      {/* ── GRADE PICKER ── */}
      <section id="grades" style={{ width: '100%', background: 'var(--surface)', padding: `64px ${px}`, borderTop: '1.5px solid var(--border)', borderBottom: '1.5px solid var(--border)' }}>
        <motion.div {...up(0.05)} style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--text)', marginBottom: 10 }}>
            Bé đang học lớp mấy? 📚
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '1rem' }}>
            Chọn lớp — nội dung được điều chỉnh phù hợp lứa tuổi
          </p>
        </motion.div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          {grades.map((g, i) => (
            <motion.div key={g.g} {...up(0.1 + i * 0.07)}>
              <Link href={`/math/${g.g}`} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                background: g.bg, border: `2.5px solid ${g.border}`,
                borderRadius: 22, padding: '26px 36px', minWidth: 130,
                textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 36px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}
              >
                <span style={{ fontSize: 50 }}>{g.emoji}</span>
                <span style={{ fontWeight: 800, color: g.text, fontSize: '1.05rem' }}>{g.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ width: '100%', padding: `64px ${px}` }}>
        <motion.div {...up(0)} style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--text)' }}>
            Tại sao bé thích học ở đây? 🌟
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div key={f.title} {...up(0.07 + i * 0.08)} style={{
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: 22, padding: '28px 24px',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.transform = '' }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 16, background: f.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, marginBottom: 18,
              }}>{f.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: 10, color: 'var(--text)' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, lineHeight: 1.7 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TOPICS ── */}
      <section style={{ width: '100%', background: 'var(--indigo-light)', padding: `64px ${px}`, borderTop: '1.5px solid #D4D4F7', borderBottom: '1.5px solid #D4D4F7' }}>
        <motion.div {...up(0)} style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontWeight: 900, fontSize: '2rem', color: 'var(--indigo-dark)' }}>
            Các chủ đề nổi bật ✏️
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20 }}>
          {topics.map((t, i) => (
            <motion.div key={t.label} {...up(0.05 * i)} style={{
              background: 'var(--surface)', border: '1.5px solid var(--border)',
              borderRadius: 20, padding: '24px 16px', textAlign: 'center', cursor: 'pointer',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = ''; (e.currentTarget as HTMLElement).style.transform = '' }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>{t.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)', marginBottom: 6 }}>{t.label}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.sub}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ width: '100%', padding: `72px ${px}` }}>
        <motion.div {...up(0.1)} style={{
          width: '100%',
          background: 'linear-gradient(135deg, var(--indigo) 0%, #7C3AED 100%)',
          borderRadius: 28, padding: '64px 48px', textAlign: 'center', color: '#fff',
        }}>
          <div style={{ fontSize: 56, marginBottom: 18 }}>🎉</div>
          <h2 style={{ fontWeight: 900, fontSize: '2.2rem', marginBottom: 14 }}>Hoàn toàn miễn phí</h2>
          <p style={{ fontSize: '1.05rem', opacity: 0.88, fontWeight: 600, marginBottom: 32 }}>
            Không quảng cáo, không link ngoài. Phụ huynh yên tâm, bé tập trung học.
          </p>
          <Link href="/auth/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff', color: 'var(--indigo)',
            fontWeight: 800, fontSize: '1.05rem',
            borderRadius: 14, padding: '15px 36px',
            textDecoration: 'none',
          }}>Tạo tài khoản ngay →</Link>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ width: '100%', background: 'var(--surface)', borderTop: '1.5px solid var(--border)', padding: `28px ${px}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🧮</span>
            <span style={{ fontWeight: 900, color: 'var(--indigo)' }}>SoLearn</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.87rem' }}>
            © 2025 SoLearn · Học toán vui mỗi ngày
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Điều khoản','Bảo mật','Liên hệ'].map(l => (
              <a key={l} href="#" style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.87rem', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
