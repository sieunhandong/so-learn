# Thiết kế: môn Tiếng Việt lớp 1 (đợt 1)

Ngày: 2026-10-26. Trạng thái: bản nháp, chờ chủ dự án duyệt.

Ký hiệu trong tài liệu:
- **[Quyết định của Claude]**: Claude tự chọn, chủ dự án chưa xác nhận riêng.
- **[Unverified]**: chưa kiểm chứng được từ nguồn gốc.

## 1. Mục đích

So-Learn hiện chỉ có Toán lớp 1. Chủ dự án muốn thêm môn Tiếng Việt lớp 1 bám chương trình mới nhất.

Bản đầu tiên sẽ được đưa cho người quen có con nhỏ dùng thử. Góp ý từ họ sẽ quyết định các đợt sau.

**Trẻ dùng thử** đang học lớp 1 năm học 2026–2027. Ở trường, các bé đã học được khoảng 2 tháng.

**Chủ dự án yêu cầu:**
- Làm đầy đủ từ bài 1.
- Trẻ học lần lượt theo thứ tự, kể cả những bài đã học ở trường, để củng cố lại kiến thức.

**Đợt 1 cần:**
- một luồng học hoàn chỉnh, dùng được trên điện thoại và máy tính bảng;
- toàn bộ phần âm và chữ của Tập 1.

## 2. Chương trình gốc

- **Bộ sách:** *Tiếng Việt 1*, bộ Kết nối tri thức với cuộc sống (KNTT). Theo Quyết định 3588/QĐ-BGDĐT ngày 26/12/2025, đây là bộ sách dùng thống nhất toàn quốc từ năm học 2026–2027.
  - Nguồn: baovanhoa.vn, lsvn.vn, baolaocai.vn.
  - Bộ GD&ĐT có kế hoạch rà soát để ra bộ sách mới từ năm học 2028–2029. [Unverified] Chưa rõ lớp 1 có đổi hay không.
- **Cấu trúc Tập 1, phần Học vần**, mỗi bài 2 tiết:
  - Bài 1–30: âm, chữ và 5 dấu thanh.
  - Bài 31–80: vần.
  - Các bài 5, 10, 15, … là "Ôn tập và kể chuyện".
- **Tập 2:** 8 chủ đề đọc hiểu.
- **Nhịp một bài âm trên lớp:** nhận biết (tranh và câu) → đọc âm → đánh vần, đọc tiếng mẫu, ghép tiếng mới → đọc từ dưới tranh → viết → đọc câu → nói theo tranh.
- Danh sách và thứ tự bài lấy từ phân phối chương trình trên vietjack.com và hoatieu.vn. [Unverified] Chưa đối chiếu với sách gốc.

## 3. Phạm vi đợt 1

**Trong phạm vi:**
1. Hạ tầng cho môn thứ hai. Toán phải chạy y như cũ.
2. Bài 1–30 theo thứ tự KNTT (toàn bộ phần âm và chữ):

| Bài | Nội dung mới | Bài | Nội dung mới | Bài | Nội dung mới |
|----|----|----|----|----|----|
| 1 | A a | 11 | I i, K k | 21 | R r, S s |
| 2 | B b, dấu huyền | 12 | H h, L l | 22 | T t, Tr tr |
| 3 | C c, dấu sắc | 13 | U u, Ư ư | 23 | Th th, ia |
| 4 | E e, Ê ê | 14 | Ch ch, Kh kh | 24 | ua, ưa |
| 5 | Ôn tập | 15 | Ôn tập | 25 | Ôn tập |
| 6 | O o, dấu hỏi | 16 | M m, N n | 26 | Ph ph, Qu qu |
| 7 | Ô ô, dấu nặng | 17 | G g, Gi gi | 27 | V v, X x |
| 8 | D d, Đ đ | 18 | Gh gh, Nh nh | 28 | Y y |
| 9 | Ơ ơ, dấu ngã | 19 | Ng ng, Ngh ngh | 29 | Luyện tập chính tả |
| 10 | Ôn tập | 20 | Ôn tập | 30 | Ôn tập |

