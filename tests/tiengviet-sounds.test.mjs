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
