// Xử lý tiếng Việt cho môn Tiếng Việt lớp 1: tách/ghép tiếng thành âm đầu + vần + thanh.
// File này Node chạy trực tiếp (--experimental-strip-types): chỉ dùng cú pháp TypeScript xóa được.
// Quy ước Unicode: đầu vào/đầu ra luôn ở dạng NFC; bên trong dùng NFD để tìm và bỏ dấu thanh,
// giữ nguyên dấu phụ của nguyên âm (mũ ̂, trăng ̆, móc ̛).
import type {
  Learned, ReadingExerciseSeed, ReadingLessonSeed, ReadingVisual, SyllableParts, Tone,
} from '../types/tiengviet'

// --- Thanh điệu ---

/** Sáu thanh, theo thứ tự ngang, huyền, sắc, hỏi, ngã, nặng */
export const TONES: Tone[] = ['ngang', 'huyen', 'sac', 'hoi', 'nga', 'nang']

export const TONE_NAMES: Record<Tone, string> = {
  ngang: 'không dấu', huyen: 'huyền', sac: 'sắc', hoi: 'hỏi', nga: 'ngã', nang: 'nặng',
}

/** Dấu thanh dạng ký tự kết hợp: huyền U+0300, sắc U+0301, hỏi U+0309, ngã U+0303, nặng U+0323 */
const TONE_MARKS: Record<Tone, string> = {
  ngang: '', huyen: '̀', sac: '́', hoi: '̉', nga: '̃', nang: '̣',
}

/** Nhãn hiển thị của thanh: "không dấu" hoặc "◌̀ huyền" (dấu đặt trên vòng tròn chấm) */
export function toneLabel(tone: Tone): string {
  if (tone === 'ngang') return TONE_NAMES.ngang
  return ('◌' + TONE_MARKS[tone] + ' ' + TONE_NAMES[tone]).normalize('NFC')
}

/** Thanh của một tiếng (tiếng không có dấu thanh là thanh ngang) */
export function toneOf(syllable: string): Tone {
  for (const ch of syllable.normalize('NFD')) {
    const found = TONES.find((t) => t !== 'ngang' && TONE_MARKS[t] === ch)
    if (found) return found
  }
  return 'ngang'
}

/** Bỏ dấu thanh, giữ dấu mũ/trăng/móc: "trừa" → "trưa" */
export function stripTone(syllable: string): string {
  let out = ''
  for (const ch of syllable.normalize('NFD')) {
    if (!TONES.some((t) => t !== 'ngang' && TONE_MARKS[t] === ch)) out += ch
  }
  return out.normalize('NFC')
}

// --- Âm đầu, vần, tiếng ---

/** Các âm đầu; khi so khớp lấy chuỗi dài nhất (ngh trước ng, tr trước t...) */
const ONSETS: string[] = [
  'ngh', 'ng', 'nh', 'ch', 'gh', 'gi', 'kh', 'ph', 'qu', 'th', 'tr',
  'b', 'c', 'd', 'đ', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x',
]

/** Chuỗi có bắt đầu bằng nguyên âm không (xét chữ cái gốc, bỏ dấu phụ) */
function startsWithVowel(s: string): boolean {
  return /^[aeiouy]/.test(s.normalize('NFD'))
}

/**
 * Tách một tiếng (viết thường) thành âm đầu, vần (không dấu thanh) và thanh.
 * Chỉ chính xác với vần mở của đợt 1: một nguyên âm, ia, ua, ưa.
 */
export function splitSyllable(syllable: string): SyllableParts {
  const tone = toneOf(syllable)
  const base = stripTone(syllable)
  let onset = ''
  for (const o of ONSETS) {
    if (base.startsWith(o) && o.length > onset.length) onset = o
  }
  // Không còn gì sau âm đầu (không có nguyên âm): coi cả chuỗi là vần
  if (onset !== '' && onset !== 'gi' && base.length === onset.length) {
    return { onset: '', rime: base, tone }
  }
  if (onset === 'gi') {
    const rest = base.slice(2)
    // "gì" (gi đứng cuối) hoặc "gin" (gi trước phụ âm): chữ i thuộc vần
    if (rest === '') return { onset: 'gi', rime: 'i', tone }
    if (!startsWithVowel(rest)) return { onset: 'g', rime: base.slice(1), tone }
  }
  return { onset, rime: base.slice(onset.length), tone }
}

