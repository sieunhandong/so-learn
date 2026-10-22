# Cài đặt Supabase cho So-Learn

Làm theo thứ tự. Mỗi bước có cách kiểm tra để biết đã xong chưa.

## 1. Tạo project

1. Vào https://supabase.com, đăng nhập, bấm **New project**.
2. Đặt tên (ví dụ `so-learn`), đặt mật khẩu database (lưu lại), chọn region gần Việt Nam (ví dụ Singapore).
3. Đợi project khởi tạo xong.

## 2. Lấy URL và khóa, điền vào `.env.local`

1. Trong project, mở **Project Settings → API** (hoặc nút **Connect** trên thanh trên cùng).
2. Chép **Project URL** và khóa **anon / public** (dự án mới có thể ghi là **publishable key**, bắt đầu bằng `sb_publishable_`).
3. Mở file `.env.local` ở thư mục gốc dự án, điền:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<mã-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<khóa anon hoặc publishable>
```

- Không dùng khóa **service_role / secret** ở đây: khóa đó bỏ qua RLS.
- `.env.local` đã nằm trong `.gitignore`, không commit file này.

**Kiểm tra:** URL phải mở được trên trình duyệt (trả về JSON báo thiếu khóa là bình thường). Khóa anon thật dài hàng trăm ký tự (dạng JWT) hoặc bắt đầu bằng `sb_publishable_`.

## 3. Tạo bảng và nạp bài học

Trong project, mở **SQL Editor → New query**:

1. Dán toàn bộ nội dung `supabase/migrations/20261022000000_init.sql`, bấm **Run**. Lệnh này tạo 6 bảng, bật RLS và các chính sách quyền.
2. Tạo query mới, dán toàn bộ `supabase/seed.sql`, bấm **Run**. Lệnh này nạp 20 bài và 128 câu hỏi toán lớp 1.

**Kiểm tra:** mở **Table Editor**: bảng `topics` có 20 dòng, `exercises` có 128 dòng. Cả 6 bảng đều có nhãn RLS đang bật.

> Chỉ chạy file migration **một lần**. File `seed.sql` thì chạy lại bao nhiêu lần cũng được.

## 4. Cấu hình đăng nhập

Mở **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000`
- **Redirect URLs:** thêm `http://localhost:3000/auth/callback`

Xác nhận email: mặc định Supabase bắt người dùng bấm link trong email mới đăng nhập được.

- Muốn thử nhanh khi phát triển: vào **Authentication → Sign In / Providers → Email**, tắt **Confirm email**. Đăng ký xong sẽ vào thẳng trang phụ huynh.
- Muốn giữ xác nhận email: link trong thư sẽ dẫn về `/auth/callback`, app tự đăng nhập rồi chuyển sang `/parent`. Email mặc định của Supabase bị giới hạn số thư mỗi giờ; khi chạy thật nên cấu hình SMTP riêng (**Authentication → Emails → SMTP Settings**).

## 5. Chạy thử toàn bộ luồng

```bash
npm run dev
```

1. Mở http://localhost:3000, bấm **Đăng ký**, tạo tài khoản bố mẹ.
2. Ở **Trang phụ huynh**, tạo hồ sơ cho bé (tên, lớp 1, màu).
3. Bấm **Học với bé này**, vào trang học, mở một bài, làm vài câu (cố tình chọn sai một câu).
4. Trên Supabase, mở **Table Editor → progress**: mỗi lần bé chọn đáp án là một dòng, câu sai có `is_correct = false`.
5. Quay lại trang học: sao, số câu hôm nay và tiến độ chủ đề đã cập nhật. Câu đúng đầu tiên sẽ mở huy hiệu "Câu đúng đầu tiên" (bảng `badges`).

## 6. Đưa lên Vercel

1. Trên Vercel, vào **Project → Settings → Environment Variables**, thêm `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. Trên Supabase, đổi **Site URL** thành tên miền thật và thêm `https://<tên-miền>/auth/callback` vào **Redirect URLs**.
3. Deploy lại.

## Sửa hoặc thêm bài học

Nội dung bài học nằm ở `src/content/grade1.ts`. Sau khi sửa:

```bash
npm run seed:build
```

Lệnh này ghi lại `supabase/seed.sql`. Chạy lại file đó trong SQL Editor. Câu hỏi giữ nguyên `slug` thì giữ nguyên `id`, nên tiến độ cũ của bé không mất.

Lưu ý: xóa câu hỏi khỏi file nội dung **không** xóa dòng trong database (seed chỉ thêm và cập nhật). Muốn xóa hẳn, xóa dòng đó trong Table Editor.

## Gặp lỗi

| Hiện tượng | Nguyên nhân thường gặp |
|---|---|
| Trang "Chưa mở được trang này", log có `ENOTFOUND …supabase.co` | URL trong `.env.local` sai, hoặc project đã bị xóa |
| Log có `Invalid API key` | Khóa anon sai hoặc còn là giá trị mẫu |
| Log có `relation "public.topics" does not exist` | Chưa chạy file migration (bước 3) |
| Trang lớp 1 trống, không có bài | Chưa chạy `seed.sql` |
| `permission denied` (mã `42501`) | Chạy thiếu phần `grant` trong file migration |
| Đăng ký xong không vào được | Đang bật xác nhận email: mở thư và bấm link, hoặc tắt **Confirm email** (bước 4) |
| Bấm link trong email bị báo hết hạn | Chưa thêm `/auth/callback` vào **Redirect URLs** (bước 4) |

Sau khi sửa `.env.local`, luôn khởi động lại `npm run dev`.
