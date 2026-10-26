# Tiếng Việt lớp 1 (đợt 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Thêm môn Tiếng Việt lớp 1 (bài 1–30 sách Kết nối tri thức) vào So-Learn. Toán phải giữ nguyên hành vi.

**Architecture:**
- **Database:** thêm cột `subject` vào `topics` và `exercises`. Mọi truy vấn lọc theo môn.
- **Component:** các component làm bài chuyển sang `src/components/learn/` và dùng chung cho hai môn. Mỗi môn có hình minh họa riêng; Tiếng Việt thêm dạng bài "ghép tiếng".
- **Nội dung:** viết trong `src/content/tiengviet1.ts`. Một bộ kiểm tra thuần (`src/lib/tiengviet.ts`) chạy lúc sinh seed và trong test, bắt lỗi "dùng chữ chưa học" và lỗi chính tả.
- **Âm thanh:** dùng Web Speech API qua `useSpeech` có sẵn.
  - Đợt này chưa dùng cột `audio_url`.
  - Mọi lời đọc nằm trong trường `say` hoặc `UNIT_SAY`. Sau này muốn thêm file thu âm thì chỉ cần sửa `SpeakButton` và `useSpeech`.
- **`src/proxy.ts`:** không cần sửa vì `/tieng-viet` không thuộc danh sách trang cần đăng nhập.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind 4, Framer Motion, Supabase. Test bằng `node:test` chạy qua `node --experimental-strip-types` (Node 22.12, không cài thêm package).

**Spec:** `docs/superpowers/specs/2026-10-26-tieng-viet-lop1-design.md`

## Global Constraints

**Phụ thuộc và cách viết code**
- Không cài package npm mới. Không dùng `any`. Interface và type đặt trong `src/types/`.
- Chỉ dùng Tailwind class. Nội dung học tối thiểu `text-lg`. Nút bấm tối thiểu `py-3 px-6 text-lg`.
- Comment bằng tiếng Việt, cùng mật độ với code xung quanh.
- Server Component mặc định. Chỉ thêm `'use client'` cho component có tương tác.
- Không link ra ngoài, không quảng cáo.

**Database**
- Không sửa `supabase/migrations/20261022000000_init.sql`. Không đổi hay xóa RLS policy.
- Giá trị môn học chỉ có `'math'` và `'tieng-viet'`.
- Mã bài Tiếng Việt: `tv1-bai-01` … `tv1-bai-30`. Mã câu: `<mã bài>-<số thứ tự từ 1>`.

**File mà Node chạy trực tiếp**

Gồm: test, `scripts/*.mjs`, `src/content/*.ts`, `src/lib/tiengviet.ts`, `src/lib/build-state.ts`, `src/lib/questions.ts`, `src/lib/rewards.ts`, `src/types/*`.
- Chỉ dùng cú pháp TypeScript xóa được: không `enum`, không `namespace`, không parameter property.
- Import kiểu dùng `import type`.
- Import lúc chạy giữa các file này dùng đường dẫn tương đối có đuôi `.ts`, không dùng alias `@/`.

**Nội dung**
- Mọi chuỗi tiếng Việt viết ở dạng Unicode NFC.
- Nội dung tự soạn, không chép câu chữ hay hình trong SGK. Theo đúng thứ tự bài của bảng ở spec mục 3.
- Phần trẻ phải tự đọc chỉ dùng chữ và dấu đã học (spec 6.2).

**Môi trường và phát hành**
- Biến môi trường `TIENG_VIET_ENABLED=true` (đọc ở server) mới hiện các lối vào Tiếng Việt. URL `/tieng-viet/1` luôn mở được để duyệt.
- Làm trên nhánh `feat/tieng-viet-lop1`.
- Ba bước "Checkpoint" do chủ dự án làm: chạy SQL trên Supabase, deploy, nghe thử. Người thực hiện dừng lại chờ ở mỗi checkpoint.

## Review Focus

1. **Chuỗi có dấu khác chuẩn Unicode (NFD và NFC):** đáp án phải vẫn khớp lựa chọn, câu không bị âm thầm bỏ khỏi bài.
   - Task 6: test `toQuestion` với đáp án NFD.
   - Task 10: test mọi chuỗi nội dung là NFC.
2. **Bé bấm mảnh ghép lộn xộn** (đổi mảnh, bấm xóa, ghép sai nhiều lần): chỉ chấm khi đủ ba ô, mỗi lần chấm ghi đúng một lượt, sai thì ghép lại được, `firstTry` chỉ đúng khi chưa sai lần nào.
   - Task 5: test `evaluate` và trình tự đổi, xóa mảnh.
3. **Toán sau migration:** vẫn 20 bài và cùng số câu. Huy hiệu "Xong toán lớp 1" không được trao nhờ câu Tiếng Việt.
   - Task 7: test `rewards`.
   - Task 8: test seed đếm bài Toán.
4. **Máy không có giọng tiếng Việt:** trang vẫn dùng được và có dòng nhắc phụ huynh, không lỗi.
   - Task 4: kiểm tra tay trên trang thử.
5. **Màn hình 360px:** ô ghép, bốn lựa chọn như "◌̀ huyền", hàng emoji không tràn ngang.
   - Task 5 và Task 10: kiểm tra tay với DevTools ở 360px.

---

### Task 1: Bộ chạy test, cách đọc âm, trang thử giọng đọc

**Files:**
- Modify: `package.json` (thêm script `test`)
- Modify: `tsconfig.json` (thêm `"allowImportingTsExtensions": true` vào `compilerOptions`)
- Create: `src/content/tiengviet-sounds.ts`
- Create: `src/app/thu-giong-doc/page.tsx` (trang tạm, xóa ở Task 17)
- Test: `tests/tiengviet-sounds.test.mjs`

**Interfaces:**
- Produces:
  - `PHASE1_UNITS: string[]`: 39 âm/chữ của bài 1–30 theo thứ tự dạy: `a b c e ê o ô d đ ơ i k h l u ư ch kh m n g gi gh nh ng ngh r s t tr th ia ua ưa ph qu v x y`.
  - `UNIT_SAY: Record<string, string>`: cách đọc khi dạy của từng mục. Giá trị ban đầu:
    - nguyên âm và `ia`, `ua`, `ưa` đọc như chữ viết;
    - phụ âm đọc kèm "ờ": `b → 'bờ'`, `ch → 'chờ'`, `tr → 'trờ'`…;
    - riêng: `k → 'ca'`, `gh → 'gờ kép'`, `ngh → 'ngờ kép'`, `gi → 'di'`, `qu → 'quờ'`, `y → 'i dài'`.
  - Đầu file có comment `[Unverified]`: cách đọc này chờ người duyệt sửa.

- [ ] **Step 1: Thêm script test vào `package.json`**

`"test": "node --experimental-strip-types --no-warnings --test \"tests/**/*.test.mjs\""`

- [ ] **Step 2: Viết test**

```js
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PHASE1_UNITS, UNIT_SAY } from '../src/content/tiengviet-sounds.ts'

test('đủ 39 âm/chữ của bài 1–30, không trùng', () => {
  assert.equal(PHASE1_UNITS.length, 39)
  assert.equal(new Set(PHASE1_UNITS).size, 39)
})
test('mỗi âm/chữ có cách đọc, viết ở dạng NFC', () => {
  for (const u of PHASE1_UNITS) {
    assert.ok(UNIT_SAY[u]?.trim(), u)
    assert.equal(UNIT_SAY[u], UNIT_SAY[u].normalize('NFC'), u)
  }
})
```

