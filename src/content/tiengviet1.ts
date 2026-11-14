// Nội dung Tiếng Việt lớp 1 (30 bài, mã tv1-bai-01 … tv1-bai-30), theo thứ tự bài của sách Kết nối tri thức.
// Câu chữ và bài tập tự soạn, không chép sách. Phần trẻ tự đọc chỉ dùng chữ và dấu đã học (spec 6.2, checkLessons).
// Đây là nguồn duy nhất: scripts/build-seed.mjs đọc file này để sinh supabase/seed.sql.
// Node chạy trực tiếp file này (--experimental-strip-types): import kiểu dùng `import type`, import lúc chạy có đuôi `.ts`.
import type {
  PictureWord, ReadingChapterSeed, ReadingExerciseSeed, ReadingIntro, ReadingVisual, SpellStep, Tone,
} from '../types/tiengviet'
import {
  composeSyllable, spellingError, splitSyllable, stripTone, syllablesOf, toneLabel, toneOf, TONE_NAMES,
} from '../lib/tiengviet.ts'
import { UNIT_SAY } from './tiengviet-sounds.ts'

// ---------- Hàm tạo thẻ và câu hỏi ----------

/** Câu chọn đáp án; báo lỗi khi đáp án không nằm trong lựa chọn (như hàm ex() của Toán) */
function choice(
  prompt: string, visual: ReadingVisual, answer: string, options: string[], explain: string, difficulty: 1 | 2 | 3 = 1,
): ReadingExerciseSeed {
  if (!options.includes(answer)) throw new Error(`Đáp án "${answer}" không có trong lựa chọn của câu: ${prompt}`)
  return { prompt, visual, options, answer, explain, difficulty }
}

function intro(text: string, visual: ReadingVisual): ReadingIntro {
  return { text, visual }
}

/** Cách đọc khi dạy của một âm/chữ; thiếu thì báo lỗi để không đọc sai */
function sayOf(unit: string): string {
  const say = UNIT_SAY[unit]
  if (!say) throw new Error(`Chưa có cách đọc cho "${unit}" trong UNIT_SAY`)
  return say
}

/** Thẻ chữ: chữ hoa và chữ thường ("B", "b"), bấm vào nghe cách đọc ("bờ") */
function letter(unit: string): ReadingVisual {
  return { kind: 'letter', letters: [unit.charAt(0).toUpperCase() + unit.slice(1), unit], say: sayOf(unit) }
}

/** Thẻ Nhận biết; báo lỗi khi tiếng cần tô màu không có trong câu (gõ nhầm thì tiếng đó không được tô) */
function scene(emoji: string[], sentence: string, highlight: string[]): ReadingVisual {
  const words = syllablesOf(sentence)
  for (const word of highlight) {
    if (!words.includes(word)) throw new Error(`Tiếng "${word}" không có trong câu: ${sentence}`)
  }
  return { kind: 'scene', emoji, sentence, highlight }
}

/** Bước thêm dấu: ba + huyền → bà, đọc "ba, huyền, bà" */
function toneStep(onset: string, rime: string, tone: Tone): SpellStep {
  const base = composeSyllable(onset, rime, 'ngang')
  const word = composeSyllable(onset, rime, tone)
  return { parts: [base, toneLabel(tone)], result: word, say: `${base}, ${TONE_NAMES[tone]}, ${word}` }
}

/** Đánh vần một tiếng: b + a → ba (đọc "bờ, a, ba"), rồi thêm dấu nếu có */
function spell(onset: string, rime: string, tone: Tone): SpellStep[] {
  const base = composeSyllable(onset, rime, 'ngang')
  const steps: SpellStep[] = [{ parts: [onset, rime], result: base, say: `${sayOf(onset)}, ${sayOf(rime)}, ${base}` }]
  if (tone !== 'ngang') steps.push(toneStep(onset, rime, tone))
  return steps
}

/** Tiếng nào trong word có unit làm âm đầu hoặc vần ("bà" có b và a) */
function hasUnit(word: string, unit: string): boolean {
  return syllablesOf(word).some((syllable) => {
    const { onset, rime } = splitSyllable(syllable)
    return onset === unit || rime === unit
  })
}

/** Có chứa các chữ cái của unit không, bỏ qua dấu thanh: "cá" chứa "a", còn "bê" không chứa "e" */
function containsLetters(word: string, unit: string): boolean {
  return stripTone(word.normalize('NFC').toLowerCase()).includes(unit)
}

/** Câu "tìm tiếng có âm": đáp án phải có âm đó, các lựa chọn còn lại không được chứa chữ đó */
function checkFind(prompt: string, unit: string, answer: string, others: string[]): void {
  if (!hasUnit(answer, unit)) throw new Error(`"${answer}" không có ${unit}: ${prompt}`)
  const wrong = others.find((other) => containsLetters(other, unit))
  if (wrong !== undefined) throw new Error(`Lựa chọn sai "${wrong}" cũng chứa ${unit}: ${prompt}`)
}

/** Dạng 1: nghe đọc một âm/chữ hoặc một tiếng, chọn chữ đúng. Lựa chọn gây nhiễu được phép là chữ chưa học */
function listenEx(answer: string, options: string[]): ReadingExerciseSeed {
  // Đáp án là âm/chữ đang dạy (có trong UNIT_SAY) thì gọi là "chữ"; còn lại là một tiếng, như cách gọi của sách
  const isUnit = Object.hasOwn(UNIT_SAY, answer)
  return choice(
    'Bé bấm loa, nghe rồi chọn chữ đúng.',
    { kind: 'listen', say: UNIT_SAY[answer] ?? answer },
    answer, options, isUnit ? `Đó là chữ ${answer}.` : `Đó là tiếng ${answer}.`,
  )
}

/** Dạng 2: nhìn tranh, chọn từ đúng (tranh không kèm chữ vì chữ là đáp án) */
function pictureEx(emoji: string, word: string, options: string[]): ReadingExerciseSeed {
  return choice('Tranh vẽ gì? Bé chọn chữ đúng.', { kind: 'picture', emoji }, word, options, `Tranh vẽ "${word}".`)
}

/** Dạng 3: tìm tiếng có âm mới; hình là thẻ chữ của âm đó */
function findEx(unit: string, answer: string, options: string[]): ReadingExerciseSeed {
  const prompt = `Tiếng nào có ${unit}?`
  checkFind(prompt, unit, answer, options.filter((option) => option !== answer))
  return choice(prompt, letter(unit), answer, options, `"${answer}" có ${unit}.`)
}

/**
 * Dạng 3 với lựa chọn là tranh (chỉ bài 1, khi trẻ chưa đọc được tiếng nào).
 * `at` là vị trí của tranh đúng trong các lựa chọn, để đáp án không luôn đứng đầu.
 */
function findPictureEx(unit: string, answer: PictureWord, others: PictureWord[], at = 0): ReadingExerciseSeed {
  const prompt = `Tranh nào có tiếng chứa ${unit}?`
  checkFind(prompt, unit, answer.word, others.map((other) => other.word))
  const options = others.map((other) => other.emoji)
  options.splice(at, 0, answer.emoji)
  return choice(prompt, letter(unit), answer.emoji, options, `Tranh ${answer.emoji} là "${answer.word}", có ${unit}.`)
}

/** Dạng 4: nhìn tranh và tiếng chưa có dấu, chọn dấu thanh */
function toneEx(emoji: string, word: string, tones: Tone[]): ReadingExerciseSeed {
  const base = stripTone(word)
  const tone = toneOf(word)
  const explain = tone === 'ngang' ? `${word} không có dấu.` : `${base} thêm dấu ${TONE_NAMES[tone]} thành ${word}.`
  return choice('Bé chọn dấu để được tiếng chỉ tranh.', { kind: 'tone', emoji, base }, toneLabel(tone), tones.map(toneLabel), explain, 2)
}

/** Dạng 5: bấm các mảnh âm đầu, vần, dấu để ghép tiếng chỉ tranh; loa đọc chính tiếng đó */
function buildEx(emoji: string, word: string, onsets: string[], rimes: string[], tones: Tone[]): ReadingExerciseSeed {
  const { onset, rime, tone } = splitSyllable(word)
  const base = composeSyllable(onset, rime, 'ngang')
  const explain =
    tone === 'ngang'
      ? `${onset} ghép với ${rime} thành ${word}.`
      : `${onset} ghép với ${rime} thành ${base}, thêm dấu ${TONE_NAMES[tone]} thành ${word}.`
  return {
    prompt: 'Bé ghép tiếng chỉ tranh.',
    visual: { kind: 'build', emoji, say: word, onsets, rimes, tones },
    options: [],
    answer: word,
    explain,
    difficulty: 2,
  }
}

/** Cặp chữ cùng cách đọc theo quy tắc chính tả: c/k, g/gh, ng/ngh */
const SPELLING_PAIR: Record<string, string> = { c: 'k', k: 'c', g: 'gh', gh: 'g', ng: 'ngh', ngh: 'ng' }

/**
 * Bài 29: chọn cách viết đúng cho tranh. Lựa chọn sai đổi âm đầu của tiếng đầu sang chữ cùng cách đọc
 * nhưng sai quy tắc (kẻ → cẻ, gà → ghà). `at` là vị trí của cách viết đúng, để đáp án không luôn đứng đầu
 */
function spellingEx(picture: PictureWord, at: 0 | 1): ReadingExerciseSeed {
  const [first, ...rest] = picture.word.split(' ')
  const { onset, rime, tone } = splitSyllable(first)
  const swapped: string | undefined = SPELLING_PAIR[onset]
  if (swapped === undefined || spellingError(first) !== null) {
    throw new Error(`"${picture.word}" phải mở đầu bằng c, k, g, gh, ng hoặc ngh viết đúng quy tắc`)
  }
  const wrong = [composeSyllable(swapped, rime, tone), ...rest].join(' ')
  const options = at === 0 ? [picture.word, wrong] : [wrong, picture.word]
  const vowel = Array.from(rime)[0]
  return {
    ...choice(
      'Bé chọn cách viết đúng cho tranh.', { kind: 'picture', emoji: picture.emoji }, picture.word, options,
      `Trước ${vowel} viết ${onset}, nên viết ${picture.word}.`,
    ),
    allowMisspelled: true,
  }
}

// ---------- Tranh dùng nhiều lần ----------

