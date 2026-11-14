# So-Learn — Web Học Toán và Tiếng Việt Tiểu Học

## Tổng quan dự án

Web học Toán và Tiếng Việt tương tác dành cho học sinh tiểu học lớp 1–5 (6–11 tuổi).
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
npm run test       # Chạy test trong tests/ (node:test, --experimental-strip-types)
npm run seed:build # Sinh supabase/seed.sql từ src/content/grade1.ts và src/content/tiengviet1.ts
```

Cài đặt Supabase: xem `docs/supabase-setup.md`.

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
│   ├── tieng-viet/
│   │   ├── [grade]/         # Mục lục Tiếng Việt theo lớp (/tieng-viet/1 luôn mở được để duyệt)
│   │   └── [grade]/[topic]/ # Bài học Tiếng Việt
│   ├── thu-giong-doc/       # Trang TẠM nghe thử giọng đọc, xóa sau khi nghe thử xong
│   ├── auth/callback/       # Nhận link xác nhận email
│   └── parent/              # Dashboard phụ huynh
├── components/
│   ├── ui/                  # Component dùng chung (Button, Card...)
│   ├── learn/               # Thành phần bài học dùng chung cho Toán và Tiếng Việt (LessonView, QuizRunner, QuestionSheet, SpeakButton...)
│   ├── math/                # Chỉ còn phần riêng của Toán (hình minh họa trong visuals/, CountingVisual, GradeShelf)
│   ├── tieng-viet/          # Hình minh họa, ghép tiếng, trạng thái giọng đọc của Tiếng Việt
│   ├── landing/             # Các section trang chủ
│   └── layout/              # Header, Sidebar, Navigation
├── content/
│   ├── grade1.ts            # Nội dung toán lớp 1 (nguồn sinh seed.sql)
│   ├── tiengviet1.ts        # Nội dung Tiếng Việt lớp 1, bài 1–30 (nguồn sinh seed.sql)
│   └── tiengviet-sounds.ts  # Cách đọc từng âm, chữ cho giọng đọc
├── lib/
│   ├── supabase.ts          # Supabase client (server)
│   ├── data.ts              # Truy vấn dữ liệu cho các trang
│   ├── progress.ts          # Tính sao, chuỗi ngày từ bảng progress
│   ├── questions.ts         # Dòng bảng exercises → câu hỏi hiển thị, nhận biết hình của môn nào
│   ├── subjects.ts          # Thông tin hiển thị từng môn (đường dẫn, tên, lời nhắc)
│   ├── features.ts          # Công tắc TIENG_VIET_ENABLED
│   ├── tiengviet.ts         # Tách/ghép tiếng, luật chính tả, kiểm tra chữ đã học
│   └── build-state.ts       # Trạng thái ghép tiếng (âm đầu + vần + dấu thanh)
├── proxy.ts                 # Làm mới phiên, chặn trang cần đăng nhập (Next 16: thay middleware.ts)
├── types/                   # TypeScript interfaces (database.ts khớp schema)
└── hooks/                   # Custom React hooks
tests/                       # Test node:test (nội dung Tiếng Việt, chính tả, ghép tiếng, seed...)
supabase/
├── migrations/              # Bảng + RLS, chạy một lần, đúng thứ tự tên file
└── seed.sql                 # Bài học, sinh tự động, chạy lại được
```

---

## Database Schema (Supabase)

```sql
-- Người dùng (phụ huynh)
users: id, email, created_at

-- Hồ sơ học sinh
students: id, parent_id, name, grade (1-5), avatar, created_at

-- Bài học (chủ đề con) theo môn và lớp, kèm phần "Cùng học"
-- subject: 'math' | 'tieng-viet' (mặc định 'math'); unique (subject, grade, position)
topics: id (slug), subject, grade, chapter_number, chapter_title, position,
        title, mark, description, intro (jsonb)

-- Ngân hàng câu hỏi
exercises: id, slug (unique), subject ('math' | 'tieng-viet'), grade, topic (→ topics.id), position,
           question, answer, options (jsonb),
           type (multiple_choice|drag_drop|fill_blank), difficulty,
           visual (jsonb), explain, image_url, audio_url

-- Tiến độ học
progress: id, student_id, exercise_id, is_correct, time_spent, created_at

-- Huy hiệu
badges: id, student_id, badge_type, earned_at
```