- [ ] **Step 3: Chạy `npm run test`.** Kỳ vọng: FAIL vì không tìm thấy module `tiengviet-sounds.ts`.
- [ ] **Step 4: Viết `src/content/tiengviet-sounds.ts`** theo khối Interfaces ở trên.
- [ ] **Step 5: Chạy `npm run test`.** Kỳ vọng: PASS, 2 test.
- [ ] **Step 6: Viết `src/app/thu-giong-doc/page.tsx`**
  - Server Component, không gắn link từ trang nào.
  - Phần 1 "Âm và chữ": mỗi mục của `PHASE1_UNITS` có chữ in to và một `SpeakButton` đọc `UNIT_SAY[u]`.
  - Phần 2 "Dấu thanh": đọc lần lượt "dấu huyền", "dấu sắc", "dấu hỏi", "dấu ngã", "dấu nặng".
  - Phần 3 "Đánh vần": đọc các chuỗi `'bờ, a, ba'`, `'ba, huyền, bà'`, `'cờ, o, co, hỏi, cỏ'`, `'trờ, ưa, trưa'`, `'quờ, a, qua, sắc, quá'`, `'ngờ kép, e, nghe'`.
  - Dòng đầu trang: "Trang thử giọng đọc, sẽ xóa".
- [ ] **Step 7: Kiểm tra**
  - `npm run type-check` và `npm run lint` không lỗi.
  - `npm run dev`, mở `http://localhost:3000/thu-giong-doc`, bấm vài nút: nghe được tiếng.
- [ ] **Step 8: Commit**

```bash
git checkout -b feat/tieng-viet-lop1
git add package.json tsconfig.json src/content/tiengviet-sounds.ts src/app/thu-giong-doc tests/tiengviet-sounds.test.mjs
git commit -m "feat(tieng-viet): cách đọc âm bài 1–30 và trang thử giọng đọc"
```

### Task 2: Kiểu dữ liệu và xử lý tiếng (âm đầu, vần, thanh)

**Files:**
- Create: `src/types/tiengviet.ts`, `src/types/lesson.ts`
- Create: `src/lib/tiengviet.ts`
- Test: `tests/tiengviet-syllable.test.mjs`

**Interfaces:**

`src/types/tiengviet.ts`:
```ts
export type Tone = 'ngang' | 'huyen' | 'sac' | 'hoi' | 'nga' | 'nang'
export interface PictureWord { emoji: string; word: string }
/** Một bước đánh vần: các mảnh → kết quả, kèm lời đọc ("bờ, a, ba") */
export interface SpellStep { parts: string[]; result: string; say: string }
export type ReadingVisual =
  | { kind: 'letter'; letters: string[]; say: string }                     // chữ mới, ví dụ ['A', 'a']
  | { kind: 'scene'; emoji: string[]; sentence: string; highlight: string[] } // thẻ Nhận biết (miễn kiểm tra chữ đã học)
  | { kind: 'picture'; emoji: string; word?: string }                       // không có word khi word là đáp án
  | { kind: 'pictures'; items: PictureWord[] }
  | { kind: 'spell'; steps: SpellStep[] }
  | { kind: 'sentence'; text: string; highlight: string[] }                // câu trẻ tự đọc
  | { kind: 'listen'; say: string }
  | { kind: 'tone'; emoji: string; base: string }                         // tiếng chưa có dấu
  | { kind: 'build'; emoji?: string; say: string; onsets: string[]; rimes: string[]; tones: Tone[] }
export type BuildVisual = Extract<ReadingVisual, { kind: 'build' }>
export interface ReadingIntro { text: string; visual: ReadingVisual }
export interface ReadingExerciseSeed {
  prompt: string; visual: ReadingVisual; options: string[]; answer: string; explain: string
  difficulty: 1 | 2 | 3
  /** Bài chính tả: lựa chọn sai được phép viết sai chính tả */
  allowMisspelled?: boolean
}
export interface ReadingLessonSeed {
  number: number; slug: string; title: string; mark: string; description: string
  /** Âm/chữ/vần và dấu thanh bài này dạy mới */
  teaches: { units: string[]; tones: Tone[] }
  intro: ReadingIntro[]; exercises: ReadingExerciseSeed[]
}
export interface ReadingChapterSeed { number: number; title: string; lessons: ReadingLessonSeed[] }
export interface SyllableParts { onset: string; rime: string; tone: Tone }
export interface Learned { units: Set<string>; tones: Set<Tone> }
```

`src/types/lesson.ts`:
```ts
export type Subject = 'math' | 'tieng-viet'
export type LessonVisual = QuestionVisual | ReadingVisual   // hai bộ `kind` không trùng tên
export interface LessonIntroItem { text: string; visual: LessonVisual }
export interface ChoiceQuestion { type: 'choice'; id: string; prompt: string; visual: LessonVisual; options: string[]; correct: number; explain: string }
export interface BuildQuestion { type: 'build'; id: string; prompt: string; visual: BuildVisual; answer: string; explain: string }
export type LessonQuestion = ChoiceQuestion | BuildQuestion
export interface SubjectInfo { id: Subject; path: string; name: string; notebook: string; chapterLabel: string; wrongHint: string }
```

`src/lib/tiengviet.ts` (Produces):
- `TONES: Tone[]`, theo thứ tự ngang, huyền, sắc, hỏi, ngã, nặng.
- `TONE_NAMES: Record<Tone, string>`: `{ ngang: 'không dấu', huyen: 'huyền', sac: 'sắc', hoi: 'hỏi', nga: 'ngã', nang: 'nặng' }`.
- `toneLabel(tone: Tone): string`: `'không dấu'` cho thanh ngang; các thanh khác là `'◌' + dấu kết hợp + ' ' + tên`, ví dụ `'◌̀ huyền'`.
- `toneOf(syllable: string): Tone`
- `stripTone(syllable: string): string`
- `splitSyllable(syllable: string): SyllableParts` (vần trả về không có dấu)
- `composeSyllable(onset: string, rime: string, tone: Tone): string`
- `syllablesOf(text: string): string[]`: các cụm chữ cái, viết thường.

Thuật toán (chỉ cho vần mở của đợt 1: một nguyên âm, `ia`, `ua`, `ưa`):
- **Tách dấu thanh:** NFD → tìm và bỏ một trong `̀ ́ ̉ ̃ ̣` → NFC.
- **Âm đầu:** so khớp dài nhất trong danh sách `ngh ng nh ch gh gi kh ph qu th tr b c d đ g h k l m n p r s t v x`.
  - `gi` đứng cuối từ hoặc trước phụ âm thì `i` là vần: `gì` → `{ onset: 'gi', rime: 'i' }`.
  - Khi ghép `gi` + vần bắt đầu bằng `i`, bỏ bớt một `i`.
- **Đặt dấu:** đặt trên nguyên âm đầu tiên của vần (vì `qu`, `gi` thuộc âm đầu, `quá` và `giả` vẫn đúng).

- [ ] **Step 1: Viết test**

