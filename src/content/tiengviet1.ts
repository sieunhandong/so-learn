// Nội dung Tiếng Việt lớp 1 (30 bài, mã tv1-bai-01 … tv1-bai-30), theo thứ tự bài của sách Kết nối tri thức.
// Câu chữ và bài tập tự soạn, không chép sách. Phần trẻ tự đọc chỉ dùng chữ và dấu đã học (spec 6.2, checkLessons).
// Đây là nguồn duy nhất: scripts/build-seed.mjs đọc file này để sinh supabase/seed.sql.
// Node chạy trực tiếp file này (--experimental-strip-types): import kiểu dùng `import type`, import lúc chạy có đuôi `.ts`.
import type {
  PictureWord, ReadingChapterSeed, ReadingExerciseSeed, ReadingIntro, ReadingVisual, SpellStep, Tone,
} from '../types/tiengviet'
import { composeSyllable, splitSyllable, stripTone, syllablesOf, toneLabel, toneOf, TONE_NAMES } from '../lib/tiengviet.ts'
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
  return choice(
    'Bé bấm loa, nghe rồi chọn chữ đúng.',
    { kind: 'listen', say: UNIT_SAY[answer] ?? answer },
    answer, options, `Đó là chữ ${answer}.`,
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
]
