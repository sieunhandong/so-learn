import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tiengViet1Chapters } from '../src/content/tiengviet1.ts'
import { UNIT_SAY } from '../src/content/tiengviet-sounds.ts'
import { checkLessons, composeSyllable, splitSyllable } from '../src/lib/tiengviet.ts'

// Test chạy cho mọi bài đang có trong src/content/tiengviet1.ts, nên tự áp dụng khi thêm bài 6–30.

const lessons = tiengViet1Chapters.flatMap((chapter) => chapter.lessons)

/** Âm/chữ mỗi bài dạy mới, theo bảng ở spec mục 3; bài không có trong bảng thì không dạy âm mới */
const TEACH_UNITS = {
  1: ['a'], 2: ['b'], 3: ['c'], 4: ['e', 'ê'], 6: ['o'], 7: ['ô'], 8: ['d', 'đ'], 9: ['ơ'],
  11: ['i', 'k'], 12: ['h', 'l'], 13: ['u', 'ư'], 14: ['ch', 'kh'], 16: ['m', 'n'], 17: ['g', 'gi'],
  18: ['gh', 'nh'], 19: ['ng', 'ngh'], 21: ['r', 's'], 22: ['t', 'tr'], 23: ['th', 'ia'], 24: ['ua', 'ưa'],
  26: ['ph', 'qu'], 27: ['v', 'x'], 28: ['y'],
}
/** Dấu thanh mỗi bài dạy mới; các bài khác không có thanh mới */
const TEACH_TONES = { 2: ['huyen'], 3: ['sac'], 6: ['hoi'], 7: ['nang'], 9: ['nga'] }

const isReview = (lesson) => lesson.number % 5 === 0
/** Bài 29: luyện tập chính tả, không theo khung bài âm */
const isSpelling = (lesson) => lesson.number === 29
const where = (lesson) => `Bài ${lesson.number} (${lesson.slug})`

test('checkLessons không báo lỗi nào', () => {
  assert.deepEqual(checkLessons(lessons), [])
})

test('số bài liên tục từ 1, mã bài đúng dạng tv1-bai-NN', () => {
  assert.ok(lessons.length > 0, 'chưa có bài nào')
  lessons.forEach((lesson, i) => {
    assert.equal(lesson.number, i + 1, where(lesson))
    assert.equal(lesson.slug, 'tv1-bai-' + String(lesson.number).padStart(2, '0'), where(lesson))
  })
})

test('bài có số chia hết cho 5 là bài ôn tập: không dạy gì mới, tên bắt đầu bằng "Ôn tập"', () => {
  for (const lesson of lessons.filter(isReview)) {
    assert.deepEqual(lesson.teaches, { units: [], tones: [] }, where(lesson))
    assert.ok(lesson.title.startsWith('Ôn tập'), `${where(lesson)}: "${lesson.title}"`)
  }
})

test('teaches khớp bảng âm/chữ và dấu thanh của từng bài', () => {
  for (const lesson of lessons) {
    assert.deepEqual(lesson.teaches.units, TEACH_UNITS[lesson.number] ?? [], `${where(lesson)}: units`)
    assert.deepEqual(lesson.teaches.tones, TEACH_TONES[lesson.number] ?? [], `${where(lesson)}: tones`)
  }
})

test('số thẻ Cùng học: bài 1 có 2–3, bài ôn tập và bài 29 có 2–6, các bài khác 4–6', () => {
  for (const lesson of lessons) {
    const [min, max] = lesson.number === 1 ? [2, 3] : isReview(lesson) || isSpelling(lesson) ? [2, 6] : [4, 6]
    const n = lesson.intro.length
    assert.ok(n >= min && n <= max, `${where(lesson)}: ${n} thẻ, cần ${min}–${max}`)
  }
})

test('mỗi bài có 6–8 câu luyện tập', () => {
  for (const lesson of lessons) {
    const n = lesson.exercises.length
    assert.ok(n >= 6 && n <= 8, `${where(lesson)}: ${n} câu`)
  }
})