```js
const cases = [ // [tiếng, âm đầu, vần, thanh]
  ['bà','b','a','huyen'], ['nghé','ngh','e','sac'], ['giữa','gi','ưa','nga'], ['quả','qu','a','hoi'],
  ['gì','gi','i','huyen'], ['ê','','ê','ngang'], ['chó','ch','o','sac'], ['mía','m','ia','sac'],
  ['của','c','ua','hoi'], ['trừa','tr','ưa','huyen'], ['ộ','','ô','nang'], ['y','','y','ngang'],
]
test('splitSyllable và composeSyllable khớp nhau', () => {
  for (const [s, onset, rime, tone] of cases) {
    assert.deepEqual(splitSyllable(s), { onset, rime, tone }, s)
    assert.equal(composeSyllable(onset, rime, tone), s, s)
  }
})
test('đặt dấu đúng chỗ', () => {
  assert.equal(composeSyllable('qu', 'a', 'sac'), 'quá')
  assert.equal(composeSyllable('gi', 'a', 'hoi'), 'giả')
  assert.equal(composeSyllable('gi', 'i', 'huyen'), 'gì')
})
test('toneOf, stripTone, toneLabel, syllablesOf', () => {
  assert.equal(toneOf('bộ'), 'nang'); assert.equal(toneOf('ba'), 'ngang')
  assert.equal(stripTone('trừa'), 'trưa'); assert.equal(stripTone('giữa'), 'giưa')
  assert.equal(toneLabel('ngang'), 'không dấu'); assert.equal(toneLabel('huyen'), '◌̀ huyền'.normalize('NFC'))
  assert.deepEqual(syllablesOf('Bà bế bé.'), ['bà', 'bế', 'bé'])
  assert.deepEqual(syllablesOf('🐟 🐄'), [])
})
test('kết quả ở dạng NFC', () => {
  for (const [s] of cases) assert.equal(s, s.normalize('NFC'))
  assert.equal(composeSyllable('tr', 'ưa', 'huyen'), 'trừa'.normalize('NFC'))
})
```

- [ ] **Step 2: Chạy `npm run test`.** Kỳ vọng: FAIL vì không tìm thấy module.
- [ ] **Step 3: Tạo hai file type và viết `src/lib/tiengviet.ts`** theo các chữ ký ở trên.
- [ ] **Step 4: Chạy `npm run test`.** Kỳ vọng: PASS. Chạy thêm `npm run type-check`: không lỗi.
- [ ] **Step 5: Commit**: `feat(tieng-viet): kiểu dữ liệu và tách/ghép tiếng`

### Task 3: Kiểm tra nội dung (chữ đã học, chính tả)

**Files:**
- Modify: `src/lib/tiengviet.ts`
- Test: `tests/tiengviet-rules.test.mjs`

**Interfaces:**
- Consumes: các hàm và kiểu của Task 2.
- Produces:
  - `spellingError(syllable: string): string | null`:
    - c, g, ng đứng trước vần bắt đầu bằng i, e, ê (kể cả `ia`) là lỗi;
    - k, gh, ngh đứng trước vần khác là lỗi, trừ `k` trước `y`;
    - `gi`, `qu` không xét.
  - `learnedError(syllable: string, learned: Learned): string | null`:
    - âm đầu khác rỗng mà chưa có trong `learned.units` là lỗi;
    - vần không nằm nguyên trong `learned.units` là lỗi;
    - thanh khác `ngang` mà chưa có trong `learned.tones` là lỗi.
  - `readableTexts(visual: ReadingVisual): string[]`, lấy phần trẻ tự đọc:
    - `picture`: `word` nếu có;
    - `pictures`: các `word`;
    - `spell`: các `result`;
    - `sentence`: `text`;
    - `tone`: `base`;
    - các kind còn lại: `[]`.
  - `exerciseReadables(ex: ReadingExerciseSeed): string[]`: `readableTexts(ex.visual)`, cộng `ex.options` (trừ khi kind là `listen` hoặc `tone`), cộng `[ex.answer]` khi kind là `build`.
  - `checkLessons(lessons: ReadingLessonSeed[]): string[]`:
    - Duyệt theo thứ tự, cộng dồn `teaches`; bài N được dùng cả những gì bài N dạy.
    - Với mỗi thẻ và mỗi câu, tách tiếng bằng `syllablesOf` rồi chạy `learnedError` và `spellingError`.
    - Bỏ qua `spellingError` cho các lựa chọn khác đáp án khi câu có `allowMisspelled`.
    - Câu có kind `tone`: mỗi lựa chọn phải là `toneLabel` của một thanh đã học.
    - Thông báo lỗi có dạng `Bài 3 (tv1-bai-03), câu 2: "ke" chưa học "k"` (hoặc `thẻ 1`).

- [ ] **Step 1: Viết test**
  - Các trường hợp `spellingError`:
    - trả về `null`: `ke`, `kìa`, `ghi`, `ga`, `nghe`, `kỹ`, `quê`, `gì`;
    - trả về lỗi: `ce`, `ka`, `gha`, `nge`, `cia`.
  - `learnedError('bé', {units: {a, b}, tones: {huyen}})` báo lỗi cả `e` lẫn dấu sắc. Có thể trả về chuỗi gộp; test kiểm tra chuỗi chứa `"e"` và `sắc`.
  - `checkLessons` với dữ liệu mẫu hai bài. Bài 1 dạy `a`. Bài 2 dạy `b` và huyền, có các câu:
    - `picture` với word `bà`: không lỗi;
    - `picture` với word `bé`: có lỗi;
    - `scene` có câu chứa chữ chưa học: không lỗi;
    - `listen` với lựa chọn `['b', 'm']`: không lỗi;
    - `tone` với lựa chọn `[toneLabel('ngang'), toneLabel('huyen')]`: không lỗi; thêm `toneLabel('sac')` thì có lỗi.
  - `checkLessons` với một bài dạy `k`, `e`, `c`, dấu hỏi, có câu `allowMisspelled` gồm lựa chọn `['kẻ', 'cẻ']` và đáp án `kẻ`: trả về `[]`. Bỏ `allowMisspelled` thì có lỗi chứa `"cẻ"`.
- [ ] **Step 2: Chạy `npm run test`.** Kỳ vọng: FAIL vì chưa export các hàm này.
- [ ] **Step 3: Viết các hàm** theo khối Interfaces.
- [ ] **Step 4: Chạy `npm run test`.** Kỳ vọng: PASS.
- [ ] **Step 5: Commit**: `feat(tieng-viet): kiểm tra chữ đã học và chính tả`

### Task 4: Hình minh họa Tiếng Việt và kiểm tra giọng đọc

**Files:**
- Create: `src/components/tieng-viet/ReadingVisualView.tsx` (`'use client'`)
- Create: `src/hooks/useVietnameseVoice.ts`
- Modify: `src/app/thu-giong-doc/page.tsx` (thêm mẫu hình và trạng thái giọng đọc)

**Interfaces:**
- Consumes: `ReadingVisual` (Task 2), `useSpeech()` có sẵn.
- Produces:
  - `export default function ReadingVisualView({ visual }: { visual: ReadingVisual })`.
  - `export type VoiceStatus = 'checking' | 'ready' | 'missing' | 'unsupported'`.
  - `export function useVietnameseVoice(): VoiceStatus`:
    - nghe sự kiện `voiceschanged`;
    - `ready` khi có giọng có `lang` bắt đầu bằng `vi`, `missing` khi đã có danh sách giọng mà không có giọng nào như vậy;
    - giữ `checking` nếu danh sách vẫn rỗng.

