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
SUPABASE_URL=https://<mã-project>.supabase.co
SUPABASE_ANON_KEY=<khóa anon hoặc publishable>
```

- Không dùng khóa **service_role / secret** ở đây: khóa đó bỏ qua RLS.
- `.env.local` đã nằm trong `.gitignore`, không commit file này.

**Kiểm tra:** URL phải mở được trên trình duyệt (trả về JSON báo thiếu khóa là bình thường). Khóa anon thật dài hàng trăm ký tự (dạng JWT) hoặc bắt đầu bằng `sb_publishable_`.

## 3. Tạo bảng và nạp bài học

Trong project, mở **SQL Editor → New query**:

1. Dán toàn bộ nội dung `supabase/migrations/20261022000000_init.sql`, bấm **Run**. Lệnh này tạo 6 bảng, bật RLS và các chính sách quyền.
2. Tạo query mới, dán toàn bộ `supabase/migrations/20261026000000_subject.sql`, bấm **Run**. Lệnh này thêm cột `subject` (`math` hoặc `tieng-viet`) cho `topics` và `exercises`.
3. Tạo query mới, dán toàn bộ `supabase/seed.sql`, bấm **Run**. Lệnh này nạp 20 bài và 128 câu hỏi Toán lớp 1, cùng 30 bài và 227 câu hỏi Tiếng Việt lớp 1.

**Kiểm tra:** mở **Table Editor**: bảng `topics` có 50 dòng (20 Toán + 30 Tiếng Việt), `exercises` có 355 dòng (128 Toán + 227 Tiếng Việt). Cả 6 bảng đều có nhãn RLS đang bật.

> Mỗi file migration chỉ chạy **một lần**, đúng thứ tự tên file. File `seed.sql` thì chạy lại bao nhiêu lần cũng được.
>
> Dự án đã chạy bản cũ (chỉ có Toán) thì **không** làm như trên: xem mục "Thêm môn Tiếng Việt" bên dưới.

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

1. Trên Vercel, vào **Project → Settings → Environment Variables**, thêm `SUPABASE_URL` và `SUPABASE_ANON_KEY` (Type: Secret được, vì chỉ server đọc hai biến này).
2. Trên Supabase, đổi **Site URL** thành tên miền thật và thêm `https://<tên-miền>/auth/callback` vào **Redirect URLs**.
3. Deploy lại.

Môn Tiếng Việt mặc định đang tắt trên giao diện (biến `TIENG_VIET_ENABLED`). Muốn bật, xem mục tiếp theo.

## Thêm môn Tiếng Việt

Dành cho dự án đã chạy bản cũ (chỉ có Toán). Dự án chỉ có một Supabase project và một bản production, nên **làm đúng thứ tự dưới đây**.

> **Cảnh báo thứ tự:** deploy code mới **trước** khi chạy migration `20261026000000_subject.sql` thì các trang Toán bị lỗi, vì code mới đọc cột `topics.subject` mà database chưa có cột đó. Nạp `seed.sql` mới khi code cũ còn chạy thì bài Tiếng Việt lẫn vào mục lục Toán.

**Bước 1. Chạy migration.** Trong **SQL Editor → New query**, dán toàn bộ `supabase/migrations/20261026000000_subject.sql`, bấm **Run**. Migration chỉ thêm cột có giá trị mặc định và đổi ràng buộc, nên code cũ vẫn chạy được. Chạy **một lần**.

Kiểm tra bằng hai truy vấn (mỗi truy vấn một lần chạy):

```sql
select subject, count(*) from public.topics group by subject;
select conname from pg_constraint where conrelid = 'public.topics'::regclass;
```

- Truy vấn 1: chỉ có một dòng `math` (20 bài); chưa có `tieng-viet`.
- Truy vấn 2: có `topics_subject_grade_position_key`, không còn `topics_grade_position_key`.

**Bước 2. Deploy code mới, chưa đặt `TIENG_VIET_ENABLED`.** Gộp nhánh vào `main` là deploy (Vercel tự build từ `main`); chạy migration ở Bước 1 TRƯỚC khi gộp. Trang chủ, dashboard và footer chưa hiện lối vào Tiếng Việt. Toán chạy như cũ.