const BA_GRANDMA: PictureWord = { emoji: '👵', word: 'bà' }
const CA_FISH: PictureWord = { emoji: '🐟', word: 'cá' }
const GA_CHICKEN: PictureWord = { emoji: '🐔', word: 'gà' }
const NHA_HOUSE: PictureWord = { emoji: '🏠', word: 'nhà' }
const CA_EGGPLANT: PictureWord = { emoji: '🍆', word: 'cà' }
const BE_BABY: PictureWord = { emoji: '👶', word: 'bé' }
/** Số 3 đọc là "ba"; emoji có U+FE0F vì không có tranh nào khác chỉ rõ "ba" */
const BA_THREE: PictureWord = { emoji: '3️⃣', word: 'ba' }
const BO_COW: PictureWord = { emoji: '🐄', word: 'bò' }
const CO_GRASS: PictureWord = { emoji: '🌿', word: 'cỏ' }
/** Cô giáo; trẻ gọi "cô" */
const CO_TEACHER: PictureWord = { emoji: '👩‍🏫', word: 'cô' }
/** Cái ô (miền Nam gọi là dù) */
const O_UMBRELLA: PictureWord = { emoji: '☔', word: 'ô' }
/** Bọ rùa; trẻ gọi chung là "con bọ" */
const BO_BUG: PictureWord = { emoji: '🐞', word: 'bọ' }
const DE_GOAT: PictureWord = { emoji: '🐐', word: 'dê' }
const DE_CRICKET: PictureWord = { emoji: '🦗', word: 'dế' }
const DO_BOAT: PictureWord = { emoji: '🛶', word: 'đò' }
const CO_FLAG: PictureWord = { emoji: '🚩', word: 'cờ' }
const BO_AVOCADO: PictureWord = { emoji: '🥑', word: 'bơ' }
/** Quả bí ngô (miền Nam gọi là bí đỏ); trẻ gọi "quả bí" */
const BI_PUMPKIN: PictureWord = { emoji: '🎃', word: 'bí' }
/** Trẻ thường gọi tranh này là thằn lằn hay tắc kè, nên chỉ dùng ở thẻ Từ ngữ (có chữ bên dưới), không dùng làm đáp án câu "Tranh vẽ gì?" */
const KI_DA_LIZARD: PictureWord = { emoji: '🦎', word: 'kì đà' }
/** Con hổ (miền Nam gọi là cọp) */
const HO_TIGER: PictureWord = { emoji: '🐯', word: 'hổ' }
const LA_LEAF: PictureWord = { emoji: '🍁', word: 'lá' }
const LE_PEAR: PictureWord = { emoji: '🍐', word: 'lê' }
/** Chú hề */
const HE_CLOWN: PictureWord = { emoji: '🤡', word: 'hề' }
/** Con cú (cú mèo) */
const CU_OWL: PictureWord = { emoji: '🦉', word: 'cú' }
const CHO_DOG: PictureWord = { emoji: '🐶', word: 'chó' }
const KHI_MONKEY: PictureWord = { emoji: '🐒', word: 'khỉ' }
/** Cuộn chỉ */
const CHI_THREAD: PictureWord = { emoji: '🧵', word: 'chỉ' }
/** Mẹ ôm em bé cho bú; tranh 👩 dễ bị gọi là cô hay chị */
const ME_MOTHER: PictureWord = { emoji: '🤱', word: 'mẹ' }
/** Mũ lưỡi trai (miền Nam gọi là nón) */
const MU_CAP: PictureWord = { emoji: '🧢', word: 'mũ' }
/** Cái nơ cài tóc */
const NO_BOW: PictureWord = { emoji: '🎀', word: 'nơ' }
/** Khúc gỗ */
const GO_WOOD: PictureWord = { emoji: '🪵', word: 'gỗ' }
const GIO_BASKET: PictureWord = { emoji: '🧺', word: 'giỏ' }
const GHE_CHAIR: PictureWord = { emoji: '🪑', word: 'ghế' }
/** Chùm nho */
const NHO_GRAPES: PictureWord = { emoji: '🍇', word: 'nho' }
/** Bắp ngô (miền Nam gọi là bắp) */
const NGO_CORN: PictureWord = { emoji: '🌽', word: 'ngô' }
const NGU_SLEEP: PictureWord = { emoji: '😴', word: 'ngủ' }
/** Mặt đang suy nghĩ */
const NGHI_THINK: PictureWord = { emoji: '🤔', word: 'nghĩ' }
/** Quyển sổ có gáy xoắn */
const SO_NOTEBOOK: PictureWord = { emoji: '📒', word: 'sổ' }
/** Mặt hét lên vì sợ */
const SO_SCARED: PictureWord = { emoji: '😱', word: 'sợ' }
const O_TO_CAR: PictureWord = { emoji: '🚗', word: 'ô tô' }
const SU_TU_LION: PictureWord = { emoji: '🦁', word: 'sư tử' }
/** Chén trà (miền Bắc còn gọi là chè) */
const TRA_TEA: PictureWord = { emoji: '🍵', word: 'trà' }
/** Cành tre; trẻ có thể chưa nhận ra, nên chỉ dùng ở thẻ Từ ngữ (có chữ) và câu ghép tiếng (có loa đọc) */
const TRE_BAMBOO: PictureWord = { emoji: '🎋', word: 'tre' }
const THO_RABBIT: PictureWord = { emoji: '🐰', word: 'thỏ' }
/** Cái thìa (miền Nam gọi là muỗng) */
const THIA_SPOON: PictureWord = { emoji: '🥄', word: 'thìa' }
/** Đĩa nhạc */
const DIA_DISC: PictureWord = { emoji: '💿', word: 'đĩa' }
const CUA_CRAB: PictureWord = { emoji: '🦀', word: 'cua' }
const RUA_TURTLE: PictureWord = { emoji: '🐢', word: 'rùa' }
const DUA_COCONUT: PictureWord = { emoji: '🥥', word: 'dừa' }
/** Bát phở; trẻ có thể gọi là mì, nên không dùng làm đáp án câu "Tranh vẽ gì?" */
const PHO_NOODLE: PictureWord = { emoji: '🍜', word: 'phở' }
/** Hộp quà */
const QUA_GIFT: PictureWord = { emoji: '🎁', word: 'quà' }
/** Cái ví; trẻ có thể gọi là túi */
const VI_WALLET: PictureWord = { emoji: '👛', word: 'ví' }
const VA_LI_SUITCASE: PictureWord = { emoji: '🧳', word: 'va li' }
/** Xe đạp; trẻ gọi chung là xe */
const XE_BIKE: PictureWord = { emoji: '🚲', word: 'xe' }
/** Viên đá quý; trẻ có thể gọi là kim cương */
const DA_QUY_GEM: PictureWord = { emoji: '💎', word: 'đá quý' }
/** Người quỳ gối */
const QUY_KNEEL: PictureWord = { emoji: '🧎', word: 'quỳ' }

// ---------- Chương trình ----------