Cách vẽ từng kind. Mọi phần bấm được là `<button>` có `aria-label` và gọi `speak(...)`:
- `letter`: các chữ cỡ `text-7xl`. Bấm cả khối để đọc `say`.
- `scene`: một hàng emoji `text-6xl`, câu `text-2xl` bên dưới. Tiếng nằm trong `highlight` có nền `bg-sun/40`. Bấm câu để đọc câu.
- `picture`: emoji `text-7xl`. Có `word` thì hiện chữ `text-3xl` và bấm được để nghe.
- `pictures`: lưới thẻ, mỗi thẻ có emoji và chữ, bấm để nghe từ.
- `spell`: mỗi bước một hàng: mảnh, dấu `+`, mảnh, `→`, kết quả. Bấm hàng để đọc `say`.
- `sentence`: câu `text-3xl`, tô màu theo `highlight`, có nút nghe cả câu.
- `listen`: nút loa tròn lớn (`size-28`), có chữ "Bấm để nghe", đọc `say`.
- `tone`: emoji kèm `base` cỡ `text-4xl` và ô dấu đang trống.
- `build`: emoji (nếu có) kèm nút loa đọc `say`.

- [ ] **Step 1: Viết `useVietnameseVoice` và `ReadingVisualView`** theo khối Interfaces.
- [ ] **Step 2: Thêm vào trang thử**
  - Mỗi kind một mẫu cố định, ví dụ `scene` dùng `🐄 👵` với câu "Bà có bò." và highlight `['bà', 'bò']`.
  - Một dòng hiện `VoiceStatus` (tách thành một client component nhỏ trong cùng thư mục).
- [ ] **Step 3: Kiểm tra**
  - `npm run type-check` và `npm run lint` không lỗi.
  - `npm run dev`, mở `/thu-giong-doc`:
    - mọi mẫu hiện đúng, bấm vào là có tiếng;
    - ở 360px (DevTools) không cuộn ngang;
    - trên trình duyệt không có giọng `vi`, dòng trạng thái là `missing`.
- [ ] **Step 4: Commit**: `feat(tieng-viet): hình minh họa và kiểm tra giọng đọc`

### Task 5: Dạng bài ghép tiếng

**Files:**
- Create: `src/lib/build-state.ts`
- Create: `src/components/learn/SolvedFeedback.tsx`
- Create: `src/components/tieng-viet/BuildSyllable.tsx` (`'use client'`)
- Modify: `src/components/math/QuestionSheet.tsx` (dùng `SolvedFeedback` thay cho đoạn hiện con dấu và lời giải, hiển thị giữ nguyên)
- Modify: `src/app/thu-giong-doc/page.tsx` (thêm một câu ghép mẫu)
- Test: `tests/build-state.test.mjs`

**Interfaces:**
- Consumes: `composeSyllable` (Task 2), `BuildQuestion` (Task 2), `ReadingVisualView` (Task 4).
- Produces:
  - Trong `src/lib/build-state.ts`:
    - `interface BuildState { onset: string | null; rime: string | null; tone: Tone | null }`. Interface này đặt trong `src/types/tiengviet.ts`.
    - `EMPTY_BUILD: BuildState`.
    - `pickTile(s: BuildState, slot: 'onset' | 'rime' | 'tone', value: string): BuildState`: thay giá trị ở ô đó.
    - `undoTile(s: BuildState): BuildState`: xóa ô cuối còn giá trị, theo thứ tự tone → rime → onset.
    - `evaluate(s: BuildState, answer: string): 'incomplete' | 'correct' | 'wrong'`.
  - `SolvedFeedback({ solved, firstTry, showReward, explain, wrongHint, hasWrong, children })`: phần `aria-live` lấy ra từ `QuestionSheet` (con dấu `RedStamp`, "Đúng rồi!" và lời giải, hoặc lời nhắc khi sai).
  - `BuildSyllable` có props giống `QuestionSheet` để `QuizRunner` đổi qua lại được:
    ```ts
    { question: BuildQuestion; wrongHint: string; onSolved?: (firstTry: boolean) => void
      onAttempt?: (isCorrect: boolean, seconds: number) => void; showReward?: boolean; children?: React.ReactNode }
    ```

Hành vi của `BuildSyllable`:
- **Bố cục từ trên xuống:**
  - đề bài kèm `SpeakButton`;
  - `ReadingVisualView` với `question.visual`;
  - ba ô trống (Âm đầu, Vần, Dấu);
  - ba hàng mảnh lấy từ `onsets`, `rimes`, `tones`; mảnh dấu hiện `toneLabel`;
  - nút "Xóa" (`undoTile`).
- **Ô xem trước:** khi đủ ba ô thì hiện tiếng ghép được (`composeSyllable`).
- **Chấm bài:**
  - Chỉ chấm khi `evaluate` khác `incomplete`. Mỗi lần chấm gọi `onAttempt` đúng một lần, kèm số giây như `QuestionSheet`.
  - Sai: rung như `AnswerOption`, sau khoảng 0,6 giây trả về `EMPTY_BUILD`.
  - Đúng: khóa các mảnh và gọi `onSolved(chưa sai lần nào)`.
- **Kích thước:** mảnh tối thiểu `min-h-16`, `text-2xl`, xuống dòng được (`flex-wrap`).

- [ ] **Step 1: Viết test**
```js
let s = pickTile(pickTile(pickTile(EMPTY_BUILD, 'onset', 'b'), 'rime', 'a'), 'tone', 'huyen')
assert.equal(evaluate(s, 'bà'), 'correct')
assert.equal(evaluate(pickTile(s, 'tone', 'sac'), 'bà'), 'wrong')
assert.equal(evaluate(pickTile(EMPTY_BUILD, 'onset', 'b'), 'bà'), 'incomplete')
assert.equal(evaluate(pickTile(s, 'tone', 'ngang'), 'ba'), 'correct')
assert.deepEqual(undoTile(s), { onset: 'b', rime: 'a', tone: null })
assert.deepEqual(undoTile(undoTile(undoTile(s))), EMPTY_BUILD)
assert.deepEqual(undoTile(EMPTY_BUILD), EMPTY_BUILD)
assert.equal(evaluate(pickTile(pickTile(pickTile(EMPTY_BUILD,'onset','tr'),'rime','ưa'),'tone','huyen'), 'trừa'), 'correct')
```
- [ ] **Step 2: Chạy `npm run test`.** Kỳ vọng: FAIL vì không tìm thấy module.
- [ ] **Step 3: Viết `build-state.ts`.** Chạy `npm run test`: PASS.
- [ ] **Step 4: Tách `SolvedFeedback` ra khỏi `QuestionSheet`, viết `BuildSyllable`, thêm mẫu vào trang thử.**
- [ ] **Step 5: Kiểm tra**
  - `npm run type-check`, `npm run lint` và `npm run build` không lỗi. `build` cũng xác nhận Next xử lý được import có đuôi `.ts`.
  - Trên `/thu-giong-doc`, câu ghép mẫu:
    - ghép sai thì rung rồi trống lại;
    - ghép đúng thì có con dấu;
    - nút Xóa hoạt động;
    - ở 360px không tràn.
  - Mở một bài Toán `/math/1/<slug>`: phần con dấu và lời giải hiển thị như cũ.
- [ ] **Step 6: Commit**: `feat(tieng-viet): dạng bài ghép tiếng`

