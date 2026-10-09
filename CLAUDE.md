# So-Learn — Web Học Toán Tiểu Học

## Tổng quan dự án

Web học toán tương tác dành cho học sinh tiểu học lớp 1–5 (6–11 tuổi).
Thiết kế ưu tiên: UI trực quan, nhiều màu sắc, audio hướng dẫn, gamification đơn giản.

**Người dùng chính:**
- Học sinh tiểu học lớp 1–5
- Phụ huynh (quản lý tài khoản, theo dõi tiến độ)

---

## Tech Stack

| Lớp | Công nghệ |
|-----|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Deploy | Vercel (free tier) |
| Package manager | npm |

---

## Lệnh thường dùng

```bash
npm run dev        # Chạy dev server (localhost:3000)
npm run build      # Build production
npm run lint       # Kiểm tra lỗi ESLint
npm run type-check # Kiểm tra TypeScript
```

---

## Cấu trúc thư mục

```
src/
├── app/
│   ├── (auth)/              # Đăng nhập, đăng ký phụ huynh
│   ├── dashboard/           # Trang chính học sinh
│   ├── math/
│   │   ├── [grade]/         # Chọn lớp (1-5)
│   │   └── [grade]/[topic]/ # Bài học theo chủ đề
│   └── parent/              # Dashboard phụ huynh
├── components/
│   ├── ui/                  # Component dùng chung (Button, Card...)
│   ├── math/                # Component bài toán (Quiz, Flashcard...)
│   └── layout/              # Header, Sidebar, Navigation
├── lib/
│   └── supabase.ts          # Supabase client
├── types/                   # TypeScript interfaces
└── hooks/                   # Custom React hooks
```

---

## Database Schema (Supabase)

```sql
-- Người dùng (phụ huynh)
users: id, email, created_at

-- Hồ sơ học sinh
students: id, parent_id, name, grade (1-5), avatar, created_at

-- Ngân hàng câu hỏi
exercises: id, grade, topic, question, answer, options (jsonb),
           type (multiple_choice|drag_drop|fill_blank), difficulty,
           image_url, audio_url

-- Tiến độ học
progress: id, student_id, exercise_id, is_correct, time_spent, created_at

-- Huy hiệu
badges: id, student_id, badge_type, earned_at
```

---

## Chủ đề toán theo lớp

| Lớp | Chủ đề |
|-----|--------|
| 1 | Đếm 1–100, Cộng/trừ trong 20 |
| 2 | Cộng/trừ có nhớ, Bảng nhân 2–5 |
| 3 | Nhân/chia, Phân số đơn giản |
| 4 | Phân số, Góc, Diện tích |
| 5 | Số thập phân, Tỉ lệ, Thể tích |

---

## Quy tắc code

### TypeScript
- Luôn khai báo kiểu rõ ràng — không dùng `any`
- Interface đặt trong `src/types/`
- Server Components mặc định, chỉ dùng `'use client'` khi cần tương tác

### Tailwind
- Không viết CSS thuần — dùng Tailwind class
- Màu sắc dùng palette vui tươi phù hợp trẻ em (indigo, pink, yellow, green)
- Font chữ to, rõ ràng — minimum `text-lg` cho nội dung học

### Supabase
- Mọi query database đều dùng `src/lib/supabase.ts`
- Luôn bật RLS (Row Level Security) cho mọi bảng
- Student chỉ được đọc data của chính mình
- Không lưu thông tin nhạy cảm trong `localStorage`

### Component
- Tên file: PascalCase (`MathQuiz.tsx`)
- Tên component khớp với tên file
- Props phải có TypeScript interface

---

## Nguyên tắc UX cho trẻ em

- Nút bấm phải to (minimum `py-3 px-6`, `text-lg`)
- Hình ảnh minh họa cho mọi bài toán
- Audio đọc đề bài — không để trẻ tự đọc hoàn toàn
- Phản hồi tức thì: đúng → animation vỗ tay/sao; sai → khuyến khích nhẹ nhàng
- Không có quảng cáo, không có link ngoài
- Không giới hạn số lần thử

---

## Biến môi trường

```env
NEXT_PUBLIC_SUPABASE_URL=     # URL project Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Anon key (public)
```

File `.env.local` — không commit lên git (đã có trong `.gitignore`)

---

## KHÔNG làm

- Không cài package mới mà chưa hỏi
- Không xóa RLS policy trên Supabase
- Không dùng `any` trong TypeScript
- Không viết logic phức tạp trong Server Component — tách thành hook
- Không thêm quảng cáo hoặc link bên ngoài vào giao diện học sinh
- Không commit file `.env.local`