/**
 * Ghép âm đầu + vần (không dấu thanh) + thanh thành một tiếng.
 * Dấu thanh đặt trên nguyên âm đầu tiên của vần (qu, gi thuộc âm đầu nên "quá", "giả" vẫn đúng).
 */
export function composeSyllable(onset: string, rime: string, tone: Tone): string {
  // gi + vần bắt đầu bằng i: bỏ bớt một i ("gi" + "i" → "gì")
  const head = onset === 'gi' && rime.startsWith('i') ? 'g' : onset
  const chars = Array.from(rime.normalize('NFD'))
  const vowelAt = chars.findIndex((c) => /[aeiouy]/.test(c))
  if (vowelAt >= 0 && tone !== 'ngang') {
    // Chèn dấu thanh sau các dấu phụ của nguyên âm (mũ, trăng, móc) để NFC ghép đúng
    let at = vowelAt + 1
    while (at < chars.length && /\p{M}/u.test(chars[at])) at++
    chars.splice(at, 0, TONE_MARKS[tone])
  }
  return (head.normalize('NFC') + chars.join('')).normalize('NFC')
}

/** Các cụm chữ cái trong văn bản, viết thường: "Bà bế bé." → ["bà", "bế", "bé"] */
export function syllablesOf(text: string): string[] {
  return text.normalize('NFC').toLowerCase().match(/[\p{L}\p{M}]+/gu) ?? []
}

// --- Kiểm tra nội dung: chính tả và chữ đã học ---

/** Âm đầu viết bằng c/g/ng (đứng trước a, o, u...) và dạng viết trước i, e, ê */
const FRONT_SPELLING: Record<string, string> = { c: 'k', g: 'gh', ng: 'ngh' }
/** Chiều ngược lại: k/gh/ngh chỉ đứng trước i, e, ê */
const BACK_SPELLING: Record<string, string> = { k: 'c', gh: 'g', ngh: 'ng' }

/** Vần có bắt đầu bằng i, e, ê không (kể cả "ia"); xét chữ cái gốc, bỏ dấu phụ */
function startsWithFrontVowel(rime: string): boolean {
  return /^[ie]/.test(rime.normalize('NFD'))
}

/**
 * Kiểm tra quy tắc chính tả c/k, g/gh, ng/ngh của một tiếng. Trả về mô tả lỗi, hoặc null nếu đúng.
 * Các âm đầu gi và qu không xét; "k" trước "y" (kỳ, kỹ) là hợp lệ.
 */
export function spellingError(syllable: string): string | null {
  const s = syllable.normalize('NFC').toLowerCase()
  const { onset, rime } = splitSyllable(s)
  if (onset in FRONT_SPELLING && startsWithFrontVowel(rime)) {
    return `"${s}" sai chính tả: "${onset}" đứng trước i, e, ê phải viết "${FRONT_SPELLING[onset]}"`
  }
  if (onset in BACK_SPELLING && !startsWithFrontVowel(rime) && !(onset === 'k' && rime.startsWith('y'))) {
    return `"${s}" sai chính tả: "${onset}" chỉ đứng trước i, e, ê, các vần khác phải viết "${BACK_SPELLING[onset]}"`
  }
  return null
}

/**
 * Kiểm tra một tiếng chỉ dùng chữ và dấu đã học. Trả về mô tả những gì chưa học, hoặc null.
 * Vần phải nằm nguyên trong learned.units (vần "ia" chỉ được dùng sau khi đã học "ia").
 */
export function learnedError(syllable: string, learned: Learned): string | null {
  const s = syllable.normalize('NFC').toLowerCase()
  const { onset, rime, tone } = splitSyllable(s)
  const missing: string[] = []
  if (onset !== '' && !learned.units.has(onset)) missing.push(`"${onset}"`)
  if (rime !== '' && !learned.units.has(rime)) missing.push(`"${rime}"`)
  if (tone !== 'ngang' && !learned.tones.has(tone)) missing.push(`dấu ${TONE_NAMES[tone]}`)
  return missing.length > 0 ? `"${s}" chưa học ${missing.join(', ')}` : null
}