### Task 6: Component bài học dùng chung cho hai môn

**Files:**
- Move (`git mv`) từ `src/components/math/` sang `src/components/learn/`: `AnswerOption.tsx`, `LessonView.tsx`, `QuestionSheet.tsx`, `QuizResult.tsx`, `QuizRunner.tsx`, `SpeakButton.tsx`, `TopicMark.tsx`
- Create: `src/components/learn/LessonVisualView.tsx`
- Create: `src/lib/questions.ts`, `src/lib/subjects.ts`
- Modify:
  - `src/types/database.ts`: `TopicRow.intro: LessonIntroItem[]`, `ExerciseRow.visual: LessonVisual | null`
  - `src/lib/data.ts`: `getLesson` dùng `toQuestion` mới
  - `src/app/math/[grade]/[topic]/page.tsx`
  - mọi file import component đã chuyển: landing, dashboard, trang thử
- Test: `tests/questions.test.mjs`

**Interfaces:**
- Consumes: `LessonQuestion`, `LessonVisual`, `SubjectInfo` (Task 2); `ReadingVisualView` (Task 4); `BuildSyllable` (Task 5).
- Produces:
  - `src/lib/questions.ts`:
    - `isReadingVisual(v: LessonVisual): v is ReadingVisual`: dựa trên tập kind `letter scene picture pictures spell sentence listen tone build`.
    - `toQuestion(row: ExerciseRecord): LessonQuestion | null`:
      - `type === 'drag_drop'`, visual có kind `build` và có `answer` thì trả về `BuildQuestion`;
      - còn lại trả về `ChoiceQuestion`, với `correct` là vị trí của đáp án trong lựa chọn sau khi chuẩn hóa NFC cả hai bên;
      - không có visual hoặc không tìm thấy đáp án thì trả về `null`.
  - `src/lib/subjects.ts`:
    - `SUBJECTS: Record<Subject, SubjectInfo>`:
      - `math`: `{ path: '/math', name: 'Toán', notebook: 'Vở toán', chapterLabel: 'Chủ đề', wrongHint: 'Chưa đúng, bé đếm lại rồi chọn tiếp nhé.' }`
      - `tieng-viet`: `{ path: '/tieng-viet', name: 'Tiếng Việt', notebook: 'Vở Tiếng Việt', chapterLabel: 'Phần', wrongHint: 'Chưa đúng, bé nghe lại rồi chọn tiếp nhé.' }`
    - `gradeHref(subject, grade): string`
    - `lessonHref(subject, grade, slug): string`
  - `LessonVisualView({ visual }: { visual: LessonVisual })`: chuyển sang `ReadingVisualView` hoặc `CountingVisual`.
  - Props mới:
    - `LessonView`: thêm `subject: Subject`; `questions: LessonQuestion[]`; `lesson.intro: LessonIntroItem[]`. Tiêu đề chương dùng `SUBJECTS[subject].chapterLabel`. Với `tieng-viet` và `useVietnameseVoice() === 'missing'`, hiện dòng: "Máy này có thể chưa có giọng đọc tiếng Việt. Bố mẹ cài thêm giọng tiếng Việt trong phần cài đặt của máy để bé nghe được bài."
    - `QuizRunner`: `questions: LessonQuestion[]`, `wrongHint: string`. Câu `choice` dùng `QuestionSheet`, câu `build` dùng `BuildSyllable`.
    - `QuestionSheet`: `question: ChoiceQuestion`, `wrongHint: string`. Vẽ hình bằng `LessonVisualView`.
  - `getLesson` trả về `{ topic: TopicRecord; questions: LessonQuestion[] }`.

- [ ] **Step 1: Viết test `toQuestion`**
  - Dòng Toán (visual `count`) trả về `{ type: 'choice', correct: 2 }`.
  - Đáp án không có trong lựa chọn: `null`.
  - `visual: null`: `null`.
  - Đáp án viết NFD `'bà'`, lựa chọn có `'bà'`: vẫn khớp.
  - Dòng `drag_drop` với visual `build` và đáp án `bà`: `{ type: 'build', answer: 'bà' }`.
  - Dòng `multiple_choice` với visual `listen`: kiểu `choice`.
  - `isReadingVisual({ kind: 'count', item: 'dot', count: 1 })` là false; `isReadingVisual({ kind: 'listen', say: 'a' })` là true.
- [ ] **Step 2: Chạy `npm run test`.** Kỳ vọng: FAIL vì không tìm thấy module.
- [ ] **Step 3: Viết `questions.ts` và `subjects.ts`.** Chạy `npm run test`: PASS.
- [ ] **Step 4: Chuyển file, đổi props, sửa import**
  - Trang Toán truyền `subject="math"`.
  - Sau khi sửa, lệnh `git grep -nE "components/math/(AnswerOption|LessonView|QuestionSheet|QuizResult|QuizRunner|SpeakButton|TopicMark)"` không còn kết quả.
- [ ] **Step 5: Kiểm tra**
  - `npm run type-check`, `npm run lint`, `npm run build` không lỗi.
  - `npm run dev`, mở một bài Toán:
    - phần Cùng học, Luyện tập và lời nhắc khi sai ("bé đếm lại") giống hệt trước;
    - trang chủ vẫn chạy được phần chơi thử (`HeroPlayground`).
- [ ] **Step 6: Commit**: `refactor: component bài học dùng chung cho hai môn`

### Task 7: Cột `subject` trong database và truy vấn theo môn

**Files:**
- Create: `supabase/migrations/20261026000000_subject.sql`
- Modify:
  - `src/types/database.ts`: `subject: Subject` trong `TopicRow` và `ExerciseRow`
  - `src/lib/data.ts`
  - `src/lib/rewards.ts`
  - `src/app/math/[grade]/page.tsx`, `src/app/math/[grade]/[topic]/page.tsx`, `src/app/dashboard/page.tsx`
- Test: `tests/rewards.test.mjs`

**Interfaces:**
- Produces:
  - `getGradeOutline(subject: Subject, grade: number): Promise<ChapterSummary[]>`: thêm `.eq('subject', subject)` vào cả hai truy vấn.
  - `getLesson(subject: Subject, slug: string)`: lọc topic theo `subject`.
  - `getExerciseIds(subject: Subject, grade: number): Promise<string[]>`: thay cho `countGradeExercises`.
  - `BadgeCheck` thêm `gradeSolved: number` (số câu Toán lớp 1 đã giải). Điều kiện của `grade1_done`: `s.gradeTotal > 0 && s.gradeSolved >= s.gradeTotal`.
  - Trong `awardBadges`:
    - `gradeTotal = ids.length`
    - `gradeSolved = ids.filter(id => results.get(id)?.solved).length`
    - `ids = await getExerciseIds('math', 1)`; `results = summarizeAttempts(attempts)`.

Migration (nội dung chính xác):
```sql
-- Thêm môn học. Chạy một lần, sau file 20261022000000_init.sql. Dữ liệu cũ tự nhận 'math'.
alter table public.topics add column subject text not null default 'math' check (subject in ('math', 'tieng-viet'));
alter table public.exercises add column subject text not null default 'math' check (subject in ('math', 'tieng-viet'));
alter table public.topics drop constraint if exists topics_grade_position_key;
alter table public.topics add constraint topics_subject_grade_position_key unique (subject, grade, position);
create index exercises_subject_grade_idx on public.exercises (subject, grade);
```