export const tiengViet1Chapters: ReadingChapterSeed[] = [
  {
    number: 1,
    title: 'Âm và chữ: a, b, c, e, ê',
    lessons: [
      {
        number: 1,
        slug: 'tv1-bai-01',
        title: 'A a',
        mark: 'Aa',
        description: 'Nghe và nhận ra âm a, chữ a',
        teaches: { units: ['a'], tones: [] },
        intro: [
          intro('Bé bấm nghe câu. Các tiếng tô màu đều có âm a.', scene(['👵', '👧', '🐔'], 'Bà và bé ra xem gà.', ['bà', 'và', 'ra', 'gà'])),
          intro('Đây là chữ a: A hoa và a thường. Bé bấm vào chữ để nghe.', letter('a')),
          intro('Cá, gà, nhà: tiếng nào cũng có âm a.', scene([CA_FISH.emoji, GA_CHICKEN.emoji, NHA_HOUSE.emoji], 'Cá, gà, nhà.', ['cá', 'gà', 'nhà'])),
        ],
        exercises: [
          listenEx('a', ['o', 'e', 'u', 'a']),
          findPictureEx('a', CA_FISH, [{ emoji: '🐶', word: 'chó' }, { emoji: '🐝', word: 'ong' }], 0),
          listenEx('a', ['e', 'a', 'ô']),
          findPictureEx('a', GA_CHICKEN, [{ emoji: '🐱', word: 'mèo' }, { emoji: '🐘', word: 'voi' }], 1),
          findPictureEx('a', BA_GRANDMA, [BE_BABY, { emoji: '🐰', word: 'thỏ' }], 2),
          listenEx('a', ['o', 'ơ', 'a']),
          findPictureEx('a', NHA_HOUSE, [{ emoji: '🐄', word: 'bò' }, { emoji: '🦆', word: 'vịt' }, { emoji: '🐶', word: 'chó' }], 1),
        ],
      },
      {
        number: 2,
        slug: 'tv1-bai-02',
        title: 'B b, dấu huyền',
        mark: 'Bb',
        description: 'Học chữ b và dấu huyền, đánh vần ba, bà',
        teaches: { units: ['b'], tones: ['huyen'] },
        intro: [
          intro('Bé bấm nghe câu. Các tiếng tô màu đều có âm b.', scene(['👧', '🍰', '👵'], 'Bé bê bánh mời bà.', ['bé', 'bê', 'bánh', 'bà'])),
          intro('Chữ b đọc là bờ. Bé bấm vào chữ để nghe.', letter('b')),
          intro('Bé đánh vần: bờ, a, ba. Ba thêm dấu huyền thành bà.', { kind: 'spell', steps: spell('b', 'a', 'huyen') }),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [BA_GRANDMA, BA_THREE] }),
        ],
        exercises: [
          listenEx('b', ['d', 'b', 'h']),
          pictureEx(BA_GRANDMA.emoji, 'bà', ['bà', 'ba']),
          findEx('b', 'bà', ['a', 'à', 'bà']),
          toneEx(BA_GRANDMA.emoji, 'bà', ['ngang', 'huyen']),
          listenEx('bà', ['ba', 'bá', 'bà']),
          toneEx(BA_THREE.emoji, 'ba', ['ngang', 'huyen']),
          buildEx(BA_GRANDMA.emoji, 'bà', ['b'], ['a'], ['ngang', 'huyen']),
        ],
      },
      {
        number: 3,
        slug: 'tv1-bai-03',
        title: 'C c, dấu sắc',
        mark: 'Cc',
        description: 'Học chữ c và dấu sắc, đánh vần ca, cá',
        teaches: { units: ['c'], tones: ['sac'] },
        intro: [
          intro('Bé bấm nghe câu. Các tiếng tô màu đều có âm c.', scene(['👦', '🎣', '🐟'], 'Bé theo bố đi câu cá.', ['câu', 'cá'])),
          intro('Chữ c đọc là cờ. Bé bấm vào chữ để nghe.', letter('c')),
          intro(
            'Bé đánh vần: cờ, a, ca. Ca thêm dấu sắc thành cá, thêm dấu huyền thành cà.',
            { kind: 'spell', steps: [...spell('c', 'a', 'sac'), toneStep('c', 'a', 'huyen')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [CA_FISH, CA_EGGPLANT] }),
        ],
        exercises: [
          listenEx('c', ['o', 'c', 'e']),
          pictureEx(CA_FISH.emoji, 'cá', ['cá', 'ca', 'cà']),
          findEx('c', 'cà', ['à', 'bà', 'cà']),
          toneEx(CA_EGGPLANT.emoji, 'cà', ['sac', 'huyen', 'ngang']),
          listenEx('cá', ['ca', 'cà', 'cá']),
          toneEx(CA_FISH.emoji, 'cá', ['ngang', 'huyen', 'sac']),
          buildEx(CA_FISH.emoji, 'cá', ['b', 'c'], ['a'], ['ngang', 'huyen', 'sac']),
        ],
      },
      {
        number: 4,
        slug: 'tv1-bai-04',
        title: 'E e, Ê ê',
        mark: 'Eê',
        description: 'Học chữ e, ê và đọc câu ngắn đầu tiên',
        teaches: { units: ['e', 'ê'], tones: [] },
        intro: [
          intro('Bé bấm nghe câu. Các tiếng tô màu có âm e hoặc âm ê.', scene(['👧', '🏡', '👵'], 'Bé về quê thăm bà.', ['bé', 'về', 'quê'])),
          intro('Đây là chữ e: E hoa và e thường. Bé bấm vào chữ để nghe.', letter('e')),
          intro('Chữ ê là chữ e đội thêm cái mũ. Bé bấm vào chữ để nghe.', letter('ê')),
          intro(
            'Bé đánh vần: bờ, e, be, sắc, bé. Bờ, ê, bê, sắc, bế.',
            { kind: 'spell', steps: [...spell('b', 'e', 'sac'), ...spell('b', 'ê', 'sac')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [BE_BABY, BA_GRANDMA] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Bà bế bé.', highlight: ['bế', 'bé'] }),
        ],
        exercises: [
          listenEx('e', ['ê', 'e', 'a']),
          pictureEx(BE_BABY.emoji, 'bé', ['bé', 'bế', 'bè']),
          findEx('ê', 'bế', ['bé', 'bà', 'bế']),
          listenEx('ê', ['e', 'ê', 'ơ']),
          findEx('e', 'bè', ['bê', 'bè', 'ba']),
          toneEx(BE_BABY.emoji, 'bé', ['huyen', 'ngang', 'sac']),
          buildEx(BE_BABY.emoji, 'bé', ['b'], ['a', 'e', 'ê'], ['ngang', 'huyen', 'sac']),
        ],
      },
      {
        number: 5,
        slug: 'tv1-bai-05',
        title: 'Ôn tập',
        mark: 'Ôn',
        description: 'Ôn lại chữ a, b, c, e, ê và dấu huyền, dấu sắc',
        teaches: { units: [], tones: [] },
        intro: [
          intro(
            'Bé đã học năm chữ: a, b, c, e, ê. Bé bấm để nghe lại.',
            { kind: 'letter', letters: ['a', 'b', 'c', 'e', 'ê'], say: ['a', 'b', 'c', 'e', 'ê'].map(sayOf).join(', ') },
          ),
          intro(
            'Bé nhớ lại hai dấu: dấu huyền và dấu sắc.',
            { kind: 'spell', steps: [toneStep('b', 'a', 'huyen'), toneStep('c', 'a', 'sac'), toneStep('b', 'ê', 'sac')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [BA_GRANDMA, CA_FISH, BE_BABY, CA_EGGPLANT] }),
        ],
        exercises: [
          listenEx('b', ['e', 'c', 'b']),
          findEx('a', 'cá', ['bé', 'cá', 'bê']),
          pictureEx(BA_GRANDMA.emoji, 'bà', ['bé', 'cà', 'bà']),
          listenEx('bế', ['bế', 'bé', 'bè']),
          toneEx(CA_EGGPLANT.emoji, 'cà', ['ngang', 'sac', 'huyen']),
          findEx('ê', 'bê', ['bè', 'bê', 'cá']),
          buildEx(CA_FISH.emoji, 'cá', ['b', 'c'], ['a'], ['ngang', 'huyen', 'sac']),
          pictureEx(BE_BABY.emoji, 'bé', ['bé', 'bà', 'bế']),
        ],
      },
    ],
  },
  {
    number: 2,
    title: 'Âm và chữ: o, ô, d, đ, ơ',
    lessons: [
      {
        number: 6,
        slug: 'tv1-bai-06',
        title: 'O o, dấu hỏi',
        mark: 'Oo',
        description: 'Học chữ o và dấu hỏi, đánh vần bò, cỏ',
        teaches: { units: ['o'], tones: ['hoi'] },
        intro: [
          intro('Bé bấm nghe câu. Các tiếng tô màu đều có âm o.', scene(['👧', BO_COW.emoji, CO_GRASS.emoji], 'Bé cho bò ăn cỏ.', ['cho', 'bò', 'cỏ'])),
          intro('Chữ o tròn như quả trứng gà. Bé bấm vào chữ để nghe.', letter('o')),
          intro(
            'Bé đánh vần: bờ, o, bo, huyền, bò. Cờ, o, co, hỏi, cỏ.',
            { kind: 'spell', steps: [...spell('b', 'o', 'huyen'), ...spell('c', 'o', 'hoi')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [BO_COW, CO_GRASS] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Bò có cỏ, cò có cá.', highlight: ['bò', 'có', 'cỏ', 'cò'] }),
        ],
        exercises: [
          listenEx('o', ['a', 'e', 'o']),
          pictureEx(BO_COW.emoji, 'bò', ['bà', 'bò', 'bé']),
          findEx('o', 'cỏ', ['bé', 'cả', 'bế', 'cỏ']),
          toneEx(CO_GRASS.emoji, 'cỏ', ['huyen', 'sac', 'hoi', 'ngang']),
          listenEx('bỏ', ['bỏ', 'bò', 'bó']),
          toneEx(BO_COW.emoji, 'bò', ['hoi', 'huyen', 'ngang', 'sac']),
          buildEx(CO_GRASS.emoji, 'cỏ', ['b', 'c'], ['a', 'o'], ['ngang', 'huyen', 'sac', 'hoi']),
        ],
      },
      {
        number: 7,
        slug: 'tv1-bai-07',
        title: 'Ô ô, dấu nặng',
        mark: 'Ôô',
        description: 'Học chữ ô và dấu nặng, đánh vần cô, bọ',
        teaches: { units: ['ô'], tones: ['nang'] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu đều có âm ô.',
            scene([CO_TEACHER.emoji, O_UMBRELLA.emoji, '👧'], 'Trời mưa, cô che ô cho bé.', ['cô', 'ô']),
          ),
          intro('Chữ ô là chữ o đội mũ. Bé bấm vào chữ để nghe.', letter('ô')),
          intro(
            'Bé đánh vần: cờ, ô, cô. Bờ, o, bo, nặng, bọ. Dấu nặng là một chấm nhỏ dưới chữ.',
            { kind: 'spell', steps: [...spell('c', 'ô', 'ngang'), ...spell('b', 'o', 'nang')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [CO_TEACHER, O_UMBRELLA, BO_BUG] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Cô cọ bể cá.', highlight: ['cô'] }),
        ],
        exercises: [
          listenEx('ô', ['o', 'ô', 'ơ', 'a']),
          findEx('ô', 'bố', ['bố', 'bó', 'bé']),
          pictureEx(CO_TEACHER.emoji, 'cô', ['co', 'cò', 'cô', 'cổ']),
          toneEx(BO_BUG.emoji, 'bọ', ['hoi', 'nang', 'sac', 'huyen']),
          listenEx('cọ', ['co', 'cỏ', 'có', 'cọ']),
          findEx('ô', 'cổ', ['cả', 'cỏ', 'cổ']),
          pictureEx(O_UMBRELLA.emoji, 'ô', ['ô', 'cô', 'bố']),
          buildEx(CO_TEACHER.emoji, 'cô', ['b', 'c'], ['a', 'o', 'ô'], ['ngang', 'huyen', 'hoi', 'nang']),
        ],
      },
      {
        number: 8,
        slug: 'tv1-bai-08',
        title: 'D d, Đ đ',
        mark: 'Dđ',
        description: 'Học chữ d, đ, đánh vần dê, đò',
        teaches: { units: ['d', 'đ'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có âm d hoặc âm đ.',
            scene([DE_GOAT.emoji, DE_GOAT.emoji, CO_GRASS.emoji], 'Đàn dê gặm cỏ ở bờ đê.', ['đàn', 'dê', 'đê']),
          ),
          intro('Chữ d đọc là dờ. Bé bấm vào chữ để nghe.', letter('d')),
          intro('Chữ đ là chữ d có thêm một nét ngang, đọc là đờ. Bé bấm vào chữ để nghe.', letter('đ')),
          intro(
            'Bé đánh vần: dờ, ê, dê. Đờ, o, đo, huyền, đò.',
            { kind: 'spell', steps: [...spell('d', 'ê', 'ngang'), ...spell('đ', 'o', 'huyen')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [DE_GOAT, DE_CRICKET, DO_BOAT] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Bà có dê, bố có đò.', highlight: ['dê', 'đò'] }),
        ],
        exercises: [
          listenEx('đ', ['d', 'b', 'đ']),
          pictureEx(DE_GOAT.emoji, 'dê', ['dê', 'đê', 'bê']),
          findEx('đ', 'đò', ['dò', 'bò', 'cò', 'đò']),
          toneEx(DE_CRICKET.emoji, 'dế', ['hoi', 'sac', 'huyen', 'nang']),
          listenEx('đỏ', ['đò', 'đó', 'đỏ', 'đọ']),
          findEx('d', 'dế', ['đế', 'dế', 'bế']),
          toneEx(DO_BOAT.emoji, 'đò', ['huyen', 'ngang', 'hoi', 'nang']),
          // Hàng âm đầu không có c, vì hàng vần có e, ê (chưa học k)
          buildEx(DE_GOAT.emoji, 'dê', ['b', 'd', 'đ'], ['a', 'e', 'ê', 'o'], ['ngang', 'huyen', 'sac', 'hoi']),
        ],
      },
      {
        number: 9,
        slug: 'tv1-bai-09',
        title: 'Ơ ơ, dấu ngã',
        mark: 'Ơơ',
        description: 'Học chữ ơ và dấu ngã, đánh vần bơ, cờ',
        teaches: { units: ['ơ'], tones: ['nga'] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu đều có âm ơ.',
            scene(['👩', '👧', BO_AVOCADO.emoji], 'Bé theo mẹ đi chợ mua bơ.', ['chợ', 'bơ']),
          ),
          intro('Chữ ơ là chữ o thêm râu. Bé bấm vào chữ để nghe.', letter('ơ')),
          intro(
            'Bé đánh vần: bờ, ơ, bơ. Cờ, ơ, cơ, huyền, cờ.',
            { kind: 'spell', steps: [...spell('b', 'ơ', 'ngang'), ...spell('c', 'ơ', 'huyen')] },
          ),
          intro(
            'Dấu ngã trông như làn sóng nhỏ. Dê thêm dấu ngã thành dễ, đơ thêm dấu ngã thành đỡ.',
            { kind: 'spell', steps: [toneStep('d', 'ê', 'nga'), toneStep('đ', 'ơ', 'nga')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [CO_FLAG, BO_AVOCADO] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Bé có cờ đỏ.', highlight: ['cờ'] }),
        ],
        exercises: [
          listenEx('ơ', ['ô', 'ơ', 'o']),
          pictureEx(BO_AVOCADO.emoji, 'bơ', ['bò', 'bố', 'bơ']),
          findEx('ơ', 'cờ', ['cờ', 'cô', 'cò', 'cá']),
          toneEx(CO_FLAG.emoji, 'cờ', ['nga', 'hoi', 'sac', 'huyen']),
          listenEx('đỗ', ['độ', 'đỗ', 'đồ', 'đố']),
          findEx('ơ', 'đỡ', ['đỡ', 'đỗ', 'dễ', 'bò']),
          toneEx(BO_AVOCADO.emoji, 'bơ', ['hoi', 'nang', 'ngang', 'nga']),
          buildEx(CO_FLAG.emoji, 'cờ', ['b', 'c', 'đ'], ['a', 'o', 'ô', 'ơ'], ['ngang', 'huyen', 'hoi', 'nga']),
        ],
      },
      {
        number: 10,
        slug: 'tv1-bai-10',
        title: 'Ôn tập',
        mark: 'Ôn',
        description: 'Ôn lại chữ o, ô, d, đ, ơ và dấu hỏi, dấu nặng, dấu ngã',
        teaches: { units: [], tones: [] },
        intro: [
          intro(
            'Bé đã học thêm năm chữ: o, ô, d, đ, ơ. Bé bấm để nghe lại.',
            { kind: 'letter', letters: ['o', 'ô', 'd', 'đ', 'ơ'], say: ['o', 'ô', 'd', 'đ', 'ơ'].map(sayOf).join(', ') },
          ),
          intro(
            'Bé nhớ lại ba dấu mới: dấu hỏi, dấu nặng, dấu ngã.',
            { kind: 'spell', steps: [toneStep('c', 'o', 'hoi'), toneStep('c', 'o', 'nang'), toneStep('d', 'ê', 'nga')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [BO_COW, O_UMBRELLA, DE_GOAT, CO_FLAG] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Bờ đê có bò, có dê.', highlight: [] }),
        ],
        exercises: [
          listenEx('d', ['b', 'đ', 'd']),
          pictureEx(DO_BOAT.emoji, 'đò', ['đò', 'đỏ', 'dò', 'đồ']),
          findEx('ô', 'cỗ', ['cờ', 'cỗ', 'cỏ']),
          toneEx(CO_GRASS.emoji, 'cỏ', ['nang', 'nga', 'sac', 'hoi']),
          listenEx('dễ', ['dễ', 'dê', 'dế']),
          pictureEx(DE_CRICKET.emoji, 'dế', ['dê', 'đế', 'dế', 'bế']),
          findEx('d', 'dỗ', ['đỏ', 'dỗ', 'bơ']),
          buildEx(BO_AVOCADO.emoji, 'bơ', ['b', 'c', 'd', 'đ'], ['o', 'ô', 'ơ'], ['ngang', 'huyen', 'sac', 'nga']),
        ],
      },
    ],
  },
  {
    number: 3,
    title: 'Âm và chữ: i, k, h, l, u, ư, ch, kh',
    lessons: [
      {
        number: 11,
        slug: 'tv1-bai-11',
        title: 'I i, K k',
        mark: 'Ik',
        description: 'Học chữ i, k, đánh vần bí, kì',
        teaches: { units: ['i', 'k'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có chữ i hoặc chữ k.',
            scene(['👧', '📏', '📒'], 'Bé kẻ ô li thật kĩ.', ['kẻ', 'li', 'kĩ']),
          ),
          intro('Chữ i có một chấm nhỏ ở trên. Bé bấm vào chữ để nghe.', letter('i')),
          intro('Chữ k đọc là ca. Chữ k chỉ đứng trước i, e, ê. Bé bấm vào chữ để nghe.', letter('k')),
          intro(
            'Bé đánh vần: bờ, i, bi, sắc, bí. Ca, i, ki, huyền, kì.',
            { kind: 'spell', steps: [...spell('b', 'i', 'sac'), ...spell('k', 'i', 'huyen')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [BI_PUMPKIN, KI_DA_LIZARD] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Kì đà bò ở bờ đê.', highlight: ['kì'] }),
        ],
        exercises: [
          listenEx('i', ['e', 'i', 'ê', 'a']),
          // Lựa chọn sai không có tiếng mở đầu bằng c, vì c và k cùng đọc là "cờ" khi ghép
          findEx('k', 'kẻ', ['bé', 'đỏ', 'kẻ']),
          listenEx('kể', ['kể', 'kẻ', 'kệ']),
          toneEx(BI_PUMPKIN.emoji, 'bí', ['huyen', 'nang', 'sac', 'hoi']),
          findEx('i', 'dì', ['dì', 'dê', 'đò', 'bố']),
          pictureEx(DE_GOAT.emoji, 'dê', ['dì', 'dê', 'đi']),
          // 🎃 dùng cho cả câu dấu thanh và câu ghép tiếng vì rất ít tranh rõ nghĩa cho tiếng có i chỉ dùng chữ đã học.
          // Có cả mảnh c, k và các vần i, e (đi sau k), a, o (đi sau c) để bé luyện chính tả c/k
          buildEx(BI_PUMPKIN.emoji, 'bí', ['b', 'c', 'd', 'k'], ['a', 'e', 'i', 'o'], ['ngang', 'huyen', 'sac', 'hoi']),
        ],
      },
      {
        number: 12,
        slug: 'tv1-bai-12',
        title: 'H h, L l',
        mark: 'Hl',
        description: 'Học chữ h, l, đánh vần hổ, lá',
        teaches: { units: ['h', 'l'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có âm h hoặc âm l.',
            scene(['👧', '👵', '🍂'], 'Bé cùng bà ra hồ, lá vàng rơi lả tả.', ['hồ', 'lá', 'lả']),
          ),
          intro('Chữ h đọc là hờ. Bé bấm vào chữ để nghe.', letter('h')),
          intro('Chữ l đọc là lờ. Bé bấm vào chữ để nghe.', letter('l')),
          intro(
            'Bé đánh vần: hờ, ô, hô, hỏi, hổ. Lờ, a, la, sắc, lá.',
            { kind: 'spell', steps: [...spell('h', 'ô', 'hoi'), ...spell('l', 'a', 'sac')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [HO_TIGER, LA_LEAF, LE_PEAR, HE_CLOWN] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Dì Hà bổ lê.', highlight: ['hà', 'lê'] }),
        ],
        exercises: [
          listenEx('h', ['k', 'b', 'l', 'h']),
          pictureEx(HO_TIGER.emoji, 'hổ', ['hổ', 'hồ', 'lọ']),
          findEx('l', 'lò', ['bò', 'hồ', 'lò']),
          toneEx(LE_PEAR.emoji, 'lê', ['huyen', 'ngang', 'nga', 'sac']),
          listenEx('lọ', ['lò', 'lỗ', 'lọ', 'lo']),
          findEx('h', 'hè', ['hè', 'lê', 'bí', 'kẻ']),
          pictureEx(LA_LEAF.emoji, 'lá', ['lê', 'lá', 'đá']),
          buildEx(HE_CLOWN.emoji, 'hề', ['c', 'h', 'k', 'l'], ['a', 'e', 'ê', 'ô'], ['ngang', 'huyen', 'sac', 'hoi']),
        ],
      },
      {
        number: 13,
        slug: 'tv1-bai-13',
        title: 'U u, Ư ư',
        mark: 'Uư',
        description: 'Học chữ u, ư, đánh vần cú, dữ',
        teaches: { units: ['u', 'ư'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có âm u hoặc âm ư.',
            scene([CU_OWL.emoji, '👀', '👧'], 'Chú cú có đôi mắt to tròn, cứ nhìn bé mãi.', ['chú', 'cú', 'cứ']),
          ),
          intro('Đây là chữ u: U hoa và u thường. Bé bấm vào chữ để nghe.', letter('u')),
          intro('Chữ ư là chữ u thêm râu. Bé bấm vào chữ để nghe.', letter('ư')),
          intro(
            'Bé đánh vần: cờ, u, cu, sắc, cú. Dờ, ư, dư, ngã, dữ.',
            { kind: 'spell', steps: [...spell('c', 'u', 'sac'), ...spell('d', 'ư', 'nga')] },
          ),
          // Chưa có tranh rõ nghĩa cho một tiếng có ư, nên dùng cụm "hổ dữ"
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [CU_OWL, { emoji: '🐅', word: 'hổ dữ' }] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Bé đi đò, cụ cứ lo.', highlight: ['cụ', 'cứ'] }),
        ],
        exercises: [
          listenEx('ư', ['o', 'u', 'ơ', 'ư']),
          findEx('u', 'bú', ['bố', 'bú', 'bơ']),
          toneEx(CU_OWL.emoji, 'cú', ['sac', 'nga', 'nang', 'huyen']),
          listenEx('củ', ['cổ', 'cử', 'củ', 'cỏ']),
          pictureEx(HE_CLOWN.emoji, 'hề', ['hư', 'hề', 'hú']),
          findEx('ư', 'dữ', ['dữ', 'dễ', 'đỗ']),
          listenEx('u', ['ư', 'ô', 'u']),
          // 🦉 dùng cho cả câu dấu thanh và câu ghép tiếng vì gần như không có tranh rõ nghĩa cho tiếng có u, ư chỉ dùng chữ đã học
          buildEx(CU_OWL.emoji, 'cú', ['c', 'h', 'k', 'l'], ['i', 'ô', 'u', 'ư'], ['ngang', 'huyen', 'sac', 'nga']),
        ],
      },
      {
        number: 14,
        slug: 'tv1-bai-14',
        title: 'Ch ch, Kh kh',
        mark: 'Ch',
        description: 'Học chữ ch, kh, đánh vần chó, khỉ',
        teaches: { units: ['ch', 'kh'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có âm ch hoặc âm kh.',
            scene(
              [KHI_MONKEY.emoji, CHO_DOG.emoji, '😆'],
              'Chú khỉ con trêu chú chó, cả nhà cười khúc khích.',
              ['chú', 'khỉ', 'chó', 'khúc', 'khích'],
            ),
          ),
          intro('Chữ ch ghép từ c và h, đọc là chờ. Bé bấm vào chữ để nghe.', letter('ch')),
          intro('Chữ kh ghép từ k và h, đọc là khờ. Bé bấm vào chữ để nghe.', letter('kh')),
          intro(
            'Bé đánh vần: chờ, o, cho, sắc, chó. Khờ, i, khi, hỏi, khỉ.',
            { kind: 'spell', steps: [...spell('ch', 'o', 'sac'), ...spell('kh', 'i', 'hoi')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [CHO_DOG, KHI_MONKEY, CHI_THREAD] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Bà kho cá, chị đi chợ.', highlight: ['kho', 'chị', 'chợ'] }),
        ],
        exercises: [
          listenEx('kh', ['ch', 'h', 'kh', 'k']),
          pictureEx(CO_FLAG.emoji, 'cờ', ['cờ', 'chờ', 'khờ']),
          findEx('kh', 'khế', ['chè', 'khế', 'kê']),
          toneEx(KHI_MONKEY.emoji, 'khỉ', ['huyen', 'sac', 'hoi', 'nang']),
          listenEx('chị', ['khi', 'kì', 'chỉ', 'chị']),
          findEx('ch', 'chợ', ['chợ', 'khô', 'cờ', 'hồ']),
          pictureEx(CHI_THREAD.emoji, 'chỉ', ['khỉ', 'chì', 'chỉ']),
          buildEx(CHO_DOG.emoji, 'chó', ['c', 'ch', 'k', 'kh'], ['a', 'i', 'o', 'u'], ['ngang', 'huyen', 'sac', 'hoi']),
        ],
      },
      {
        number: 15,
        slug: 'tv1-bai-15',
        title: 'Ôn tập',
        mark: 'Ôn',
        description: 'Ôn lại chữ i, k, h, l, u, ư, ch, kh',
        teaches: { units: [], tones: [] },
        intro: [
          // Tám chữ chia hai thẻ theo thứ tự đã học, để chữ to không bị xuống quá nhiều dòng
          intro(
            'Bé đã học thêm tám chữ. Đây là bốn chữ đầu: i, k, h, l. Bé bấm để nghe lại.',
            { kind: 'letter', letters: ['i', 'k', 'h', 'l'], say: ['i', 'k', 'h', 'l'].map(sayOf).join(', ') },
          ),
          intro(
            'Còn đây là bốn chữ sau: u, ư, ch, kh. Bé bấm để nghe lại.',
            { kind: 'letter', letters: ['u', 'ư', 'ch', 'kh'], say: ['u', 'ư', 'ch', 'kh'].map(sayOf).join(', ') },
          ),
          intro(
            'Bé nhớ: k đứng trước i, e, ê, như kẻ. Còn c đứng trước a, o, ô, ơ, u, ư, như cú.',
            { kind: 'spell', steps: [...spell('k', 'e', 'hoi'), ...spell('c', 'u', 'sac')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [BI_PUMPKIN, LE_PEAR, CU_OWL, KHI_MONKEY] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Chú khỉ đi chợ. Chợ có lê, có bí.', highlight: [] }),
        ],
        exercises: [
          listenEx('kì', ['khi', 'chì', 'kì', 'dì']),
          pictureEx(CU_OWL.emoji, 'cú', ['cú', 'cụ', 'củ']),
          findEx('kh', 'khô', ['chó', 'hồ', 'khô']),
          toneEx(HO_TIGER.emoji, 'hổ', ['nang', 'hoi', 'huyen', 'sac']),
          listenEx('đủ', ['đỏ', 'đi', 'đu', 'đủ']),
          findEx('k', 'kể', ['chè', 'kể', 'lá', 'hồ']),
          toneEx(CHI_THREAD.emoji, 'chỉ', ['hoi', 'huyen', 'sac', 'nang']),
          buildEx(LA_LEAF.emoji, 'lá', ['ch', 'h', 'kh', 'l'], ['a', 'ê', 'u', 'ư'], ['ngang', 'sac', 'hoi', 'nga']),
        ],
      },
    ],
  },
  {
    number: 4,
    title: 'Âm và chữ: m, n, g, gi, gh, nh, ng, ngh',
    lessons: [
      {
        number: 16,
        slug: 'tv1-bai-16',
        title: 'M m, N n',
        mark: 'Mn',
        description: 'Học chữ m, n, đánh vần mũ, nơ',
        teaches: { units: ['m', 'n'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có âm m hoặc âm n.',
            scene(['👩', '👧', NO_BOW.emoji], 'Mẹ mua cho Na cái nơ màu đỏ.', ['mẹ', 'mua', 'na', 'nơ', 'màu']),
          ),
          intro('Chữ m đọc là mờ. Bé bấm vào chữ để nghe.', letter('m')),
          intro('Chữ n đọc là nờ. Chữ m có ba chân, chữ n chỉ có hai chân. Bé bấm vào chữ để nghe.', letter('n')),
          intro(
            'Bé đánh vần: mờ, u, mu, ngã, mũ. Nờ, ơ, nơ.',
            { kind: 'spell', steps: [...spell('m', 'u', 'nga'), ...spell('n', 'ơ', 'ngang')] },
          ),
          intro(
            'Bé đọc từng từ, rồi bấm vào tranh để nghe lại.',
            { kind: 'pictures', items: [ME_MOTHER, MU_CAP, NO_BOW, { emoji: '🚤', word: 'ca nô' }] },
          ),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Bố mẹ cho Na đi ca nô.', highlight: ['mẹ', 'na', 'nô'] }),
        ],
        exercises: [
          listenEx('m', ['n', 'm', 'h']),
          findEx('m', 'mì', ['na', 'lê', 'mì']),
          pictureEx(NO_BOW.emoji, 'nơ', ['nơ', 'mơ', 'nở']),
          listenEx('nở', ['mở', 'lở', 'nở']),
          // Không đặt dấu hỏi cạnh dấu ngã: "mủ" và "mũ" đều là từ, dễ lẫn khi nghe
          toneEx(MU_CAP.emoji, 'mũ', ['nga', 'huyen', 'sac', 'nang']),
          findEx('n', 'no', ['lo', 'no', 'mỏ']),
          buildEx(ME_MOTHER.emoji, 'mẹ', ['b', 'l', 'm', 'n'], ['a', 'e', 'ê', 'o'], ['ngang', 'huyen', 'sac', 'nang']),
        ],
      },
      {
        number: 17,
        slug: 'tv1-bai-17',
        title: 'G g, Gi gi',
        mark: 'Gg',
        description: 'Học chữ g, gi, đánh vần gà, giỏ',
        teaches: { units: ['g', 'gi'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có âm g hoặc âm gi.',
            scene(['👵', GIO_BASKET.emoji, GA_CHICKEN.emoji], 'Gió thổi nhè nhẹ, bà xách giỏ thóc ra cho gà ăn.', ['gió', 'giỏ', 'gà']),
          ),
          intro('Chữ g đọc là gờ. Bé bấm vào chữ để nghe.', letter('g')),
          intro('Chữ gi ghép từ g và i, đọc là di. Bé bấm vào chữ để nghe.', letter('gi')),
          intro(
            'Bé đánh vần: gờ, a, ga, huyền, gà. Di, o, gio, hỏi, giỏ.',
            { kind: 'spell', steps: [...spell('g', 'a', 'huyen'), ...spell('gi', 'o', 'hoi')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [GA_CHICKEN, GIO_BASKET, GO_WOOD] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Gà mổ cỏ. Bé giữ giỏ cho bà.', highlight: ['gà', 'giữ', 'giỏ'] }),
        ],
        exercises: [
          listenEx('g', ['h', 'gi', 'k', 'g']),
          pictureEx(GO_WOOD.emoji, 'gỗ', ['gò', 'gỗ', 'giỏ']),
          findEx('gi', 'gió', ['gà', 'hồ', 'gió']),
          listenEx('gi', ['gi', 'd', 'g']),
          // Không đặt dấu ngã cạnh dấu hỏi: "gã" và "gả" đều là từ, dễ lẫn khi nghe
          toneEx(GA_CHICKEN.emoji, 'gà', ['sac', 'huyen', 'ngang', 'hoi']),
          findEx('g', 'gõ', ['gõ', 'chó', 'lọ', 'đỗ']),
          listenEx('giờ', ['gờ', 'gì', 'giờ']),
          // Hàng vần chỉ có vần đi sau g (chưa học gh), để không ghép ra "ge", "gê"
          buildEx(GIO_BASKET.emoji, 'giỏ', ['c', 'g', 'gi', 'l'], ['a', 'o', 'ô', 'u'], ['ngang', 'huyen', 'sac', 'hoi']),
        ],
      },
      {
        number: 18,
        slug: 'tv1-bai-18',
        title: 'Gh gh, Nh nh',
        mark: 'Gh',
        description: 'Học chữ gh, nh, đánh vần ghế, nhà',
        teaches: { units: ['gh', 'nh'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có chữ gh hoặc chữ nh.',
            scene(['👧', NHA_HOUSE.emoji, NHO_GRAPES.emoji], 'Bé ghé nhà bà, bà mời bé ăn nho.', ['ghé', 'nhà', 'nho']),
          ),
          intro('Chữ gh ghép từ g và h, đọc là gờ kép. Chữ gh chỉ đứng trước i, e, ê. Bé bấm vào chữ để nghe.', letter('gh')),
          intro('Chữ nh ghép từ n và h, đọc là nhờ. Bé bấm vào chữ để nghe.', letter('nh')),
          intro(
            'Bé đánh vần: gờ kép, ê, ghê, sắc, ghế. Nhờ, a, nha, huyền, nhà.',
            { kind: 'spell', steps: [...spell('gh', 'ê', 'sac'), ...spell('nh', 'a', 'huyen')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [GHE_CHAIR, NHA_HOUSE, NHO_GRAPES] }),
          intro(
            'Bé tự đọc câu này, rồi bấm loa để nghe lại.',
            { kind: 'sentence', text: 'Nhà bà có ghế gỗ, có giỏ nho.', highlight: ['nhà', 'ghế', 'nho'] },
          ),
        ],
        exercises: [
          listenEx('nh', ['ch', 'n', 'nh', 'kh']),
          findEx('gh', 'ghé', ['gà', 'ghé', 'giỏ']),
          pictureEx(NHA_HOUSE.emoji, 'nhà', ['nhè', 'nhớ', 'nhà']),
          listenEx('gh', ['gh', 'g', 'h']),
          findEx('nh', 'nhỏ', ['nơ', 'chó', 'hổ', 'nhỏ']),
          toneEx(NHO_GRAPES.emoji, 'nho', ['ngang', 'huyen', 'sac', 'nang']),
          listenEx('ghi', ['khi', 'ghi', 'gì']),
          // Có cả g, gh và vần đi sau g (a, o), vần đi sau gh (ê, i) để bé luyện chính tả g/gh
          buildEx(GHE_CHAIR.emoji, 'ghế', ['g', 'gh', 'gi', 'nh'], ['a', 'ê', 'i', 'o'], ['ngang', 'huyen', 'sac', 'hoi']),
        ],
      },
      {
        number: 19,
        slug: 'tv1-bai-19',
        title: 'Ng ng, Ngh ngh',
        mark: 'Ng',
        description: 'Học chữ ng, ngh, đánh vần ngô, nghé',
        teaches: { units: ['ng', 'ngh'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có chữ ng hoặc chữ ngh.',
            scene(['👵', '👧', '📖'], 'Bé ngồi nghỉ ở đầu ngõ, nghe bà kể chuyện.', ['ngồi', 'nghỉ', 'ngõ', 'nghe']),
          ),
          intro('Chữ ng ghép từ n và g, đọc là ngờ. Bé bấm vào chữ để nghe.', letter('ng')),
          intro('Chữ ngh ghép từ n, g và h, đọc là ngờ kép. Chữ ngh chỉ đứng trước i, e, ê. Bé bấm vào chữ để nghe.', letter('ngh')),
          intro(
            'Bé đánh vần: ngờ, ô, ngô. Ngờ kép, e, nghe, sắc, nghé.',
            { kind: 'spell', steps: [...spell('ng', 'ô', 'ngang'), ...spell('ngh', 'e', 'sac')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [NGO_CORN, NGU_SLEEP, NGHI_THINK] }),
          intro(
            'Bé tự đọc câu này, rồi bấm loa để nghe lại.',
            { kind: 'sentence', text: 'Bà ngủ, bé đi nhè nhẹ cho bà nghỉ.', highlight: ['ngủ', 'nghỉ'] },
          ),
        ],
        exercises: [
          listenEx('ng', ['n', 'ng', 'nh', 'ngh']),
          pictureEx(NGU_SLEEP.emoji, 'ngủ', ['nghé', 'ngã', 'ngủ']),
          findEx('ngh', 'nghe', ['nghe', 'ngô', 'ghế']),
          // Không đặt dấu hỏi cạnh dấu ngã: "nghỉ" và "nghĩ" đều là từ, dễ lẫn khi nghe
          toneEx(NGHI_THINK.emoji, 'nghĩ', ['sac', 'nang', 'nga', 'huyen']),
          findEx('ng', 'ngõ', ['nhà', 'ngõ', 'nơ']),
          listenEx('nghỉ', ['khỉ', 'chỉ', 'nhì', 'nghỉ']),
          // Có cả ng, ngh và vần đi sau ng (a, ô), vần đi sau ngh (e, i) để bé luyện chính tả ng/ngh.
          // Hàng vần không có u để bé không ghép ra tiếng không hay
          buildEx(NGO_CORN.emoji, 'ngô', ['g', 'ng', 'ngh', 'nh'], ['a', 'e', 'i', 'ô'], ['ngang', 'huyen', 'sac', 'nga']),
        ],
      },
      {
        number: 20,
        slug: 'tv1-bai-20',
        title: 'Ôn tập',
        mark: 'Ôn',
        description: 'Ôn lại chữ m, n, g, gi, gh, nh, ng, ngh',
        teaches: { units: [], tones: [] },
        intro: [
          // Tám chữ chia hai thẻ theo thứ tự đã học, như bài 15
          intro(
            'Bé đã học thêm tám chữ. Đây là bốn chữ đầu: m, n, g, gi. Bé bấm để nghe lại.',
            { kind: 'letter', letters: ['m', 'n', 'g', 'gi'], say: ['m', 'n', 'g', 'gi'].map(sayOf).join(', ') },
          ),
          intro(
            'Còn đây là bốn chữ sau: gh, nh, ng, ngh. Bé bấm để nghe lại.',
            { kind: 'letter', letters: ['gh', 'nh', 'ng', 'ngh'], say: ['gh', 'nh', 'ng', 'ngh'].map(sayOf).join(', ') },
          ),
          intro(
            'Bé nhớ: gh chỉ đứng trước i, e, ê, như ghi. Còn g đứng trước a, o, ô, ơ, u, ư, như gõ.',
            { kind: 'spell', steps: [...spell('gh', 'i', 'ngang'), ...spell('g', 'o', 'nga')] },
          ),
          intro(
            'Ngh cũng chỉ đứng trước i, e, ê, như nghỉ. Còn ng đứng trước a, o, ô, ơ, u, ư, như ngõ.',
            { kind: 'spell', steps: [...spell('ngh', 'i', 'hoi'), ...spell('ng', 'o', 'nga')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [MU_CAP, GIO_BASKET, NHO_GRAPES, NGO_CORN] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Bé nghỉ hè ở nhà bà. Nhà bà có gà, có ngô.', highlight: [] }),
        ],
        // Tranh đã có ở bài 16–19 chỉ dùng lại ở dạng câu khác: 🪑 (ghép → chọn chữ), 🌽 (ghép → dấu thanh),
        // 🧢 (dấu thanh → chọn chữ), 🐔 (dấu thanh → ghép)
        exercises: [
          listenEx('nhớ', ['nhờ', 'chớ', 'nhớ', 'nở']),
          findEx('n', 'nụ', ['nụ', 'mè', 'lá']),
          pictureEx(GHE_CHAIR.emoji, 'ghế', ['khế', 'ghế', 'ghé']),
          findEx('gi', 'giữ', ['gỗ', 'chữ', 'hồ', 'giữ']),
          toneEx(NGO_CORN.emoji, 'ngô', ['ngang', 'nang', 'huyen', 'hoi']),
          pictureEx(MU_CAP.emoji, 'mũ', ['nơ', 'mẹ', 'mũ']),
          listenEx('nghe', ['nghe', 'ghe', 'khe']),
          // Có cả g, gh, ng, ngh với vần trước và sau (a, o / e, i) để luyện chính tả g/gh, ng/ngh
          buildEx(GA_CHICKEN.emoji, 'gà', ['g', 'gh', 'ng', 'ngh'], ['a', 'e', 'i', 'o'], ['ngang', 'huyen', 'sac', 'hoi']),
        ],
      },
    ],
  },
  {
    number: 5,
    title: 'Âm và chữ: r, s, t, tr, th, ia, ua, ưa',
    lessons: [
      {
        number: 21,
        slug: 'tv1-bai-21',
        title: 'R r, S s',
        mark: 'Rs',
        description: 'Học chữ r, s, đánh vần rổ, sổ',
        teaches: { units: ['r', 's'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có âm r hoặc âm s.',
            scene(['🌅', '👧', '🌱'], 'Sáng sớm, bé theo bà ra vườn tưới rau.', ['sáng', 'sớm', 'ra', 'rau']),
          ),
          intro('Chữ r đọc là rờ. Bé bấm vào chữ để nghe.', letter('r')),
          intro('Chữ s đọc là sờ. Bé bấm vào chữ để nghe.', letter('s')),
          intro(
            'Bé đánh vần: rờ, ô, rô, hỏi, rổ. Sờ, ô, sô, hỏi, sổ.',
            { kind: 'spell', steps: [...spell('r', 'ô', 'hoi'), ...spell('s', 'ô', 'hoi')] },
          ),
          // Cá rô dùng chung tranh cá; có chữ bên dưới nên chỉ dùng ở thẻ Từ ngữ.
          // Không dùng 🧺 cho "rổ" vì bài 17 đã gọi tranh này là "giỏ"
          intro(
            'Bé đọc từng từ, rồi bấm vào tranh để nghe lại.',
            { kind: 'pictures', items: [{ emoji: CA_FISH.emoji, word: 'cá rô' }, SO_NOTEBOOK, SO_SCARED] },
          ),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Bé rủ bà ra bờ hồ. Hồ có cá rô.', highlight: ['rủ', 'ra', 'rô'] }),
        ],
        exercises: [
          // Câu nghe không đặt r cạnh d, gi (nhiều vùng đọc giống nhau)
          listenEx('r', ['l', 'h', 'r']),
          findEx('s', 'sờ', ['nhờ', 'sờ', 'chờ']),
          pictureEx(SO_NOTEBOOK.emoji, 'sổ', ['sổ', 'rổ', 'số']),
          listenEx('rá', ['lá', 'rá', 'há']),
          // Không có dấu ngã cạnh dấu hỏi; "sở", "sờ" là từ nhưng không chỉ tranh
          toneEx(SO_SCARED.emoji, 'sợ', ['hoi', 'sac', 'nang', 'huyen']),
          findEx('r', 'rễ', ['rễ', 'chỗ', 'lễ']),
          listenEx('s', ['ch', 's', 'kh']),
          // Chim sẻ: loa đọc "sẻ" nên bé không phải tự gọi tên tranh
          buildEx('🐦', 'sẻ', ['ch', 'nh', 'r', 's'], ['a', 'e', 'ê', 'o'], ['ngang', 'huyen', 'sac', 'hoi']),
        ],
      },
      {
        number: 22,
        slug: 'tv1-bai-22',
        title: 'T t, Tr tr',
        mark: 'Tt',
        description: 'Học chữ t, tr, đánh vần tô, tre',
        teaches: { units: ['t', 'tr'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có âm t hoặc âm tr.',
            scene(['👦', O_TO_CAR.emoji, SU_TU_LION.emoji], 'Trưa nay, bé ngồi trên ô tô đi xem sư tử.', ['trưa', 'trên', 'tô', 'tử']),
          ),
          intro('Chữ t đọc là tờ. Bé bấm vào chữ để nghe.', letter('t')),
          intro('Chữ tr ghép từ t và r, đọc là trờ. Bé bấm vào chữ để nghe.', letter('tr')),
          intro(
            'Bé đánh vần: tờ, ô, tô. Trờ, e, tre.',
            { kind: 'spell', steps: [...spell('t', 'ô', 'ngang'), ...spell('tr', 'e', 'ngang')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [O_TO_CAR, SU_TU_LION, TRA_TEA, TRE_BAMBOO] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Ở nhà trẻ, cô cho bé tô chữ.', highlight: ['trẻ', 'tô'] }),
        ],
        exercises: [
          listenEx('t', ['đ', 't', 'h']),
          pictureEx(O_TO_CAR.emoji, 'ô tô', ['ca nô', 'đò', 'ô tô']),
          // Lựa chọn sai có t hoặc r nhưng không có tr, để bé nhìn đủ hai chữ
          findEx('tr', 'trẻ', ['chẻ', 'tê', 'trẻ', 'rẻ']),
          // Dấu trừ bé đã gặp ở môn Toán; chỉ "trừ" là từ có nghĩa
          toneEx('➖', 'trừ', ['sac', 'huyen', 'nang', 'hoi']),
          // Câu nghe không đặt tr cạnh ch (nhiều vùng đọc giống nhau)
          listenEx('tr', ['t', 'r', 'th', 'tr']),
          // Lựa chọn sai không có tr, th vì các chữ này cũng chứa t
          findEx('t', 'tủ', ['tủ', 'củ', 'đủ']),
          // Không có "tô" trong lựa chọn vì chén trà trông giống cái tô
          pictureEx(TRA_TEA.emoji, 'trà', ['tre', 'trà', 'trê']),
          // Hàng âm đầu không có ch: giọng đọc miền Bắc đọc tr giống ch, nghe "tre" bé có thể ghép ra "che"
          buildEx(TRE_BAMBOO.emoji, 'tre', ['h', 'r', 't', 'tr'], ['a', 'e', 'ê', 'ô'], ['ngang', 'huyen', 'sac', 'hoi']),
        ],
      },
      {
        number: 23,
        slug: 'tv1-bai-23',
        title: 'Th th, ia',
        mark: 'Th',
        description: 'Học chữ th và ia, đánh vần thỏ, mía',
        teaches: { units: ['th', 'ia'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có âm th hoặc âm ia.',
            scene(['👧', THO_RABBIT.emoji, '🥕'], 'Kìa, thỏ con đang chia cà rốt cho các bạn.', ['kìa', 'thỏ', 'chia']),
          ),
          intro('Chữ th ghép từ t và h, đọc là thờ. Bé bấm vào chữ để nghe.', letter('th')),
          intro('Ia gồm chữ i đứng trước, chữ a đứng sau. Bé bấm vào để nghe.', letter('ia')),
          intro(
            'Bé đánh vần: thờ, o, tho, hỏi, thỏ. Mờ, ia, mia, sắc, mía. Dấu sắc đặt trên chữ i.',
            { kind: 'spell', steps: [...spell('th', 'o', 'hoi'), ...spell('m', 'ia', 'sac')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [THO_RABBIT, THIA_SPOON, DIA_DISC] }),
          intro(
            'Bé tự đọc câu này, rồi bấm loa để nghe lại.',
            { kind: 'sentence', text: 'Mẹ cho bé đĩa mía, bé chia cho bà.', highlight: ['đĩa', 'mía', 'chia'] },
          ),
        ],
        exercises: [
          listenEx('th', ['t', 'th', 'kh', 'tr']),
          // Lựa chọn sai có i hoặc a nhưng không có ia
          findEx('ia', 'mía', ['mì', 'má', 'mía']),
          // Không có dấu sắc ("thó" là tiếng lóng) và dấu ngã
          toneEx(THO_RABBIT.emoji, 'thỏ', ['nang', 'huyen', 'hoi', 'ngang']),
          pictureEx(DIA_DISC.emoji, 'đĩa', ['đĩa', 'đá', 'đồ']),
          listenEx('chia', ['cha', 'chia', 'chi']),
          findEx('th', 'thợ', ['thợ', 'tờ', 'hồ']),
          listenEx('kìa', ['kì', 'kia', 'kìa']),
          // Ghép cả âm mới th và vần mới ia. Hàng âm đầu không có đ để không ghép ra tiếng không hay với vần i
          buildEx(THIA_SPOON.emoji, 'thìa', ['ch', 't', 'th', 'tr'], ['a', 'i', 'ia', 'ơ'], ['ngang', 'huyen', 'sac', 'nga']),
        ],
      },
      {
        number: 24,
        slug: 'tv1-bai-24',
        title: 'ua, ưa',
        mark: 'ua',
        description: 'Học ua, ưa, đánh vần cua, dừa',
        teaches: { units: ['ua', 'ưa'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có âm ua hoặc âm ưa.',
            scene(['👧', RUA_TURTLE.emoji, CUA_CRAB.emoji], 'Trưa hè, bé ra biển, thấy rùa và cua bò trên cát.', ['trưa', 'rùa', 'cua']),
          ),
          intro('Ua gồm chữ u đứng trước, chữ a đứng sau. Bé bấm vào để nghe.', letter('ua')),
          intro('Ưa giống ua, chỉ khác ở chữ ư có râu. Bé bấm vào để nghe.', letter('ưa')),
          intro(
            'Bé đánh vần: cờ, ua, cua. Dờ, ưa, dưa, huyền, dừa. Dấu huyền đặt trên chữ ư.',
            { kind: 'spell', steps: [...spell('c', 'ua', 'ngang'), ...spell('d', 'ưa', 'huyen')] },
          ),
          intro(
            'Bé đọc từng từ, rồi bấm vào tranh để nghe lại.',
            { kind: 'pictures', items: [CUA_CRAB, RUA_TURTLE, DUA_COCONUT, { emoji: '🥛', word: 'sữa' }] },
          ),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Mẹ đi chợ mua cua, mua dừa.', highlight: ['mua', 'cua', 'dừa'] }),
        ],
        exercises: [
          listenEx('mưa', ['mua', 'ma', 'mưa']),
          pictureEx(RUA_TURTLE.emoji, 'rùa', ['cua', 'rùa', 'dừa']),
          // "cửa" và "của" chỉ khác ở chữ ư và u
          findEx('ưa', 'cửa', ['cửa', 'của', 'cá']),
          toneEx(DUA_COCONUT.emoji, 'dừa', ['sac', 'huyen', 'hoi', 'nang']),
          // Có cả c, k và vần đi sau c (ua, ưa, a), vần đi sau k (ia) để bé luyện chính tả c/k
          buildEx(CUA_CRAB.emoji, 'cua', ['c', 'ch', 'k', 'tr'], ['a', 'ia', 'ua', 'ưa'], ['ngang', 'huyen', 'sac', 'hoi']),
          listenEx('lửa', ['lúa', 'lửa', 'lá']),
          findEx('ua', 'múa', ['mũ', 'mía', 'múa']),
          // Có cả ng, ngh và vần đi sau ng (ua, ưa, a), vần đi sau ngh (ia) để bé luyện chính tả ng/ngh
          buildEx('🐴', 'ngựa', ['g', 'ng', 'ngh', 'nh'], ['a', 'ia', 'ua', 'ưa'], ['ngang', 'sac', 'hoi', 'nang']),
        ],
      },
      {
        number: 25,
        slug: 'tv1-bai-25',
        title: 'Ôn tập',
        mark: 'Ôn',
        description: 'Ôn lại chữ r, s, t, tr, th và ia, ua, ưa',
        teaches: { units: [], tones: [] },
        intro: [
          // Tám mục chia hai thẻ theo thứ tự đã học, như bài 15 và 20
          intro(
            'Bé đã học thêm r, s, t, tr, th và ia, ua, ưa. Đây là bốn chữ đầu: r, s, t, tr. Bé bấm để nghe lại.',
            { kind: 'letter', letters: ['r', 's', 't', 'tr'], say: ['r', 's', 't', 'tr'].map(sayOf).join(', ') },
          ),
          intro(
            'Còn đây là th, ia, ua, ưa. Bé bấm để nghe lại.',
            { kind: 'letter', letters: ['th', 'ia', 'ua', 'ưa'], say: ['th', 'ia', 'ua', 'ưa'].map(sayOf).join(', ') },
          ),
          intro(
            'Bé nhớ: với ia, ua, ưa, dấu thanh đặt trên chữ đầu, như mía, rùa, sữa.',
            { kind: 'spell', steps: [toneStep('m', 'ia', 'sac'), toneStep('r', 'ua', 'huyen'), toneStep('s', 'ưa', 'nga')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [O_TO_CAR, THO_RABBIT, CUA_CRAB, DUA_COCONUT] }),
          intro(
            'Bé tự đọc câu này, rồi bấm loa để nghe lại.',
            { kind: 'sentence', text: 'Bố mẹ cho bé đi sở thú. Sở thú có sư tử, có thỏ, có rùa.', highlight: [] },
          ),
        ],
        // Tranh đã có ở bài 21–24 chỉ dùng lại ở dạng câu khác: 🐢 (chọn chữ → dấu thanh), 🦁 (thẻ Từ ngữ → chọn chữ)
        exercises: [
          // t, th, tr chỉ khác nhau ở âm đầu
          listenEx('thả', ['tả', 'thả', 'trả']),
          pictureEx('🥢', 'đũa', ['đĩa', 'dừa', 'đũa']),
          findEx('s', 'số', ['số', 'tổ', 'chỗ', 'rổ']),
          toneEx(RUA_TURTLE.emoji, 'rùa', ['sac', 'nang', 'nga', 'huyen']),
          findEx('tr', 'trưa', ['thưa', 'tủ', 'trưa']),
          listenEx('chìa', ['chìa', 'chùa', 'chừa']),
          pictureEx(SU_TU_LION.emoji, 'sư tử', ['ô tô', 'sư tử', 'thỏ']),
          // "cửa" và "của" chỉ khác ở vần ưa và ua; c, k để bé luyện chính tả c/k
          buildEx('🚪', 'cửa', ['c', 'k', 'r', 'th'], ['a', 'ia', 'ua', 'ưa'], ['ngang', 'huyen', 'sac', 'hoi']),
        ],
      },
    ],
  },
  {
    number: 6,
    title: 'Âm và chữ: ph, qu, v, x, y',
    lessons: [
      {
        number: 26,
        slug: 'tv1-bai-26',
        title: 'Ph ph, Qu qu',
        mark: 'Ph',
        description: 'Học chữ ph, qu, đánh vần phở, quà',
        teaches: { units: ['ph', 'qu'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có âm ph hoặc âm qu.',
            scene(['👧', QUA_GIFT.emoji, PHO_NOODLE.emoji], 'Bé về quê, mang quà cho bà, rồi cả nhà đi ăn phở.', ['quê', 'quà', 'phở']),
          ),
          intro('Chữ ph ghép từ p và h, đọc là phờ. Bé bấm vào chữ để nghe.', letter('ph')),
          intro('Chữ qu ghép từ q và u, đọc là quờ. Bé bấm vào chữ để nghe.', letter('qu')),
          intro(
            'Bé đánh vần: phờ, ơ, phơ, hỏi, phở. Quờ, a, qua, huyền, quà.',
            { kind: 'spell', steps: [...spell('ph', 'ơ', 'hoi'), ...spell('qu', 'a', 'huyen')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [PHO_NOODLE, QUA_GIFT] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Bố đưa bé ra phố, mua quà cho bà.', highlight: ['phố', 'quà'] }),
        ],
        exercises: [
          listenEx('ph', ['th', 'ph', 'kh']),
          // Không có "trà" trong lựa chọn vì cốc ☕ cũng có thể là trà
          pictureEx('☕', 'cà phê', ['cà phê', 'ca nô', 'cá rô']),
          // Lựa chọn sai mở đầu bằng k, c: cùng đọc gần giống qu, bé phải nhìn đủ hai chữ q, u
          findEx('qu', 'quả', ['kể', 'cổ', 'quả']),
          // Không có dấu ngã cạnh dấu hỏi; "phố", "phờ" là từ nhưng không chỉ tranh
          toneEx(PHO_NOODLE.emoji, 'phở', ['hoi', 'sac', 'nang', 'huyen']),
          listenEx('quê', ['kê', 'quê', 'phê']),
          findEx('ph', 'phố', ['bố', 'hồ', 'phố']),
          // Có cả c, k, qu và vần đi sau c (a, ơ), vần đi sau k (e, ê) để bé phân biệt ba cách viết.
          // Hàng vần không có o để không ghép ra tiếng không hay với ph
          buildEx(QUA_GIFT.emoji, 'quà', ['c', 'k', 'ph', 'qu'], ['a', 'e', 'ê', 'ơ'], ['ngang', 'huyen', 'sac', 'nang']),
        ],
      },
      {
        number: 27,
        slug: 'tv1-bai-27',
        title: 'V v, X x',
        mark: 'Vx',
        description: 'Học chữ v, x, đánh vần vẽ, xe',
        teaches: { units: ['v', 'x'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có âm v hoặc âm x.',
            scene(['👦', '🎨', '🐘'], 'Bé vẽ voi, vẽ xe, vẽ cả vườn hoa xinh xinh.', ['vẽ', 'voi', 'xe', 'vườn', 'xinh']),
          ),
          intro('Chữ v đọc là vờ. Bé bấm vào chữ để nghe.', letter('v')),
          intro('Chữ x đọc là xờ. Bé bấm vào chữ để nghe.', letter('x')),
          intro(
            'Bé đánh vần: vờ, e, ve, ngã, vẽ. Xờ, e, xe.',
            { kind: 'spell', steps: [...spell('v', 'e', 'nga'), ...spell('x', 'e', 'ngang')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [VI_WALLET, VA_LI_SUITCASE, XE_BIKE] }),
          intro('Bé tự đọc câu này, rồi bấm loa để nghe lại.', { kind: 'sentence', text: 'Nghỉ hè, cả nhà đi xe về quê.', highlight: ['xe', 'về'] }),
        ],
        exercises: [
          // Câu nghe không đặt v cạnh d, gi và x cạnh s (nhiều vùng đọc giống nhau)
          listenEx('v', ['b', 'v', 'x']),
          pictureEx(VI_WALLET.emoji, 'ví', ['ví', 'vé', 'vì']),
          // Câu tìm có chữ để nhìn, nên được đặt s cạnh x
          findEx('x', 'xô', ['sổ', 'hồ', 'xô']),
          // Không có dấu hỏi cạnh dấu ngã: "vẻ" và "vẽ" đều là từ; "vé" là từ nhưng không chỉ tranh
          toneEx('🎨', 'vẽ', ['sac', 'nga', 'nang', 'huyen']),
          listenEx('xe', ['che', 've', 'xe']),
          findEx('v', 'vở', ['vở', 'bơ', 'đỡ']),
          pictureEx(VA_LI_SUITCASE.emoji, 'va li', ['ca nô', 'va li', 'cà phê']),
          // Hàng âm đầu không có s (đọc giống x) và d, gi (miền Nam đọc giống v)
          buildEx(XE_BIKE.emoji, 'xe', ['ch', 'kh', 'v', 'x'], ['a', 'e', 'i', 'o'], ['ngang', 'huyen', 'sac', 'hoi']),
        ],
      },
      {
        number: 28,
        slug: 'tv1-bai-28',
        title: 'Y y',
        mark: 'Yy',
        description: 'Học chữ y, đánh vần quý, ý',
        teaches: { units: ['y'], tones: [] },
        intro: [
          intro(
            'Bé bấm nghe câu. Các tiếng tô màu có chữ y.',
            scene(['🏥', '👩', '👧'], 'Cô y tá dặn bé: chú ý ăn ngủ đủ giờ nhé.', ['y', 'ý']),
          ),
          intro('Chữ y đọc là i dài. Bé bấm vào chữ để nghe.', letter('y')),
          intro(
            'Bé đánh vần: quờ, i dài, quy, sắc, quý. Y thêm dấu sắc thành ý.',
            { kind: 'spell', steps: [...spell('qu', 'y', 'sac'), toneStep('', 'y', 'sac')] },
          ),
          // Chỉ một tranh: các tiếng có y rất ít tranh rõ nghĩa, và "đá quý" quá dài cho lưới hai cột của thẻ nhiều tranh
          intro('Bé đọc từ này, rồi bấm vào tranh để nghe lại.', { kind: 'picture', emoji: DA_QUY_GEM.emoji, word: DA_QUY_GEM.word }),
          intro(
            'Bé tự đọc câu này, rồi bấm loa để nghe lại.',
            { kind: 'sentence', text: 'Bà bị ho, cô y tá ghé nhà. Bé quý cô y tá.', highlight: ['y', 'quý'] },
          ),
        ],
        exercises: [
          // Không có i trong lựa chọn: y và i đọc giống nhau
          listenEx('y', ['y', 'u', 'v']),
          // Lựa chọn sai có i (đọc giống y), để bé nhìn đúng chữ y
          findEx('y', 'ý', ['kí', 'ý', 'lí']),
          // Tranh đá quý đã có ở thẻ Từ ngữ. "Quỳ", "quỷ" là từ nhưng không chỉ tranh
          toneEx(DA_QUY_GEM.emoji, 'quý', ['huyen', 'hoi', 'sac', 'ngang']),
          listenEx('quý', ['quế', 'quý', 'quá']),
          findEx('y', 'quỳ', ['quỳ', 'quà', 'quê']),
          // Hàng vần không có i: "quì" đọc giống "quỳ". Hàng âm đầu không có k để không ghép ra "kỳ"
          buildEx(QUY_KNEEL.emoji, 'quỳ', ['c', 'ch', 'qu', 'th'], ['a', 'ê', 'o', 'y'], ['ngang', 'huyen', 'sac', 'nang']),
        ],
      },
      {
        number: 29,
        slug: 'tv1-bai-29',
        title: 'Luyện tập chính tả',
        mark: 'Ck',
        description: 'Luyện viết đúng c hay k, g hay gh, ng hay ngh',
        teaches: { units: [], tones: [] },
        intro: [
          intro(
            'Bé nhớ: k đứng trước i, e, ê, như kì đà. C đứng trước a, o, ô, ơ, u, ư, như cá.',
            { kind: 'pictures', items: [KI_DA_LIZARD, CA_FISH] },
          ),
          intro(
            'Gh đứng trước i, e, ê, như ghế. G đứng trước a, o, ô, ơ, u, ư, như gà.',
            { kind: 'pictures', items: [GHE_CHAIR, GA_CHICKEN] },
          ),
          intro(
            'Ngh đứng trước i, e, ê, như nghĩ. Ng đứng trước a, o, ô, ơ, u, ư, như ngô.',
            { kind: 'pictures', items: [NGHI_THINK, NGO_CORN] },
          ),
        ],
        // Mỗi quy tắc hai câu, một câu viết k/gh/ngh và một câu viết c/g/ng.
        // 🪑 và 🤔 đã có ở bài 18–20 nhưng là tranh rõ nghĩa duy nhất cho gh, ngh; ở đây bé luyện cách viết
        exercises: [
          // Thước kẻ: bé chỉ chọn cách viết, hai lựa chọn cùng đọc là "kẻ"
          spellingEx({ emoji: '📏', word: 'kẻ' }, 0),
          spellingEx({ emoji: '🍅', word: 'cà chua' }, 1),
          spellingEx(GHE_CHAIR, 1),
          // Gà trống, khác tranh gà 🐔 của các bài trước
          spellingEx({ emoji: '🐓', word: 'gà' }, 0),
          spellingEx(NGHI_THINK, 0),
          spellingEx({ emoji: '🐎', word: 'ngựa' }, 1),
        ],
      },
      {
        number: 30,
        slug: 'tv1-bai-30',
        title: 'Ôn tập',
        mark: 'Ôn',
        description: 'Ôn lại chữ ph, qu, v, x, y và cách viết c, k, g, gh, ng, ngh',
        teaches: { units: [], tones: [] },
        intro: [
          intro(
            'Bé đã học thêm năm chữ: ph, qu, v, x, y. Bé bấm để nghe lại.',
            { kind: 'letter', letters: ['ph', 'qu', 'v', 'x', 'y'], say: ['ph', 'qu', 'v', 'x', 'y'].map(sayOf).join(', ') },
          ),
          intro(
            'Bé đánh vần lại: phờ, ô, phô, sắc, phố. Vờ, e, ve, sắc, vé.',
            { kind: 'spell', steps: [...spell('ph', 'ô', 'sac'), ...spell('v', 'e', 'sac')] },
          ),
          intro('Bé đọc từng từ, rồi bấm vào tranh để nghe lại.', { kind: 'pictures', items: [QUA_GIFT, VI_WALLET, XE_BIKE, QUY_KNEEL] }),
          intro(
            'Bé tự đọc câu này, rồi bấm loa để nghe lại.',
            { kind: 'sentence', text: 'Bố đi xe chở bé ra phố. Bé mua quà về cho bà, vì bé quý bà.', highlight: [] },
          ),
        ],
        // Tranh đã có ở bài 27–28 chỉ dùng lại ở dạng câu khác: 🚲 (ghép → dấu thanh), 💎 (dấu thanh → ghép)
        exercises: [
          listenEx('x', ['kh', 'x', 'v']),
          pictureEx('🎫', 'vé', ['vé', 'xe', 'vẽ']),
          findEx('ph', 'phà', ['hà', 'bà', 'phà']),
          // Không có dấu ngã; "xé", "xẻ" là từ nhưng không chỉ tranh
          toneEx(XE_BIKE.emoji, 'xe', ['hoi', 'sac', 'huyen', 'ngang']),
          listenEx('quả', ['quả', 'tả', 'cả']),
          // Hàng vần không có i ("quì" đọc giống "quý") và o (để không ghép ra tiếng không hay với ph)
          buildEx(DA_QUY_GEM.emoji, 'quý', ['ph', 'qu', 'th', 'x'], ['a', 'e', 'ơ', 'y'], ['ngang', 'huyen', 'sac', 'nang']),
          // Không có i trong lựa chọn: "í" đọc giống "ý"
          listenEx('ý', ['ế', 'ý', 'á']),
          // Một câu chính tả của bài 29, với tranh cá mới
          spellingEx({ emoji: '🐠', word: 'cá' }, 1),
        ],
      },
    ],
  },
]
