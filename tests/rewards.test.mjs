import { test } from 'node:test'
import assert from 'node:assert/strict'
import { BADGES } from '../src/lib/rewards.ts'

const grade1 = BADGES.find(b => b.type === 'grade1_done')

/** Số liệu cơ bản của một bé, chỉ ghi đè những trường mỗi test cần */
function check(overrides) {
  return { stars: 0, solvedCount: 300, streakDays: 0, gradeTotal: 128, gradeSolved: 127, ...overrides }
}

test('huy hiệu grade1_done có trong danh mục', () => {
  assert.ok(grade1)
})

test('grade1_done: còn thiếu câu toán thì chưa đạt, dù tổng số câu đã giải rất nhiều', () => {
  assert.equal(grade1.earned(check({ gradeSolved: 127 })), false)
})

test('grade1_done: giải hết câu toán lớp 1 thì đạt', () => {
  assert.equal(grade1.earned(check({ gradeSolved: 128 })), true)
})

test('grade1_done: lớp chưa có câu nào thì không đạt', () => {
  assert.equal(grade1.earned(check({ gradeTotal: 0, gradeSolved: 0 })), false)
})
