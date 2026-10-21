import type { Badge, ContinueItem, GradeInfo, GradeLevel, Question, Topic } from '@/types/math'

// Dữ liệu mẫu. Khi nối Supabase, thay các hàm get* bằng query qua src/lib/supabase.ts.

export const grades: GradeInfo[] = [
  { level: 1, summary: 'Đếm đến 100, cộng trừ trong 20', cover: 'bg-sun', coverText: 'text-ink-deep' },
  { level: 2, summary: 'Cộng trừ có nhớ, bảng nhân 2–5', cover: 'bg-leaf', coverText: 'text-white' },
  { level: 3, summary: 'Nhân chia, phân số đơn giản', cover: 'bg-sky', coverText: 'text-white' },
  { level: 4, summary: 'Phân số, góc, diện tích', cover: 'bg-ink', coverText: 'text-white' },
  { level: 5, summary: 'Số thập phân, tỉ lệ, thể tích', cover: 'bg-pen', coverText: 'text-white' },
]

const topicsByGrade: Record<GradeLevel, Topic[]> = {
  1: [
    { id: 'dem-so', title: 'Đếm số 1–100', mark: '123', description: 'Nhận biết, đọc và viết số', total: 10, done: 10 },
    { id: 'cong-tru-10', title: 'Cộng trừ trong 10', mark: '+', description: 'Phép tính cơ bản trong 10', total: 12, done: 12 },
    { id: 'cong-tru-20', title: 'Cộng trừ trong 20', mark: '±', description: 'Mở rộng phép tính đến 20', total: 12, done: 4 },
    { id: 'hinh-hoc', title: 'Hình học cơ bản', mark: '△', description: 'Hình vuông, tròn, tam giác', total: 8, done: 0 },
  ],
  2: [
    { id: 'cong-tru-co-nho', title: 'Cộng trừ có nhớ', mark: '+1', description: 'Phép tính có nhớ và vay', total: 15, done: 5 },
    { id: 'bang-nhan-2', title: 'Bảng nhân 2, 3', mark: '×2', description: 'Thuộc bảng nhân 2 và 3', total: 10, done: 2 },
    { id: 'bang-nhan-4', title: 'Bảng nhân 4, 5', mark: '×4', description: 'Thuộc bảng nhân 4 và 5', total: 10, done: 0 },
    { id: 'do-luong', title: 'Đo lường cơ bản', mark: 'cm', description: 'Xăng-ti-mét, ki-lô-gam, lít', total: 8, done: 0 },
  ],
  3: [
    { id: 'nhan-chia', title: 'Nhân chia cơ bản', mark: '÷', description: 'Nhân chia số có 2–3 chữ số', total: 15, done: 0 },
    { id: 'phan-so', title: 'Phân số đơn giản', mark: '½', description: 'Khái niệm và so sánh phân số', total: 10, done: 0 },
    { id: 'chu-vi', title: 'Chu vi hình học', mark: 'P', description: 'Chu vi hình chữ nhật, hình vuông', total: 8, done: 0 },
    { id: 'thoi-gian', title: 'Thời gian và lịch', mark: '7:30', description: 'Giờ, phút, ngày, tháng', total: 8, done: 0 },
  ],
  4: [
    { id: 'phan-so-4', title: 'Phân số nâng cao', mark: '¾', description: 'Cộng trừ nhân chia phân số', total: 15, done: 0 },
    { id: 'goc', title: 'Góc và đường thẳng', mark: '∠', description: 'Góc vuông, nhọn, tù', total: 10, done: 0 },
    { id: 'dien-tich', title: 'Diện tích hình chữ nhật', mark: 'm²', description: 'Tính diện tích cơ bản', total: 10, done: 0 },
    { id: 'so-lon', title: 'Số lớn đến triệu', mark: '10⁶', description: 'Đọc viết số đến hàng triệu', total: 12, done: 0 },
  ],
  5: [
    { id: 'so-thap-phan', title: 'Số thập phân', mark: '0,5', description: 'Đọc, viết và tính số thập phân', total: 15, done: 0 },
    { id: 'ti-le', title: 'Tỉ lệ và tỉ số', mark: '1:2', description: 'Bài toán tỉ lệ thuận, nghịch', total: 10, done: 0 },
    { id: 'the-tich', title: 'Thể tích hình hộp', mark: 'm³', description: 'Thể tích hình hộp chữ nhật', total: 10, done: 0 },
    { id: 'thong-ke', title: 'Thống kê đơn giản', mark: '%', description: 'Đọc biểu đồ và bảng số liệu', total: 8, done: 0 },
  ],
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    prompt: 'Có 5 quả táo, thêm 3 quả nữa. Tất cả có bao nhiêu quả?',
    visual: { kind: 'add', item: 'apple', groups: [5, 3] },
    options: ['6', '7', '8', '9'],
    correct: 2,
    explain: '5 quả thêm 3 quả là 8 quả: 5 + 3 = 8.',
  },
  {
    id: 2,
    prompt: 'Tính: 7 + 4 bằng bao nhiêu?',
    visual: { kind: 'add', item: 'dot', groups: [7, 4] },
    options: ['10', '11', '12', '13'],
    correct: 1,
    explain: 'Đếm tiếp từ 7 thêm 4: 8, 9, 10, 11. Vậy 7 + 4 = 11.',
  },
  {
    id: 3,
    prompt: 'Có 10 que tính, bớt đi 3 que. Còn lại mấy que?',
    visual: { kind: 'take-away', item: 'stick', total: 10, remove: 3 },
    options: ['5', '6', '7', '8'],
    correct: 2,
    explain: '10 que bớt 3 que còn 7 que: 10 − 3 = 7.',
  },
  {
    id: 4,
    prompt: 'Số nào lớn hơn: 15 hay 12?',
    visual: { kind: 'compare', left: 15, right: 12 },
    options: ['12', '15', 'Bằng nhau', 'Không biết'],
    correct: 1,
    explain: 'Cùng 1 bó chục, 5 que lẻ nhiều hơn 2 que lẻ, nên 15 > 12.',
  },
  {
    id: 5,
    prompt: 'Tính: 6 + 6 bằng bao nhiêu?',
    visual: { kind: 'add', item: 'stick', groups: [6, 6] },
    options: ['10', '11', '12', '13'],
    correct: 2,
    explain: 'Hai lần 6 là 12: 6 + 6 = 12.',
  },
]

