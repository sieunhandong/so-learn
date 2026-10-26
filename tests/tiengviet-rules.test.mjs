import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  spellingError, learnedError, readableTexts, exerciseReadables, checkLessons, toneLabel,
} from '../src/lib/tiengviet.ts'

// --- Chính tả ---

test('spellingError: tiếng đúng quy tắc trả về null', () => {
  for (const s of ['ke', 'kìa', 'ghi', 'ga', 'nghe', 'kỹ', 'quê', 'gì']) {
    assert.equal(spellingError(s), null, s)
  }
})

test('spellingError: tiếng sai quy tắc trả về lỗi có chứa tiếng đó', () => {
  for (const s of ['ce', 'ka', 'gha', 'nge', 'cia']) {
    const err = spellingError(s)
    assert.notEqual(err, null, s)
    assert.ok(err.includes(`"${s}"`), err)
  }
})

// --- Chữ đã học ---

const learnedAB = { units: new Set(['a', 'b']), tones: new Set(['huyen']) }

test('learnedError: tiếng toàn chữ đã học trả về null', () => {
  assert.equal(learnedError('ba', learnedAB), null)
  assert.equal(learnedError('bà', learnedAB), null)
})

test('learnedError: "bé" báo cả vần e lẫn dấu sắc', () => {
  const err = learnedError('bé', learnedAB)
  assert.ok(err.includes('"e"'), err)
  assert.ok(err.includes('sắc'), err)
})

test('learnedError: âm đầu chưa học có dạng trong brief', () => {
  const learned = { units: new Set(['e']), tones: new Set() }
  assert.equal(learnedError('ke', learned), '"ke" chưa học "k"')
})

test('learnedError: vần phải nằm nguyên trong units ("ia" không suy ra từ "i" và "a")', () => {
  const learned = { units: new Set(['m', 'i', 'a']), tones: new Set(['sac']) }
  assert.ok(learnedError('mía', learned).includes('"ia"'))
  const withIa = { units: new Set(['m', 'ia']), tones: new Set(['sac']) }
  assert.equal(learnedError('mía', withIa), null)
})

test('learnedError: "gì" cần cả âm đầu "gi" lẫn vần "i"', () => {
  const learned = { units: new Set(['gi', 'i']), tones: new Set(['huyen']) }
  assert.equal(learnedError('gì', learned), null)
  assert.ok(learnedError('gì', { units: new Set(['i']), tones: new Set(['huyen']) }).includes('"gi"'))
})

// --- Phần trẻ phải tự đọc ---

test('readableTexts: lấy đúng phần trẻ tự đọc theo từng kind', () => {
  assert.deepEqual(readableTexts({ kind: 'picture', emoji: '👵', word: 'bà' }), ['bà'])
  assert.deepEqual(readableTexts({ kind: 'picture', emoji: '👵' }), [])
  assert.deepEqual(readableTexts({ kind: 'pictures', items: [{ emoji: '🐟', word: 'cá' }, { emoji: '🐄', word: 'bò' }] }), ['cá', 'bò'])
  assert.deepEqual(readableTexts({ kind: 'spell', steps: [{ parts: ['b', 'a'], result: 'ba', say: 'bờ, a, ba' }] }), ['ba'])
  assert.deepEqual(readableTexts({ kind: 'sentence', text: 'Bà bế bé.', highlight: [] }), ['Bà bế bé.'])
  assert.deepEqual(readableTexts({ kind: 'tone', emoji: '🐟', base: 'ca' }), ['ca'])
  assert.deepEqual(readableTexts({ kind: 'letter', letters: ['A', 'a'], say: 'a' }), [])
  assert.deepEqual(readableTexts({ kind: 'scene', emoji: ['👵'], sentence: 'Bà bế bé.', highlight: [] }), [])
  assert.deepEqual(readableTexts({ kind: 'listen', say: 'ba' }), [])
  assert.deepEqual(readableTexts({ kind: 'build', say: 'ba', onsets: ['b'], rimes: ['a'], tones: [] }), [])
})

test('exerciseReadables: cộng lựa chọn (trừ listen, tone) và đáp án của build', () => {
  const base = { prompt: '', explain: '', difficulty: 1 }
  assert.deepEqual(
    exerciseReadables({ ...base, visual: { kind: 'picture', emoji: '👵' }, options: ['bà', 'bả'], answer: 'bà' }),
    ['bà', 'bả'],
  )
  assert.deepEqual(
    exerciseReadables({ ...base, visual: { kind: 'listen', say: 'ba' }, options: ['b', 'm'], answer: 'b' }),
    [],
  )
  assert.deepEqual(
    exerciseReadables({ ...base, visual: { kind: 'tone', emoji: '🐟', base: 'ca' }, options: [toneLabel('ngang')], answer: toneLabel('ngang') }),
    ['ca'],
  )
  assert.deepEqual(
    exerciseReadables({
      ...base, visual: { kind: 'build', say: 'bà', onsets: ['b'], rimes: ['a'], tones: ['huyen'] }, options: [], answer: 'bà',
    }),
    ['bà'],
  )
})

// --- checkLessons ---

