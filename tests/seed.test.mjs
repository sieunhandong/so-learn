import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildSeed, toSql } from '../scripts/seed-rows.mjs'
import { grade1Chapters } from '../src/content/grade1.ts'

// Số bài và số câu Toán đo bằng `npm run seed:build` trước khi sửa (khớp docs/supabase-setup.md)
const MATH_LESSONS = 20
const MATH_EXERCISES = 128

/** Dữ liệu mẫu: một câu trắc nghiệm, hoặc câu ghép tiếng khi build = true */
function sampleExercise(prompt, build = false) {
  const visual = build
    ? { kind: 'build', say: 'bà', onsets: ['b'], rimes: ['a'], tones: ['ngang', 'huyen'] }
    : { kind: 'picture', emoji: '🍎' }
  return { prompt, visual, options: ['a', 'b'], answer: 'a', explain: 'Giải thích', difficulty: 1 }
}

function sampleLesson(slug, exercises) {
  return {
    slug, title: `Bài ${slug}`, mark: 'A', description: 'Mô tả',
    intro: [{ text: 'Cùng học', visual: { kind: 'picture', emoji: '🍎' } }], exercises,
  }
}

const sources = [
  {
    subject: 'math', grade: 1,
    chapters: [
      { number: 1, title: 'Chương một', lessons: [sampleLesson('so-1', [sampleExercise('Một?')])] },
      { number: 2, title: 'Chương hai', lessons: [sampleLesson('so-2', [sampleExercise('Hai?'), sampleExercise('Ba?')])] },
    ],
  },
  {
    subject: 'tieng-viet', grade: 1,
    chapters: [
      {
        number: 1, title: "Chữ 'a'",
        lessons: [
          sampleLesson('tv1-bai-01', [sampleExercise('Chọn chữ?')]),
          sampleLesson('tv1-bai-02', [sampleExercise('Nghe?'), sampleExercise('Ghép tiếng', true)]),
        ],
      },
    ],
  },
]

test('buildSeed: position của bài đánh lại từ 1 cho mỗi môn', () => {
  const { topics } = buildSeed(sources)
  for (const subject of ['math', 'tieng-viet']) {
    const positions = topics.filter(t => t.subject === subject).map(t => t.position)
    assert.deepEqual(positions, [1, 2], subject)
  }
})

test('buildSeed: topics và exercises mang đúng subject của nguồn', () => {
  const { topics, exercises } = buildSeed(sources)
  assert.deepEqual(topics.map(t => t.subject), ['math', 'math', 'tieng-viet', 'tieng-viet'])
  const subjectOf = Object.fromEntries(topics.map(t => [t.id, t.subject]))
  for (const e of exercises) assert.equal(e.subject, subjectOf[e.topic], e.slug)
})

test('buildSeed: mã câu và position câu tính theo từng bài', () => {
  const { exercises } = buildSeed(sources)
  const ids = exercises.filter(e => e.topic === 'tv1-bai-02').map(e => [e.slug, e.position])
  assert.deepEqual(ids, [['tv1-bai-02-1', 1], ['tv1-bai-02-2', 2]])
})

test('buildSeed: câu build là drag_drop, các câu khác là multiple_choice', () => {
  const { exercises } = buildSeed(sources)
  const bySlug = Object.fromEntries(exercises.map(e => [e.slug, e.type]))
  assert.equal(bySlug['tv1-bai-02-2'], 'drag_drop')
  assert.equal(bySlug['tv1-bai-02-1'], 'multiple_choice')
  assert.equal(bySlug['so-1-1'], 'multiple_choice')
})

test('toSql: có subject = excluded.subject đúng 2 lần, mỗi bảng một lệnh insert', () => {
  const sql = toSql(buildSeed(sources))
  assert.equal(sql.split('subject = excluded.subject').length - 1, 2)
  assert.equal(sql.split('insert into public.topics').length - 1, 1)
  assert.equal(sql.split('insert into public.exercises').length - 1, 1)
})

test('toSql: nhân đôi dấu nháy đơn trong chuỗi', () => {
  const sql = toSql(buildSeed(sources))
  assert.ok(sql.includes("'Chữ ''a'''"))
})

test('toSql: một môn không có bài vẫn ra SQL hợp lệ, không có VALUES rỗng', () => {
  const onlyMath = toSql(buildSeed([sources[0], { subject: 'tieng-viet', grade: 1, chapters: [] }]))
  assert.ok(onlyMath.includes("'so-1'"))
  assert.ok(!onlyMath.includes('tv1-'))
  assert.ok(!/values\s*(on conflict|$)/i.test(onlyMath))
  const none = toSql(buildSeed([]))
  assert.ok(!none.includes('insert into'))
})

test('grade1Chapters thật: đủ số bài và số câu, mọi dòng là math', () => {
  const { topics, exercises } = buildSeed([{ subject: 'math', grade: 1, chapters: grade1Chapters }])
  assert.equal(topics.length, MATH_LESSONS)
  assert.equal(exercises.length, MATH_EXERCISES)
  assert.ok(topics.every(t => t.subject === 'math'))
  assert.ok(exercises.every(e => e.subject === 'math'))
  assert.ok(exercises.every(e => e.type === 'multiple_choice'))
})