- [ ] **Step 1: Viết test `rewards`**
  - Đặt `const grade1 = BADGES.find(b => b.type === 'grade1_done')`.
  - `grade1.earned({ stars: 0, solvedCount: 300, streakDays: 0, gradeTotal: 128, gradeSolved: 127 })` là false.
  - Với `gradeSolved: 128`: true.
  - Với `gradeTotal: 0`: false.
- [ ] **Step 2: Chạy `npm run test`.** Kỳ vọng: FAIL vì điều kiện cũ dựa vào `solvedCount`.
- [ ] **Step 3: Viết migration, sửa `rewards.ts`, `database.ts`, `data.ts` và các trang gọi.**
- [ ] **Step 4: Kiểm tra**
  - `npm run test` PASS.
  - `npm run type-check`, `npm run lint`, `npm run build` không lỗi.
  - Chưa chạy thử với database được: cột chưa có cho tới Checkpoint A.
- [ ] **Step 5: Commit**: `feat: cột subject, truy vấn theo môn, huy hiệu toán chỉ đếm câu toán`

### Task 8: Seed cho hai môn

**Files:**
- Create: `scripts/seed-rows.mjs`
- Create: `src/content/tiengviet1.ts`, tạm thời chỉ có `export const tiengViet1Chapters: ReadingChapterSeed[] = []`
- Modify: `scripts/build-seed.mjs`, `supabase/seed.sql` (sinh lại)
- Test: `tests/seed.test.mjs`

**Interfaces:**
- Consumes: `checkLessons` (Task 3), `grade1Chapters`.
- Produces:
  - `buildSeed(sources: { subject, grade, chapters }[]): { topics: object[]; exercises: object[] }`:
    - cột giống bảng, có thêm `subject`;
    - `position` của bài đánh lại từ 1 cho mỗi nguồn;
    - `type` là `'drag_drop'` khi `visual?.kind === 'build'`, còn lại là `'multiple_choice'`.
  - `toSql(seed): string`:
    - một lệnh `insert` cho topics và một cho exercises;
    - phần `on conflict … do update set` có thêm `subject = excluded.subject`.
  - `build-seed.mjs`:
    - chạy `checkLessons` cho mọi bài Tiếng Việt;
    - có lỗi thì in từng dòng và thoát mã 1;
    - không lỗi thì ghi `seed.sql` và in số bài/câu theo từng môn.

- [ ] **Step 1: Ghi lại số liệu hiện tại.** Chạy `npm run seed:build` trên code chưa sửa, ghi lại số bài và số câu Toán in ra. Docs ghi 20 bài và 128 câu.
- [ ] **Step 2: Viết test**
  - Dữ liệu mẫu: 2 bài Toán và 2 bài Tiếng Việt, một trong số đó có câu `build`. Kiểm tra:
    - mỗi môn có `position` là `[1, 2]`;
    - `subject` đúng;
    - câu `build` có type `drag_drop`;
    - `toSql` chứa `subject = excluded.subject` đúng 2 lần.
  - Với `grade1Chapters` thật: số topics và exercises bằng số liệu ở Step 1, mọi dòng có `subject === 'math'`.
- [ ] **Step 3: Chạy `npm run test`.** Kỳ vọng: FAIL vì không tìm thấy module `seed-rows.mjs`.
- [ ] **Step 4: Viết `seed-rows.mjs`, sửa `build-seed.mjs`, tạo file nội dung rỗng.**
- [ ] **Step 5: Kiểm tra**
  - `npm run test` PASS.
  - `npm run seed:build` in ra số bài Toán như Step 1 và 0 bài Tiếng Việt.
  - `git diff supabase/seed.sql` chỉ khác ở cột `subject` thêm vào.
- [ ] **Step 6: Commit**: `feat: seed cho hai môn, chặn nội dung sai quy tắc`

### Checkpoint A (chủ dự án làm, người thực hiện dừng chờ)

1. **Chạy migration:** dán `supabase/migrations/20261026000000_subject.sql` vào Supabase SQL Editor rồi bấm Run. Kiểm tra bằng hai câu lệnh:
   - `select subject, count(*) from public.topics group by subject;` → chỉ có `math | 20`.
   - `select conname from pg_constraint where conrelid = 'public.topics'::regclass;` → có `topics_subject_grade_position_key`, không còn `topics_grade_position_key`.
2. **Deploy:** gộp nhánh vào `main` và push để Vercel deploy. Trên site thật, kiểm tra mục lục Toán, một bài Toán, trang học và trang phụ huynh vẫn như cũ.
3. **Nghe thử:** mở `/thu-giong-doc` trên các máy người quen sẽ dùng, nghe hết ba phần.
   - Nghe được: làm tiếp.
   - Không nghe được hoặc đọc sai nhiều: **dừng lại**. Hỏi chủ dự án về thu âm trước khi soạn nội dung (spec mục 7).

### Task 9: Trang Tiếng Việt và công tắc bật/tắt

**Files:**
- Create: `src/lib/features.ts`
- Create: `src/components/learn/LessonRow.tsx`, `src/components/learn/NotebookCover.tsx` (tách từ `src/app/math/[grade]/page.tsx`)
- Create: `src/app/tieng-viet/[grade]/page.tsx`, `src/app/tieng-viet/[grade]/[topic]/page.tsx`
- Modify: `src/app/math/[grade]/page.tsx` (dùng component vừa tách, hiển thị giữ nguyên)

**Interfaces:**
- Produces:
  - `isTiengVietEnabled(): boolean`: trả về `process.env.TIENG_VIET_ENABLED === 'true'`. Chỉ gọi ở server.
  - `LessonRow` và `statusOf(s: LessonState, hasStudent: boolean): LessonStatus`: giữ nguyên markup hiện tại.
  - `NotebookCover(props: NotebookCoverProps)` với `{ big: string; title: string; summary: string; coverClass: string; textClass: string; solved: number | null; total: number; note: string }`. Interface đặt trong `src/types/lesson.ts`.

Trang `/tieng-viet/[grade]`:
- Chỉ nhận `grade === '1'`, còn lại `notFound()`. Supabase chưa cấu hình thì hiện `SetupNotice`.
- **Bìa:**
  - `big` là `"1"`, tiêu đề "Vở Tiếng Việt lớp 1", tóm tắt "Học âm, chữ và dấu thanh theo sách Kết nối tri thức".
  - Màu bìa chọn một token có sẵn, khác `bg-sun` của Toán.
- **Mục lục:** mỗi chương có tiêu đề "Phần {number}" kèm tên chương. Mỗi dòng ghi nhãn `Bài ${s.lesson.position}`, là số bài theo sách.
- **Liên kết:** dòng bài dùng `lessonHref('tieng-viet', 1, slug)`. Ghi chú cho khách có link `/login?next=/tieng-viet/1`.
- **Chưa có bài:** hiện "Bài học đang được soạn".

Trang bài học: làm giống trang bài Toán, khác ở các điểm:
- truyền `subject="tieng-viet"`;
- nút quay lại về `/tieng-viet/1`;
- `notFound()` khi lớp khác 1, không có bài, hoặc bài không có câu nào.