**Bước 3. Nạp seed.** Dán toàn bộ `supabase/seed.sql` mới vào SQL Editor, bấm **Run**. Kiểm tra: `topics` có 50 dòng, `exercises` có 355 dòng; truy vấn 1 ở trên giờ trả về `math` = 20 và `tieng-viet` = 30.

**Bước 4. Duyệt nội dung.** Mở trực tiếp `https://<tên-miền>/tieng-viet/1` (URL này luôn mở được dù chưa bật biến), đọc hết 30 bài và nghe thử giọng đọc. Nghe thử ở `https://<tên-miền>/thu-giong-doc` trên các thiết bị bé sẽ dùng, gồm cả khi bấm vào một đường link nhận qua Zalo hoặc Facebook trên Android (trình duyệt trong ứng dụng có thể khác Chrome nên cần thử riêng). Nghe xong thì xóa thư mục `src/app/thu-giong-doc/` (trang tạm này không được để lại trên bản chính thức), commit rồi gộp vào `main` để deploy lại. Cần sửa thì sửa `src/content/tiengviet1.ts` hoặc `src/content/tiengviet-sounds.ts`, chạy `npm run seed:build`, deploy, rồi chạy lại `seed.sql` (xem mục "Sửa hoặc thêm bài học").

**Bước 5. Bật Tiếng Việt.** Trên Vercel, vào **Project → Settings → Environment Variables**, thêm `TIENG_VIET_ENABLED` = `true`, rồi **deploy lại**. Biến chỉ có hiệu lực ở bản deploy mới; đổi biến xong mà không deploy lại thì site vẫn như cũ. Muốn tắt, đổi giá trị khác `true` (hoặc xóa biến) rồi deploy lại.

Chạy thử trên máy: thêm `TIENG_VIET_ENABLED=true` vào `.env.local` rồi khởi động lại `npm run dev`.

## Sửa hoặc thêm bài học

Nội dung bài học nằm ở `src/content/grade1.ts` (Toán lớp 1) và `src/content/tiengviet1.ts` (Tiếng Việt lớp 1; cách đọc từng âm, chữ nằm ở `src/content/tiengviet-sounds.ts`). Sau khi sửa:

```bash
npm run test
npm run seed:build
```

`seed:build` ghi lại `supabase/seed.sql` và in số bài, số câu mỗi môn (hiện là `Toán: 20 bài, 128 câu; Tiếng Việt: 30 bài, 227 câu`). Nội dung Tiếng Việt sai luật chữ đã học hoặc chính tả thì lệnh báo lỗi và không ghi file. Chạy lại `seed.sql` trong SQL Editor. Câu hỏi giữ nguyên `slug` thì giữ nguyên `id`, nên tiến độ cũ của bé không mất.

Lưu ý: xóa câu hỏi khỏi file nội dung **không** xóa dòng trong database (seed chỉ thêm và cập nhật). Muốn xóa hẳn, xóa dòng đó trong Table Editor.

## Gặp lỗi

| Hiện tượng | Nguyên nhân thường gặp |
|---|---|
| Trang "Chưa mở được trang này", log có `ENOTFOUND …supabase.co` | URL trong `.env.local` sai, hoặc project đã bị xóa |
| Log có `Invalid API key` | Khóa anon sai hoặc còn là giá trị mẫu |
| Log có `relation "public.topics" does not exist` | Chưa chạy file migration (bước 3) |
| Log có `column topics.subject does not exist` | Chưa chạy migration `20261026000000_subject.sql` (xem mục "Thêm môn Tiếng Việt") |
| Trang lớp 1 trống, không có bài | Chưa chạy `seed.sql` |
| `/tieng-viet/1` chỉ hiện "Bài học đang được soạn" | Chưa chạy `seed.sql` mới (bản có bài Tiếng Việt) |
| Đã đặt `TIENG_VIET_ENABLED=true` mà trang chủ chưa hiện Tiếng Việt | Chưa deploy lại sau khi đổi biến trên Vercel |
| `permission denied` (mã `42501`) | Chạy thiếu phần `grant` trong file migration |
| Đăng ký xong không vào được | Đang bật xác nhận email: mở thư và bấm link, hoặc tắt **Confirm email** (bước 4) |
| Bấm link trong email bị báo hết hạn | Chưa thêm `/auth/callback` vào **Redirect URLs** (bước 4) |

Sau khi sửa `.env.local`, luôn khởi động lại `npm run dev`.