/** Câu hỏi thử ở hero trang chủ, minh họa bằng sân xếp khối 3D */
export const heroQuestion: Question = {
  id: 100,
  prompt: 'Có 5 khối tím, thêm 3 khối vàng. Tất cả có mấy khối?',
  visual: { kind: 'add', item: 'dot', groups: [5, 3] },
  options: ['6', '7', '8', '9'],
  correct: 2,
  explain: '5 khối thêm 3 khối là 8 khối: 5 + 3 = 8.',
}

export const badges: Badge[] = [
  { mark: '1', label: 'Ngôi sao đầu tiên', earned: true },
  { mark: '3', label: '3 ngày liền', earned: true },
  { mark: '10', label: '10 bài đúng', earned: true },
  { mark: 'L1', label: 'Xong lớp 1', earned: false },
  { mark: '7', label: 'Siêu sao tuần', earned: false },
]

export const studentSummary = {
  name: 'Bé',
  stars: 128,
  streakDays: 3,
  todayDone: 5,
  todayGoal: 10,
  continueWith: [
    { grade: 1, topicId: 'cong-tru-20' },
    { grade: 2, topicId: 'bang-nhan-2' },
  ] satisfies ContinueItem[],
}

export function isGradeLevel(value: number): value is GradeLevel {
  return Number.isInteger(value) && value >= 1 && value <= 5
}

export function getGrade(value: number): GradeInfo | undefined {
  return isGradeLevel(value) ? grades[value - 1] : undefined
}

export function getTopics(level: GradeLevel): Topic[] {
  return topicsByGrade[level]
}

export function getTopic(level: GradeLevel, topicId: string): Topic | undefined {
  return topicsByGrade[level].find(t => t.id === topicId)
}

/** Hiện mọi chủ đề dùng chung bộ câu hỏi mẫu */
export function getQuestions(): Question[] {
  return sampleQuestions
}

/** Bài bị khóa khi bài liền trước chưa bắt đầu */
export function isTopicLocked(topics: Topic[], index: number): boolean {
  return index > 0 && topics[index - 1].done === 0
}