test('câu chọn đáp án: 2–4 lựa chọn không trùng, đáp án nằm trong lựa chọn', () => {
  for (const lesson of lessons) {
    lesson.exercises.forEach((ex, i) => {
      if (ex.visual.kind === 'build') return
      const at = `${where(lesson)}, câu ${i + 1}`
      assert.ok(ex.options.length >= 2 && ex.options.length <= 4, `${at}: ${ex.options.length} lựa chọn`)
      assert.equal(new Set(ex.options).size, ex.options.length, `${at}: lựa chọn trùng nhau`)
      assert.ok(ex.options.includes(ex.answer), `${at}: đáp án "${ex.answer}" không có trong lựa chọn`)
    })
  }
})

test('từ bài 2, bài âm có cả dạng nghe và ghép tiếng, ít nhất 3 dạng; bài ôn tập ít nhất 3 dạng', () => {
  for (const lesson of lessons) {
    const kinds = new Set(lesson.exercises.map((ex) => ex.visual.kind))
    if (isReview(lesson)) {
      assert.ok(kinds.size >= 3, `${where(lesson)}: chỉ có ${[...kinds].join(', ')}`)
    } else if (lesson.number >= 2 && !isSpelling(lesson)) {
      assert.ok(kinds.has('listen'), `${where(lesson)}: thiếu dạng listen`)
      assert.ok(kinds.has('build'), `${where(lesson)}: thiếu dạng build`)
      assert.ok(kinds.size >= 3, `${where(lesson)}: chỉ có ${[...kinds].join(', ')}`)
    }
  }
})

test('câu ghép tiếng: có âm đầu, đủ mảnh của đáp án, mỗi hàng tối đa 4 mảnh, ghép ra đúng đáp án', () => {
  for (const lesson of lessons) {
    lesson.exercises.forEach((ex, i) => {
      if (ex.visual.kind !== 'build') return
      const at = `${where(lesson)}, câu ${i + 1} ("${ex.answer}")`
      const { onset, rime, tone } = splitSyllable(ex.answer)
      assert.notEqual(onset, '', `${at}: không có âm đầu`)
      assert.ok(ex.visual.onsets.includes(onset), `${at}: thiếu mảnh âm đầu "${onset}"`)
      assert.ok(ex.visual.rimes.includes(rime), `${at}: thiếu mảnh vần "${rime}"`)
      assert.ok(ex.visual.tones.includes(tone), `${at}: thiếu mảnh dấu ${tone}`)
      for (const row of [ex.visual.onsets, ex.visual.rimes, ex.visual.tones]) {
        assert.ok(row.length <= 4, `${at}: một hàng có ${row.length} mảnh`)
      }
      assert.equal(composeSyllable(onset, rime, tone), ex.answer, at)
    })
  }
})

/** Duyệt sâu một giá trị, gọi visit với mọi chuỗi kèm đường dẫn tới chuỗi đó */
function eachString(value, path, visit) {
  if (typeof value === 'string') visit(value, path)
  else if (Array.isArray(value)) value.forEach((item, i) => eachString(item, `${path}[${i}]`, visit))
  else if (value !== null && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) eachString(item, `${path}.${key}`, visit)
  }
}

test('mọi chuỗi nội dung ở dạng NFC', () => {
  let count = 0
  eachString(tiengViet1Chapters, 'tiengViet1Chapters', (text, path) => {
    count += 1
    assert.equal(text, text.normalize('NFC'), path)
  })
  assert.ok(count > 0)
})

test('mỗi âm/chữ bài dạy có cách đọc trong UNIT_SAY', () => {
  for (const lesson of lessons) {
    for (const unit of lesson.teaches.units) {
      assert.ok(UNIT_SAY[unit]?.trim(), `${where(lesson)}: "${unit}" chưa có cách đọc`)
    }
  }
})

test('tranh của picture, pictures, scene không rỗng', () => {
  for (const lesson of lessons) {
    const visuals = [
      ...lesson.intro.map((card, i) => [`thẻ ${i + 1}`, card.visual]),
      ...lesson.exercises.map((ex, i) => [`câu ${i + 1}`, ex.visual]),
    ]
    for (const [at, visual] of visuals) {
      const emoji =
        visual.kind === 'picture' ? [visual.emoji]
          : visual.kind === 'pictures' ? visual.items.map((item) => item.emoji)
            : visual.kind === 'scene' ? visual.emoji
              : []
      if (visual.kind === 'scene') assert.ok(emoji.length > 0, `${where(lesson)}, ${at}: scene không có tranh`)
      for (const e of emoji) assert.ok(e.trim(), `${where(lesson)}, ${at}: tranh rỗng`)
    }
  }
})