- [ ] **Step 1: Tách `LessonRow` và `NotebookCover`.** Trang Toán dùng lại hai component này. Kiểm tra `/math/1` hiển thị không đổi.
- [ ] **Step 2: Viết `features.ts` và hai trang Tiếng Việt.**
- [ ] **Step 3: Kiểm tra**
  - `npm run type-check`, `npm run lint`, `npm run build` không lỗi.
  - `npm run dev`:
    - `/tieng-viet/1` hiện "Bài học đang được soạn";
    - `/tieng-viet/2` trả về 404;
    - `/math/1` như cũ.
- [ ] **Step 4: Commit**: `feat(tieng-viet): trang mục lục và bài học`

### Task 10: Nội dung bài 1–5 và test nội dung

**Files:**
- Modify: `src/content/tiengviet1.ts`
- Test: `tests/tiengviet-content.test.mjs`

**Interfaces:**
- Consumes: `UNIT_SAY` (Task 1); `composeSyllable`, `splitSyllable`, `toneLabel`, `TONE_NAMES`, `checkLessons` (Task 2–3).
- Produces: `tiengViet1Chapters`. Chương 1 có `title: 'Âm và chữ: a, b, c, e, ê'`, gồm các bài 1–5.

**Hàm tạo câu trong file nội dung.** Mỗi hàm trả về `ReadingExerciseSeed`. Hàm nào có lựa chọn thì báo lỗi khi đáp án không nằm trong lựa chọn. Đề bài cố định như sau:

| Hàm | Đề bài | Lời giải |
|---|---|---|
| `listenEx(answer, options)` | "Bé bấm loa, nghe rồi chọn chữ đúng." | `Đó là chữ ${answer}.`; visual `listen` với `say = UNIT_SAY[answer] ?? answer` |
| `pictureEx(emoji, word, options)` | "Tranh vẽ gì? Bé chọn chữ đúng." | `Tranh vẽ "${word}".`; visual `picture` không có `word` |
| `findEx(unit, answer, options)` | `Tiếng nào có ${unit}?` | `"${answer}" có ${unit}.` |
| `findPictureEx(unit: string, answer: PictureWord, others: PictureWord[])` (chỉ bài 1) | `Tranh nào có tiếng chứa ${unit}?`; lựa chọn là các emoji | `Tranh ${answer.emoji} là "${answer.word}", có ${unit}.` |
| `toneEx(emoji, word, tones)` | "Bé chọn dấu để được tiếng chỉ tranh." | `${base} thêm dấu ${TONE_NAMES[tone]} thành ${word}.`, hoặc `${word} không có dấu.` |
| `buildEx(emoji, word, onsets, rimes, tones)` | "Bé ghép tiếng chỉ tranh." | |

Thêm cho từng hàm:
- `toneEx`: lựa chọn là `tones.map(toneLabel)`.
- `buildEx`: `answer = word`, `options = []`. Lời đọc của visual là chính `word`.
- `spell(onset, rime, tone): SpellStep[]`:
  - bước 1: `[onset, rime]` → `onset + rime`, đọc `"${UNIT_SAY[onset]}, ${UNIT_SAY[rime]}, ${onset + rime}"`;
  - bước 2 (khi có dấu): `[onset + rime, toneLabel(tone)]` → tiếng có dấu, đọc `"${onset + rime}, ${TONE_NAMES[tone]}, ${word}"`.

**Khung một bài âm** (spec 4.2):
- Phần Cùng học có 4–6 thẻ, theo thứ tự: `scene` (Nhận biết) → `letter` → `spell` → `pictures` (2–4 từ) → `sentence` (chỉ khi đủ chữ để đặt câu).
- Phần Luyện tập có 6–8 câu.
- Bài 1: Cùng học 2–3 thẻ, Luyện tập chỉ dùng `listenEx` và `findPictureEx`.
- Bài ôn tập: Cùng học 2–6 thẻ ôn lại chữ và dấu vừa học. Luyện tập trộn câu của các bài kể từ bài ôn tập trước. `teaches` để rỗng.

**Chọn từ:** chỉ chọn từ có emoji rõ nghĩa và dùng được chữ đã học. Ví dụ bài 2–4: bà 👵, bò 🐄 (chưa dùng được vì cần `o`), bé 👶, cá 🐟. Lựa chọn và đáp án không trùng nhau.

`teaches` theo spec: bài 1 `a`; bài 2 `b` và huyền; bài 3 `c` và sắc; bài 4 `e`, `ê`; bài 5 rỗng.

- [ ] **Step 1: Viết test nội dung.** Test chạy cho mọi bài đang có trong file nên tự áp dụng cho Task 12–16.
  - `checkLessons(all)` trả về `[]`.
  - Số bài liên tục từ 1. `slug === 'tv1-bai-' + String(n).padStart(2, '0')`.
  - Bài có số chia hết cho 5 là bài ôn tập: `teaches` rỗng, `title` bắt đầu bằng "Ôn tập".
  - `teaches` khớp bảng sau (chỉ xét bài đang có):
    ```js
    { 1:['a'], 2:['b'], 3:['c'], 4:['e','ê'], 6:['o'], 7:['ô'], 8:['d','đ'], 9:['ơ'], 11:['i','k'], 12:['h','l'], 13:['u','ư'], 14:['ch','kh'], 16:['m','n'], 17:['g','gi'], 18:['gh','nh'], 19:['ng','ngh'], 21:['r','s'], 22:['t','tr'], 23:['th','ia'], 24:['ua','ưa'], 26:['ph','qu'], 27:['v','x'], 28:['y'] }
    ```
    Thanh: `{ 2:['huyen'], 3:['sac'], 6:['hoi'], 7:['nang'], 9:['nga'] }`. Các bài khác không có thanh mới.
  - Số thẻ Cùng học: bài 1 là 2–3; bài ôn tập và bài 29 là 2–6; các bài khác 4–6.
  - Mỗi bài có 6–8 câu luyện tập.
  - Câu chọn đáp án:
    - có 2–4 lựa chọn, không trùng;
    - đáp án nằm trong lựa chọn.
  - Từ bài 2, các bài âm (trừ ôn tập và bài 29) có cả kind `listen` và `build`, và ít nhất 3 kind khác nhau. Bài ôn tập có ít nhất 3 kind.
  - Câu `build`:
    - âm đầu khác rỗng;
    - âm đầu, vần và thanh của đáp án nằm trong `onsets`, `rimes`, `tones`;
    - mỗi hàng có tối đa 4 mảnh;
    - `composeSyllable` ra đúng đáp án.
  - Mọi chuỗi (duyệt sâu cả object) là NFC.
  - Mỗi mục trong `teaches.units` có `UNIT_SAY`.
  - Emoji của `picture`, `pictures`, `scene` không rỗng.
- [ ] **Step 2: Chạy `npm run test`.** Kỳ vọng: FAIL vì chưa có bài nào. Test "số bài liên tục" yêu cầu có ít nhất 1 bài.
- [ ] **Step 3: Viết các hàm tạo câu và bài 1–5.**
- [ ] **Step 4: Kiểm tra**
  - `npm run test` PASS.
  - `npm run seed:build` in ra "5 bài" Tiếng Việt.
  - `npm run type-check` không lỗi.
- [ ] **Step 5: Commit**: `feat(tieng-viet): nội dung bài 1–5`

### Checkpoint B (chủ dự án làm)

Dán `supabase/seed.sql` mới vào SQL Editor rồi bấm Run. Code trên production đã lọc theo môn từ Checkpoint A nên Toán không bị lẫn.