**Ngoài phạm vi đợt 1** (để các đợt sau):
- Bài 31–83 (vần) và Tập 2.
- Tô chữ, tập viết.
- Kể chuyện có audio.
- Truyện đọc to có tô sáng từng từ.
- Ghi âm hoặc chấm phát âm.
- File audio thu sẵn.
- Báo cáo riêng theo môn cho phụ huynh.
- Huy hiệu riêng cho Tiếng Việt.

**Không được làm:**
- Chép nguyên văn câu chữ hoặc hình trong SGK. Chỉ bám thứ tự bài và âm/chữ/dấu của từng bài; câu, từ và bài tập tự soạn.
- Để chữ hoặc dấu chưa học xuất hiện trong phần trẻ phải đọc (xem 6.2).
- Làm sai, lẫn hoặc mất tiến độ Toán đang có.
- Cài package mới, thêm link ngoài hoặc quảng cáo (theo CLAUDE.md).

## 4. Trải nghiệm của trẻ

### 4.1 Đường vào

- Trang chủ, trang `/dashboard` và footer có lối vào Tiếng Việt lớp 1.
- Mục lục môn ở `/tieng-viet/1`. Bài học ở `/tieng-viet/1/<slug>`.
- Trang `/math/...` giữ nguyên URL.
- Khách chưa đăng nhập được học thử như Toán.
- Khóa bài theo thứ tự như Toán, dùng lại `lessonStates`.

### 4.2 Một bài học

Giữ khung hai bước của `LessonView`: **Cùng học** rồi **Luyện tập**. Mỗi bài khoảng 8–12 phút.

**Cùng học:** 4–6 thẻ, mỗi thẻ có câu chữ, nút nghe đọc và hình minh họa. Thứ tự thẻ theo nhịp của sách:
1. **Nhận biết:** tranh và một câu ngắn có âm mới; tiếng chứa âm mới được tô màu.
2. **Âm/chữ mới:** chữ in to (thường và hoa). Bấm vào để nghe âm, ví dụ "bờ".
3. **Đánh vần tiếng mẫu:** các mảnh ghép b + a → ba, rồi ba + dấu huyền → bà. Nghe được "bờ – a – ba", "ba – huyền – bà".
4. **Từ ngữ:** 2–4 tranh, mỗi tranh có từ bên dưới, bấm để nghe.
5. **Câu ngắn:** chỉ có khi đã đủ chữ để đặt câu.

**Luyện tập:** 6–8 câu, trộn các dạng ở mục 5, thử không giới hạn số lần.
- Sao, con dấu "Đúng!", lưu tiến độ và huy hiệu dùng lại như Toán.
- Khi chọn sai, lời nhắc phải hợp với môn, ví dụ "Chưa đúng, bé nghe lại rồi chọn tiếp nhé", không dùng câu "bé đếm lại" của Toán.

**Bài ôn tập (5, 10, 15, 20, 25, 30):** không có kể chuyện. Phần Cùng học nhắc lại các chữ, dấu vừa học. Phần Luyện tập trộn câu từ các bài kể từ bài ôn tập trước.

**Bài 29 (Luyện tập chính tả):** dạy và luyện quy tắc c/k, g/gh, ng/ngh.
- Cùng học: mỗi quy tắc một thẻ, có ví dụ.
- Luyện tập: chủ yếu dạng "chọn cách viết đúng", ví dụ chọn "kẻ" hay "cẻ" cho một tranh. Dạng này lưu là `multiple_choice`.

**Thứ tự và khóa bài:** chủ dự án muốn trẻ học lần lượt từ bài 1 kể cả khi đã học ở trường. Vì vậy giữ nguyên cách khóa bài của Toán: bài sau mở khi trẻ đã bắt đầu bài liền trước.

## 5. Dạng bài đợt 1

Các dạng này được chọn vì phổ biến nhất trên các app học vần (VMonkey, Duolingo ABC, Teach Your Monster to Read, Khan Academy Kids) và không cần dịch vụ trả phí.

| # | Dạng | Trẻ làm gì | Cách lưu |
|---|---|---|---|
| 1 | Nghe chọn chữ/tiếng | Bấm nút loa to, nghe "bờ", chọn chữ đúng trong 3–4 lựa chọn | `multiple_choice` |
| 2 | Tranh nào, chữ nào | Nhìn tranh, chọn từ đúng | `multiple_choice` |
| 3 | Tìm tiếng có âm mới | "Tiếng nào có âm b?", chọn trong các tiếng | `multiple_choice` |
| 4 | Chọn dấu thanh | Nhìn tranh và tiếng chưa có dấu ("ba"), chọn dấu để thành "bà" | `multiple_choice` |
| 5 | Ghép tiếng | Nghe hoặc nhìn tranh, bấm lần lượt các mảnh (âm đầu, vần, dấu) để ghép thành tiếng | Dạng mới, xem dưới |

