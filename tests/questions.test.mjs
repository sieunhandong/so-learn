import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isReadingVisual, toQuestion } from '../src/lib/questions.ts'

/** Một dòng bảng exercises, chỉ ghi đè những trường mỗi test cần */
function row(overrides) {
  return {
    id: 'ex-1',
    slug: 'ex-1',
    grade: 1,
    topic: 'bai-1',
    position: 1,
    question: 'Có mấy quả táo?',
    answer: '7',
    options: ['6', '7', '8', '9'],
    type: 'multiple_choice',
    difficulty: 1,
    visual: { kind: 'count', item: 'apple', count: 7 },
    explain: 'Đếm được 7 quả.',
    image_url: null,
    audio_url: null,
    ...overrides,
  }
}

test('toQuestion: dòng Toán (visual count) thành câu choice, correct là vị trí đáp án', () => {
  const q = toQuestion(row({ answer: '8', options: ['6', '7', '8', '9'] }))
  assert.equal(q?.type, 'choice')
  assert.equal(q?.correct, 2)
  assert.deepEqual(q?.options, ['6', '7', '8', '9'])
  assert.equal(q?.id, 'ex-1')
  assert.equal(q?.prompt, 'Có mấy quả táo?')
  assert.equal(q?.explain, 'Đếm được 7 quả.')
})

test('toQuestion: đáp án không có trong lựa chọn thì null', () => {
  assert.equal(toQuestion(row({ answer: '10' })), null)
})

test('toQuestion: không có visual thì null', () => {
  assert.equal(toQuestion(row({ visual: null })), null)
})

test('toQuestion: đáp án viết NFD vẫn khớp lựa chọn NFC, và giữ nguyên chuỗi lựa chọn', () => {
  const nfd = 'bà'
  const nfc = 'bà'
  assert.notEqual(nfd, nfc)
  const q = toQuestion(row({
    answer: nfd,
    options: ['ba', nfc, 'bá'],
    visual: { kind: 'listen', say: 'bà' },
  }))
  assert.equal(q?.type, 'choice')
  assert.equal(q?.correct, 1)
  assert.deepEqual(q?.options, ['ba', nfc, 'bá'])
})

test('toQuestion: lựa chọn viết NFD, đáp án NFC vẫn khớp', () => {
  const q = toQuestion(row({
    answer: 'bà',
    options: ['ba', 'bà', 'bá'],
    visual: { kind: 'listen', say: 'bà' },
  }))
  assert.equal(q?.correct, 1)
})

test('toQuestion: drag_drop với visual build và có đáp án thì thành câu build', () => {
  const visual = { kind: 'build', emoji: '👵', say: 'bà', onsets: ['b', 'c'], rimes: ['a', 'o'], tones: ['ngang', 'huyen'] }
  const q = toQuestion(row({ type: 'drag_drop', answer: 'bà', options: [], visual }))
  assert.equal(q?.type, 'build')
  assert.equal(q?.answer, 'bà')
  assert.deepEqual(q?.visual, visual)
  assert.equal(q?.id, 'ex-1')
})

test('toQuestion: multiple_choice với visual listen thì là câu choice', () => {
  const q = toQuestion(row({
    answer: 'bờ',
    options: ['bờ', 'cờ'],
    visual: { kind: 'listen', say: 'bờ' },
  }))
  assert.equal(q?.type, 'choice')
  assert.equal(q?.correct, 0)
})

test('toQuestion: drag_drop nhưng visual không phải build thì không thành câu build', () => {
  const q = toQuestion(row({ type: 'drag_drop', answer: '7' }))
  assert.equal(q?.type, 'choice')
})

test('toQuestion: drag_drop với visual build nhưng không có đáp án thì null', () => {
  const visual = { kind: 'build', say: 'bà', onsets: ['b'], rimes: ['a'], tones: ['huyen'] }
  assert.equal(toQuestion(row({ type: 'drag_drop', answer: '', options: [], visual })), null)
})

test('isReadingVisual: visual của Toán là false, của Tiếng Việt là true', () => {
  assert.equal(isReadingVisual({ kind: 'count', item: 'dot', count: 1 }), false)
  assert.equal(isReadingVisual({ kind: 'listen', say: 'a' }), true)
})

test('isReadingVisual: đủ chín kind của Tiếng Việt, không nhận kind của Toán', () => {
  const reading = ['letter', 'scene', 'picture', 'pictures', 'spell', 'sentence', 'listen', 'tone', 'build']
  for (const kind of reading) assert.equal(isReadingVisual({ kind }), true, kind)
  const math = ['count', 'add', 'take-away', 'compare', 'compare-groups', 'split', 'shapes', 'solids', 'position', 'tens-ones', 'tens-calc', 'number-row', 'length', 'ruler', 'clock', 'week']
  for (const kind of math) assert.equal(isReadingVisual({ kind }), false, kind)
})