Sau đó người thực hiện kiểm tra tay bằng `npm run dev` với database thật:
- `/tieng-viet/1` có Phần 1 với 5 bài, mở theo thứ tự.
- Bài 2:
  - mọi thẻ hiện đúng và bấm vào là nghe được;
  - mỗi dạng câu chạy đúng, lời nhắc khi sai là "bé nghe lại";
  - đăng nhập thì sao được lưu; khách học thử được nhưng không lưu.
- Ở 360px không tràn ngang.
- Mục lục Toán vẫn 20 bài.

### Task 11: Lối vào Tiếng Việt (dashboard, trang chủ, footer)

**Files:**
- Modify: `src/app/dashboard/page.tsx`
- Create: `src/components/landing/TiengVietTeaser.tsx`
- Modify: `src/app/page.tsx` (chèn ngay sau `</section>` của phần hero, dòng 80)
- Modify: `src/components/layout/SiteFooter.tsx`

**Interfaces:**
- Consumes: `isTiengVietEnabled`, `getGradeOutline('tieng-viet', 1)`, `lessonStates`, `nextLesson`, `SUBJECTS`, `lessonHref`.

Dashboard:
- Tách thẻ "bài tiếp theo" thành `NextLessonCard({ subject, state })`, đặt cùng file.
  - Nhãn của Toán giữ như cũ.
  - Nhãn của Tiếng Việt: `Tiếng Việt · Bài ${position}`.
- Khi bật công tắc:
  - thêm thẻ bài tiếp theo của Tiếng Việt;
  - thêm khu "Vở Tiếng Việt lớp 1" có lưới phần và thanh tiến độ, giống khu Toán;
  - nếu đã giải hết thì hiện lời chúc riêng cho Tiếng Việt.
- Khi tắt công tắc: trang giữ nguyên như hiện tại.

Trang chủ và footer:
- `TiengVietTeaser` (Server Component):
  - tiêu đề "Mới: Tiếng Việt lớp 1";
  - nội dung "Học âm, chữ và dấu thanh theo thứ tự sách Kết nối tri thức. Có giọng đọc mẫu cho từng âm.";
  - `ButtonLink` "Mở vở Tiếng Việt" trỏ tới `/tieng-viet/1`.
- Footer: thêm "Vở Tiếng Việt lớp 1" vào nhóm "Học".
- Cả hai chỉ hiện khi bật công tắc.

- [ ] **Step 1: Sửa ba trang và tạo `TiengVietTeaser`.**
- [ ] **Step 2: Kiểm tra**
  - `npm run type-check`, `npm run lint`, `npm run build` không lỗi.
  - Chưa đặt `TIENG_VIET_ENABLED`: trang chủ, dashboard và footer giống hệt trước.
  - Đặt `TIENG_VIET_ENABLED=true` trong `.env.local` rồi khởi động lại dev: ba lối vào hiện ra, link đúng, tiến độ đúng.
- [ ] **Step 3: Commit**: `feat(tieng-viet): lối vào ở dashboard, trang chủ, footer`

### Task 12–16: Nội dung bài 6–30

Mỗi task làm 5 bài và theo đúng khung, hàm tạo câu và test của Task 10. Mỗi task có các bước:
1. Viết bài.
2. Chạy `npm run test`: PASS.
3. Chạy `npm run seed:build`: tổng số bài đúng.
4. Commit `feat(tieng-viet): nội dung bài X–Y`.

| Task | Bài | Chương | Lưu ý riêng |
|---|---|---|---|
| 12 | 6–10 | 2: "Âm và chữ: o, ô, d, đ, ơ" | Từ đây có đủ 5 dấu thanh. Câu `toneEx` dùng 3–4 dấu đã học. |
| 13 | 11–15 | 3: "Âm và chữ: i, k, h, l, u, ư, ch, kh" | Từ bài 11 có `k`: dùng k trước i, e, ê (kẻ, kê, kì). |
| 14 | 16–20 | 4: "Âm và chữ: m, n, g, gi, gh, nh, ng, ngh" | Bài 18–19: dùng gh, ngh trước i, e, ê (ghế, nghé). |
| 15 | 21–25 | 5: "Âm và chữ: r, s, t, tr, th, ia, ua, ưa" | Từ bài 23, câu `build` có vần `ia`, `ua`, `ưa` (mía, cua, dừa). |
| 16 | 26–30 | 6: "Âm và chữ: ph, qu, v, x, y" | Xem bài 29 bên dưới. |

Bài 29 "Luyện tập chính tả" (spec 4.2):
- Cùng học có 3 thẻ, mỗi quy tắc c/k, g/gh, ng/ngh một thẻ, kind `pictures` với 2 ví dụ đúng.
- Luyện tập có 6–8 câu "Bé chọn cách viết đúng cho tranh". Mỗi câu có `allowMisspelled: true` và hai lựa chọn, ví dụ "kẻ" và "cẻ".

Sau Task 16: báo chủ dự án chạy lại `supabase/seed.sql` (giống Checkpoint B), rồi kiểm tra tay một bài trong mỗi chương.

### Task 17: Tài liệu, dọn trang thử, kiểm tra cuối

**Files:**
- Delete: `src/app/thu-giong-doc/`, cùng các component chỉ trang này dùng
- Modify: `CLAUDE.md`
  - lệnh: thêm `npm run test`;
  - cấu trúc thư mục: `tieng-viet/[grade]/[topic]`, `components/learn`, `components/tieng-viet`, `content/tiengviet1.ts`, `content/tiengviet-sounds.ts`, `lib/tiengviet.ts`, `lib/questions.ts`, `lib/subjects.ts`, `lib/features.ts`, `tests/`;
  - schema: cột `subject` của topics và exercises;
  - bảng chủ đề: thêm Tiếng Việt lớp 1 (bài 1–30 KNTT);
  - biến môi trường: `TIENG_VIET_ENABLED`.
- Modify: `docs/supabase-setup.md`
  - thêm mục "Thêm môn Tiếng Việt": thứ tự phát hành theo spec 8.5, cách bật công tắc trên Vercel (đổi biến xong phải deploy lại);
  - cập nhật số bài và số câu sau khi seed;
  - thêm vào bảng lỗi: `column topics.subject does not exist` nghĩa là chưa chạy migration `20261026000000_subject.sql`.

- [ ] **Step 1: Xóa trang thử, sửa tài liệu.**
- [ ] **Step 2: Kiểm tra cuối**
  - `npm run test`, `npm run type-check`, `npm run lint`, `npm run build`, `npm run seed:build`: tất cả không lỗi.
  - `seed:build` in ra 30 bài Tiếng Việt.
  - `git grep -n "thu-giong-doc"` không còn kết quả.
- [ ] **Step 3: Commit**: `docs: hướng dẫn môn Tiếng Việt, xóa trang thử`

### Checkpoint C (chủ dự án làm): phát hành

Theo spec 8.5:
1. Deploy code mới, chưa đặt `TIENG_VIET_ENABLED`.
2. Chạy `seed.sql` mới nhất trên Supabase.
3. Người duyệt đọc hết 30 bài qua `/tieng-viet/1`, kiểm tra cả cách đọc trong `tiengviet-sounds.ts`.
4. Có chỗ cần sửa thì sửa nội dung, chạy `npm run seed:build`, chạy lại `seed.sql`.
5. Đặt `TIENG_VIET_ENABLED=true` trên Vercel rồi deploy lại.
