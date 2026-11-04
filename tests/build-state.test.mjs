import { test } from 'node:test'
import assert from 'node:assert/strict'
import { EMPTY_BUILD, pickTile, undoTile, evaluate } from '../src/lib/build-state.ts'

// Ghép sẵn "bà": b + a + huyền
const ba = pickTile(pickTile(pickTile(EMPTY_BUILD, 'onset', 'b'), 'rime', 'a'), 'tone', 'huyen')

test('evaluate: đủ ba ô và đúng tiếng thì correct', () => {
  assert.equal(evaluate(ba, 'bà'), 'correct')
  assert.equal(evaluate(pickTile(ba, 'tone', 'ngang'), 'ba'), 'correct')
  assert.equal(evaluate(pickTile(pickTile(pickTile(EMPTY_BUILD, 'onset', 'tr'), 'rime', 'ưa'), 'tone', 'huyen'), 'trừa'), 'correct')
})

test('evaluate: đủ ba ô nhưng sai tiếng thì wrong', () => {
  assert.equal(evaluate(pickTile(ba, 'tone', 'sac'), 'bà'), 'wrong')
})

test('evaluate: còn thiếu ô thì incomplete', () => {
  assert.equal(evaluate(pickTile(EMPTY_BUILD, 'onset', 'b'), 'bà'), 'incomplete')
  assert.equal(evaluate(EMPTY_BUILD, 'bà'), 'incomplete')
})

test('pickTile: thay giá trị ở ô đó, không sửa trạng thái cũ', () => {
  const next = pickTile(ba, 'onset', 'c')
  assert.deepEqual(next, { onset: 'c', rime: 'a', tone: 'huyen' })
  assert.deepEqual(ba, { onset: 'b', rime: 'a', tone: 'huyen' })
})

test('pickTile: ô dấu chỉ nhận dấu thanh hợp lệ', () => {
  assert.deepEqual(pickTile(EMPTY_BUILD, 'tone', 'khong-phai-dau'), EMPTY_BUILD)
})

test('undoTile: xóa ô cuối còn giá trị, theo thứ tự dấu, vần, âm đầu', () => {
  assert.deepEqual(undoTile(ba), { onset: 'b', rime: 'a', tone: null })
  assert.deepEqual(undoTile(undoTile(ba)), { onset: 'b', rime: null, tone: null })
  assert.deepEqual(undoTile(undoTile(undoTile(ba))), EMPTY_BUILD)
  assert.deepEqual(undoTile(EMPTY_BUILD), EMPTY_BUILD)
})

test('undoTile: bỏ qua ô trống ở giữa, xóa ô cuối còn giá trị', () => {
  assert.deepEqual(undoTile({ onset: 'b', rime: null, tone: 'sac' }), { onset: 'b', rime: null, tone: null })
  assert.deepEqual(undoTile({ onset: 'b', rime: 'a', tone: null }), { onset: 'b', rime: null, tone: null })
})