---

## Chủ đề theo môn và lớp

| Môn | Lớp | Chủ đề |
|-----|-----|--------|
| Toán | 1 | Theo GDPT 2018: Số 0–10 và so sánh, Mấy và mấy, Hình phẳng và khối, Vị trí, Cộng/trừ trong 10, Số đến 100, Độ dài (cm), Cộng/trừ không nhớ trong 100, Xem giờ đúng, Ngày trong tuần |
| Toán | 2 | Cộng/trừ có nhớ, Bảng nhân 2–5 |
| Toán | 3 | Nhân/chia, Phân số đơn giản |
| Toán | 4 | Phân số, Góc, Diện tích |
| Toán | 5 | Số thập phân, Tỉ lệ, Thể tích |
| Tiếng Việt | 1 | Bài 1–30 theo sách Kết nối tri thức (đợt 1, mã `tv1-bai-01` … `tv1-bai-30`): các âm và chữ, dấu thanh, chính tả c/k, g/gh, ng/ngh |

---

## Nội dung Tiếng Việt

- Nội dung bài nằm ở `src/content/tiengviet1.ts`; cách đọc từng âm, chữ nằm ở `src/content/tiengviet-sounds.ts`. Spec: `docs/superpowers/specs/2026-10-26-tieng-viet-lop1-design.md`.
- Phần trẻ phải tự đọc chỉ dùng chữ và dấu đã học tới bài đó (spec mục 6.2).
- `npm run test` và `npm run seed:build` đều kiểm tra chữ đã học và chính tả (c/k, g/gh, ng/ngh). Có lỗi thì `seed:build` không ghi `seed.sql`. **Không nới lỏng bộ kiểm tra** để cho nội dung qua; sửa nội dung cho đúng luật.
- Nội dung tự soạn, không chép câu chữ hay hình trong SGK. Mọi chuỗi tiếng Việt viết ở dạng Unicode NFC.
- Sau khi sửa nội dung: `npm run test`, `npm run seed:build`, rồi chạy lại `supabase/seed.sql` trong SQL Editor.

### Thứ tự phát hành môn Tiếng Việt (chi tiết: `docs/supabase-setup.md`)

1. Chạy migration `supabase/migrations/20261026000000_subject.sql` trên Supabase. **Phải làm trước khi deploy code mới**, nếu không trang Toán bị lỗi (`column topics.subject does not exist`).
2. Deploy code mới, chưa đặt `TIENG_VIET_ENABLED`. **Gộp nhánh vào `main` là deploy (Vercel tự build); chạy migration ở mục 1 TRƯỚC khi gộp.**
3. Chạy `supabase/seed.sql` mới.
4. Duyệt nội dung ở `/tieng-viet/1`, nghe thử giọng đọc ở `/thu-giong-doc` (cả khi mở link từ Zalo/Facebook trên Android); nghe xong xóa `src/app/thu-giong-doc/` rồi deploy lại.
5. Đặt `TIENG_VIET_ENABLED=true` trên Vercel rồi deploy lại.

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
SUPABASE_URL=       # URL project Supabase (chỉ server đọc)
SUPABASE_ANON_KEY=  # Anon hoặc publishable key, không dùng service_role
TIENG_VIET_ENABLED= # Chỉ server đọc. 'true' mới hiện lối vào Tiếng Việt (trang chủ, dashboard, footer); /tieng-viet/1 vẫn mở được khi tắt. Đổi trên Vercel phải deploy lại
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
