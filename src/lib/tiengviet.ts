// Xử lý tiếng Việt cho môn Tiếng Việt lớp 1: tách/ghép tiếng thành âm đầu + vần + thanh.
// File này Node chạy trực tiếp (--experimental-strip-types): chỉ dùng cú pháp TypeScript xóa được.
// Quy ước Unicode: đầu vào/đầu ra luôn ở dạng NFC; bên trong dùng NFD để tìm và bỏ dấu thanh,
// giữ nguyên dấu phụ của nguyên âm (mũ ̂, trăng ̆, móc ̛).
import type { SyllableParts, Tone } from '../types/tiengviet'

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