Yêu cầu chung:
- **Chữ hiển thị và lời đọc là hai trường riêng.** Ví dụ dạng 1: màn hình hiện "Bé nghe rồi chọn chữ đúng", còn loa đọc "Bé nghe rồi chọn chữ đúng: bờ". Nếu dùng chung một trường thì màn hình sẽ lộ đáp án.
- **Dạng 5 dùng bấm để đặt mảnh vào ô, không kéo thả.** [Quyết định của Claude] Cách này dễ hơn trên màn hình cảm ứng và không cần thư viện kéo thả.
  - Có nút xóa mảnh cuối.
  - Đặt đủ mảnh mới chấm đúng/sai.
  - Mỗi lần chấm là một lượt `recordAttempt`.
  - Lưu bằng giá trị `type` có sẵn trong check constraint (`drag_drop`) hoặc thêm giá trị mới; người làm tự chọn.
- Dạng 5 chỉ dùng từ bài 2, khi đã có phụ âm.

## 6. Nội dung

### 6.1 Nguồn

- Nội dung nằm trong file mới `src/content/` (ví dụ `tiengviet1.ts`). File này là nguồn sinh seed, cùng cách làm với `grade1.ts`.
- Có hàm tạo bài tập kiểm tra đáp án nằm trong lựa chọn, như hàm `ex()` của Toán.

### 6.2 Quy tắc soạn

- **Chỉ dùng chữ và dấu đã học.** Trong bài N, phần **trẻ phải tự đọc** chỉ được dùng chữ và dấu thanh của bài 1 đến N.
  - **Phần trẻ phải tự đọc** gồm:
    - tiếng và từ ở thẻ Đánh vần, Từ ngữ, Câu ngắn;
    - các lựa chọn đáp án là chữ ở dạng 2–5.
  - **Phần được miễn** (luôn có loa đọc, người lớn hoặc giọng đọc lo phần này):
    - lời hướng dẫn, đề bài;
    - câu ở thẻ Nhận biết; trong câu này chỉ tô màu tiếng có âm mới;
    - lời giải thích sau khi đúng;
    - tên bài.
  - Lựa chọn gây nhiễu ở dạng 1 được phép là chữ chưa học, vì trẻ chỉ cần nhận ra chữ đúng.
  - Kiểm tra tự động khi sinh seed chỉ quét phần trẻ phải tự đọc. [Quyết định của Claude]
- **Bài 1 (chỉ có chữ a) được làm ngắn hơn khung chung.** [Quyết định của Claude]
  - Cùng học có 2–3 thẻ: Nhận biết, Âm/chữ mới, Tranh có tiếng chứa âm a.
  - Luyện tập dùng dạng 1, và dạng 3 với lựa chọn là tranh emoji: "Tranh nào có tiếng chứa âm a?". Emoji là chữ nên `AnswerOption` hiện được.
  - Bài 2 trở đi theo khung đầy đủ.
- **Đánh vần theo cách đọc trên lớp:** phụ âm đọc "bờ", "cờ", "dờ", "đờ"; tiếng đọc kiểu "bờ – a – ba", "ba – huyền – bà".
- **Chữ ghép và chữ nhiều tên đọc:** cách đọc của các chữ ghép (ch, kh, gi, gh, nh, ng, ngh, tr, th, ph, qu) và chữ k, y theo cách đọc trên lớp của KNTT. [Unverified] Tôi chưa xác minh cách đọc chuẩn của từng chữ. Lời đọc nằm trong dữ liệu nên người duyệt sửa được.
- **Quy tắc chính tả:** mọi tiếng trong nội dung phải viết đúng quy tắc: k, gh, ngh đứng trước i, e, ê; c, g, ng đứng trước các âm còn lại.
  - Trước bài 11 (chưa học k): không ghép c với e, ê, i.
  - Trước bài 18–19 (chưa học gh, ngh): không ghép g, ng với e, ê, i.
  - Kiểm tra tự động khi sinh seed nên bắt lỗi chính tả này. [Quyết định của Claude]
