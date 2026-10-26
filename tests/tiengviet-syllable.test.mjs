import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  splitSyllable, composeSyllable, toneOf, stripTone, toneLabel, syllablesOf,
} from '../src/lib/tiengviet.ts'

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
test('syllablesOf bỏ qua emoji có bộ chọn biểu tượng U+FE0F và ZWJ', () => {
  assert.deepEqual(syllablesOf('☀️ ✏️'), [])
  assert.deepEqual(syllablesOf('\u{1F3C3}‍♂️'), [])
  assert.deepEqual(syllablesOf('bà ☀️ bé'), ['bà', 'bé'])
})