/** Phần chữ trẻ phải tự đọc trong hình minh họa (spec 6.2); các kind còn lại không có */
export function readableTexts(visual: ReadingVisual): string[] {
  switch (visual.kind) {
    case 'picture': return visual.word ? [visual.word] : []
    case 'pictures': return visual.items.map((item) => item.word)
    case 'spell': return visual.steps.map((step) => step.result)
    case 'sentence': return [visual.text]
    case 'tone': return [visual.base]
    default: return []
  }
}

/** Một đoạn chữ trẻ phải đọc; skipSpelling = lựa chọn sai của câu chính tả (allowMisspelled), không xét quy tắc chính tả */
interface ReadableText { text: string; skipSpelling: boolean }

function exerciseTexts(ex: ReadingExerciseSeed): ReadableText[] {
  const out: ReadableText[] = readableTexts(ex.visual).map((text) => ({ text, skipSpelling: false }))
  // Dạng nghe và dạng dấu thanh: lựa chọn không phải chữ trẻ phải tự đọc
  if (ex.visual.kind !== 'listen' && ex.visual.kind !== 'tone') {
    for (const option of ex.options) {
      out.push({ text: option, skipSpelling: ex.allowMisspelled === true && option !== ex.answer })
    }
  }
  // Dạng ghép tiếng: đáp án là chữ trẻ ghép ra
  if (ex.visual.kind === 'build') out.push({ text: ex.answer, skipSpelling: false })
  return out
}

/** Phần chữ trẻ phải tự đọc trong một câu: hình minh họa + lựa chọn (+ đáp án với dạng ghép tiếng) */
export function exerciseReadables(ex: ReadingExerciseSeed): string[] {
  return exerciseTexts(ex).map((t) => t.text)
}

/**
 * Quét các bài theo thứ tự, cộng dồn chữ đã học (bài N dùng được cả những gì bài N dạy).
 * Trả về danh sách lỗi cho người soạn nội dung, rỗng nếu nội dung hợp lệ.
 */
export function checkLessons(lessons: ReadingLessonSeed[]): string[] {
  const learned: Learned = { units: new Set<string>(), tones: new Set<Tone>() }
  const errors = new Set<string>() // Set để cùng một lỗi lặp lại trong một câu chỉ báo một lần

  for (const lesson of lessons) {
    for (const unit of lesson.teaches.units) learned.units.add(unit)
    for (const tone of lesson.teaches.tones) learned.tones.add(tone)

    const check = (where: string, texts: ReadableText[]): void => {
      for (const { text, skipSpelling } of texts) {
        for (const syllable of syllablesOf(text)) {
          const found = [learnedError(syllable, learned), skipSpelling ? null : spellingError(syllable)]
          for (const message of found) {
            if (message !== null) errors.add(`${where}: ${message}`)
          }
        }
      }
    }

    lesson.intro.forEach((card, i) => {
      const where = `Bài ${lesson.number} (${lesson.slug}), thẻ ${i + 1}`
      check(where, readableTexts(card.visual).map((text) => ({ text, skipSpelling: false })))
    })

    lesson.exercises.forEach((ex, i) => {
      const where = `Bài ${lesson.number} (${lesson.slug}), câu ${i + 1}`
      check(where, exerciseTexts(ex))
      if (ex.visual.kind === 'tone') {
        for (const option of ex.options) {
          const tone = TONES.find((t) => toneLabel(t) === option.normalize('NFC'))
          if (tone === undefined) {
            errors.add(`${where}: "${option}" không phải tên một dấu thanh`)
          } else if (tone !== 'ngang' && !learned.tones.has(tone)) {
            errors.add(`${where}: "${option}" chưa học dấu ${TONE_NAMES[tone]}`)
          }
        }
      }
    })
  }
  return Array.from(errors)
}