- **Đáp án ghép tiếng (dạng 5):** từ bài 23 có thể gồm âm đầu, vần ia/ua/ưa và dấu, ví dụ tr + ưa + huyền → trừa. Phần ghép phải nhận vần nhiều chữ.
- **Tranh dùng emoji.** [Quyết định của Claude] Không cần package, không tốn dung lượng.
  - Chỉ chọn từ có emoji rõ nghĩa: cá 🐟, bò 🐄, bà 👵, cờ 🚩…
  - Emoji hiển thị khác nhau giữa các máy, nên tránh emoji dễ hiểu nhầm.
- **Người lớn phải duyệt trước.** Nội dung do AI soạn, phải có giáo viên hoặc phụ huynh đọc trước khi đưa cho trẻ.

## 7. Âm thanh

[Quyết định của Claude]
- Đợt 1 dùng giọng đọc của trình duyệt qua `useSpeech` (Web Speech API, `vi-VN`).
- Mọi câu đọc lấy từ trường lời đọc trong dữ liệu.
- Cột `audio_url` có sẵn trong bảng `exercises` để dành cho file thu âm ở đợt sau. Nút nghe nên được viết để sau này ưu tiên file thu âm nếu có, nhưng đợt 1 chưa cần file nào.

**Rủi ro lớn nhất.** [Unverified] Giọng đọc tiếng Việt có sẵn trên máy không đồng đều giữa các trình duyệt và hệ điều hành. Âm đơn lẻ ("a", "ê", "ơ", "bờ") và kiểu đánh vần có thể bị đọc sai hoặc không có giọng tiếng Việt.

**Việc đầu tiên khi bắt tay làm:** làm một trang thử, nhanh và bỏ đi được, đọc các âm, chữ ghép, dấu và kiểu đánh vần của bài 1–30. Chủ dự án mở trang này trên vài máy người quen sẽ dùng.
- Nếu đọc không chấp nhận được, dừng lại hỏi chủ dự án về thu âm trước khi soạn nội dung.
- Khi máy không có giọng tiếng Việt, hiện một dòng nhắc nhỏ cho phụ huynh. Hiện tại `SpeakButton` chỉ tự ẩn đi.

## 8. Thay đổi kỹ thuật

### 8.1 Cơ sở dữ liệu

Thêm migration mới; không sửa file migration cũ, không đụng RLS.
- **Cột `subject`:**
  - Thêm vào `topics` và `exercises`, kiểu `text not null default 'math'`.
  - Có check giới hạn giá trị: `'math'` và giá trị cho Tiếng Việt, ví dụ `'tieng-viet'`.
  - Dữ liệu Toán hiện có tự nhận `'math'` qua default.
- **Ràng buộc thứ tự bài:** đổi `unique (grade, position)` của `topics` thành `unique (subject, grade, position)`.
- **Mã bài và câu:** `topics.id` và `exercises.slug` vẫn chung một không gian tên, nên mã của Tiếng Việt phải có tiền tố riêng, ví dụ `tv1-...`.
- **Đồng bộ kiểu:** cập nhật `src/types/database.ts` cho khớp schema.
- **Chạy trên Supabase:** chủ dự án tự chạy migration và seed mới trong Supabase SQL Editor, như hướng dẫn ở `docs/supabase-setup.md`. Người làm chỉ chuẩn bị file và cập nhật hướng dẫn.

### 8.2 Seed

- `scripts/build-seed.mjs` đọc cả nội dung Toán và Tiếng Việt.
- Ghi `subject` cho từng dòng. `position` đánh riêng theo từng môn.
- Ghi đúng `type` của từng câu thay vì luôn là `multiple_choice`.
- Seed chạy lại nhiều lần vẫn không tạo trùng, như hiện nay.

### 8.3 Truy vấn và logic

- **Lọc theo môn:** `getGradeOutline`, `getLesson`, `countGradeExercises` nhận thêm môn.
  - Mục lục Toán không được hiện bài Tiếng Việt và ngược lại.
  - Trang bài học kiểm tra bài thuộc đúng môn và lớp của URL.