const base = { prompt: '', explain: '', difficulty: 1 }
const lesson = (number, teaches, intro, exercises) => ({
  number, slug: `tv1-bai-0${number}`, title: '', mark: '', description: '', teaches, intro, exercises,
})
const lesson1 = lesson(1, { units: ['a'], tones: [] }, [], [])
/** Hai bài mẫu: bài 1 dạy a; bài 2 dạy b và huyền, chứa các câu cho trước */
const twoLessons = (intro, exercises) => [
  lesson1,
  lesson(2, { units: ['b'], tones: ['huyen'] }, intro, exercises),
]
const picture = (word) => ({ ...base, visual: { kind: 'picture', emoji: '👵', word }, options: [], answer: 'x' })

test('checkLessons: tiếng toàn chữ đã học thì không có lỗi', () => {
  assert.deepEqual(checkLessons(twoLessons([], [picture('bà')])), [])
})

test('checkLessons: tiếng chưa học báo lỗi kèm bài và số câu', () => {
  const errors = checkLessons(twoLessons([], [picture('bà'), picture('bé')]))
  assert.deepEqual(errors, ['Bài 2 (tv1-bai-02), câu 2: "bé" chưa học "e", dấu sắc'])
})

test('checkLessons: thẻ Cùng học báo lỗi ở dạng "thẻ N"', () => {
  const intro = [
    { text: '', visual: { kind: 'picture', emoji: '👵', word: 'bà' } },
    { text: '', visual: { kind: 'picture', emoji: '👵', word: 'bé' } },
  ]
  const errors = checkLessons(twoLessons(intro, []))
  assert.equal(errors.length, 1)
  assert.ok(errors[0].startsWith('Bài 2 (tv1-bai-02), thẻ 2: '), errors[0])
})

test('checkLessons: chỉ dùng được những gì đã dạy tới bài hiện tại', () => {
  const lessons = [
    lesson(1, { units: ['a'], tones: [] }, [], [picture('ba')]),
    lesson(2, { units: ['b'], tones: ['huyen'] }, [], [picture('ba')]),
  ]
  const errors = checkLessons(lessons)
  assert.equal(errors.length, 1)
  assert.ok(errors[0].startsWith('Bài 1 (tv1-bai-01), câu 1: '), errors[0])
  assert.ok(errors[0].includes('"b"'), errors[0])
})

test('checkLessons: thẻ Nhận biết (scene) được miễn kiểm tra chữ đã học', () => {
  const scene = { text: '', visual: { kind: 'scene', emoji: ['🐄'], sentence: 'Bò ăn cỏ.', highlight: ['bò'] } }
  const exercise = { ...base, visual: { kind: 'scene', emoji: ['🐄'], sentence: 'Bò ăn cỏ.', highlight: [] }, options: [], answer: 'x' }
  assert.deepEqual(checkLessons(twoLessons([scene], [exercise])), [])
})

test('checkLessons: lựa chọn của dạng listen được miễn', () => {
  const listen = { ...base, visual: { kind: 'listen', say: 'b' }, options: ['b', 'm'], answer: 'b' }
  assert.deepEqual(checkLessons(twoLessons([], [listen])), [])
})

test('checkLessons: dạng tone chỉ nhận nhãn của thanh đã học', () => {
  const tone = (options) => ({ ...base, visual: { kind: 'tone', emoji: '👵', base: 'ba' }, options, answer: options[0] })
  assert.deepEqual(checkLessons(twoLessons([], [tone([toneLabel('ngang'), toneLabel('huyen')])])), [])
  const errors = checkLessons(twoLessons([], [tone([toneLabel('ngang'), toneLabel('huyen'), toneLabel('sac')])]))
  assert.equal(errors.length, 1)
  assert.ok(errors[0].includes('sắc'), errors[0])
  const unknown = checkLessons(twoLessons([], [tone([toneLabel('ngang'), 'huyền'])]))
  assert.equal(unknown.length, 1)
  assert.ok(unknown[0].includes('"huyền"'), unknown[0])
})

test('checkLessons: allowMisspelled bỏ qua chính tả của lựa chọn sai, không bỏ qua đáp án', () => {
  const learnsKEC = [lesson(1, { units: ['k', 'e', 'c'], tones: ['hoi'] }, [], [])]
  const spelling = (allowMisspelled, answer) => ({
    ...base, visual: { kind: 'picture', emoji: '🙋' }, options: ['kẻ', 'cẻ'], answer, allowMisspelled,
  })
  const withExercise = (ex) => [{ ...learnsKEC[0], exercises: [ex] }]
  assert.deepEqual(checkLessons(withExercise(spelling(true, 'kẻ'))), [])
  const strict = checkLessons(withExercise(spelling(undefined, 'kẻ')))
  assert.equal(strict.length, 1)
  assert.ok(strict[0].includes('"cẻ"'), strict[0])
  // Đáp án sai chính tả vẫn bị bắt dù có allowMisspelled
  const badAnswer = checkLessons(withExercise(spelling(true, 'cẻ')))
  assert.equal(badAnswer.length, 1)
  assert.ok(badAnswer[0].includes('"cẻ"'), badAnswer[0])
})

test('checkLessons: allowMisspelled vẫn kiểm tra chữ đã học của lựa chọn sai', () => {
  const learns = [lesson(1, { units: ['k', 'e'], tones: ['hoi'] }, [], [])]
  const ex = { ...base, visual: { kind: 'picture', emoji: '🙋' }, options: ['kẻ', 'cẻ'], answer: 'kẻ', allowMisspelled: true }
  const errors = checkLessons([{ ...learns[0], exercises: [ex] }])
  assert.equal(errors.length, 1)
  assert.ok(errors[0].includes('"c"'), errors[0])
})