- **`toQuestion`** hiện bỏ mọi câu không có `visual` hợp lệ của Toán. Phải đổi để nhận được câu Tiếng Việt.
- **Huy hiệu:** `grade1_done` ("Xong toán lớp 1") chỉ đếm câu Toán. Tên `type` giữ nguyên vì đã có dữ liệu.
- **Tính chung cho cả hai môn** (`lib/progress.ts` giữ nguyên): sao, chuỗi ngày học, mục tiêu 10 câu/ngày và các huy hiệu chung. [Quyết định của Claude]

### 8.4 Giao diện

- **Kiểu dữ liệu:** kiểu hình minh họa của Tiếng Việt (chữ, tranh emoji, mảnh ghép đánh vần, câu có tô màu, nút nghe) đặt trong `src/types/`, tách khỏi union `QuestionVisual` của Toán.
- **Dùng lại component chung:** `LessonView`, `QuizRunner`, `QuestionSheet`, `AnswerOption` và `SpeakButton` dùng chung cho cả hai môn. Mỗi môn truyền vào bộ vẽ hình và câu nhắc riêng.
  - Người làm tự chọn cách tách và chỗ đặt file.
  - Không chép lại cả cây component.
- **`/dashboard`:** có thẻ "bài tiếp theo" và phần tiến độ cho từng môn.
- **Trang chủ:** chỉ thêm lối vào Tiếng Việt, không thiết kế lại.
- **Trang phụ huynh:** giữ nguyên.
- **`proxy.ts`:** để `/tieng-viet` mở cho khách như `/math`.
- **CLAUDE.md:** cập nhật bảng chủ đề, cấu trúc thư mục, schema (cột `subject`) và lệnh seed.
- **Quy tắc UX của CLAUDE.md vẫn áp dụng:** nút to, chữ tối thiểu `text-lg`, chỉ dùng Tailwind, không dùng `any`.

### 8.5 Phát hành và duyệt nội dung

[Quyết định của Claude] Dự án chỉ có một Supabase project và một bản production, nên phải phát hành đúng thứ tự:

1. **Chạy migration.** Thay đổi chỉ thêm cột có default và đổi ràng buộc, nên code cũ vẫn chạy được.
2. **Deploy code mới, phần Tiếng Việt đang tắt.** Một biến môi trường server, ví dụ `TIENG_VIET_ENABLED`, khi chưa bật thì ẩn mọi lối vào Tiếng Việt ở trang chủ, dashboard và footer. URL `/tieng-viet/1` vẫn mở trực tiếp được để duyệt.
3. **Nạp seed Tiếng Việt.** Code mới đã lọc theo môn nên Toán không bị lẫn.
4. **Duyệt nội dung.** Người duyệt do chủ dự án chọn, xem ngay trên site qua URL trực tiếp.
5. **Bật biến môi trường** trên Vercel.

Nếu nạp seed khi code cũ còn chạy, bài Tiếng Việt sẽ lẫn vào mục lục Toán. Nếu deploy code mới trước khi chạy migration, trang Toán bị lỗi. Hướng dẫn trong `docs/supabase-setup.md` và CLAUDE.md phải ghi rõ thứ tự này.

## 9. Tiêu chí xong đợt 1

1. Trẻ 6–7 tuổi tự học được bài 1–30 trên điện thoại hoặc máy tính bảng. Mọi đề bài và lời hướng dẫn đều nghe được.
2. Mục lục, bài học và tiến độ Toán giữ nguyên như trước. Hai môn không lẫn bài.
3. Sao, chuỗi ngày và huy hiệu ghi nhận cả câu Tiếng Việt.
4. `npm run type-check`, `npm run lint`, `npm run build` và `npm run seed:build` chạy không lỗi.
5. Nội dung bài 1–30 tuân thủ quy tắc ở 6.2 và đã được một người lớn đọc duyệt.

## 10. Các đợt sau (chỉ để định hướng, không làm bây giờ)

- **Đợt 2:** phần vần, bài 31–83. Làm ngay sau đợt 1, vì ở trường trẻ dùng thử cũng sắp học tới phần này.
- **Đợt 3:** Tập 2 đọc hiểu.
- **Có thể thêm:** tô chữ trên canvas, file thu âm, báo cáo theo môn cho phụ huynh, huy hiệu riêng cho Tiếng Việt.
