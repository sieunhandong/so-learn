// Nội dung Toán lớp 1 theo các mạch kiến thức của chương trình GDPT 2018.
// Đây là nguồn duy nhất: scripts/build-seed.mjs đọc file này để sinh supabase/seed.sql.
// Chỉ dùng `import type` để Node chạy được file này trực tiếp (--experimental-strip-types).
import type { ChapterSeed, ExerciseSeed, LessonIntro, QuestionVisual } from '../types/math'

// ---------- Hàm tạo bài tập ----------

/** Bốn đáp án số liền nhau quanh đáp án đúng, không âm, xếp tăng dần */
function numberOptions(answer: number, suffix = ''): string[] {
  const picked = [answer]
  for (const d of [-1, 1, 2, -2, 3, -3, 4]) {
    const n = answer + d
    if (n >= 0 && !picked.includes(n)) picked.push(n)
    if (picked.length === 4) break
  }
  return picked.sort((a, b) => a - b).map(n => `${n}${suffix}`)
}

function ex(prompt: string, visual: QuestionVisual, answer: string, options: string[], explain: string, difficulty: 1 | 2 | 3 = 1): ExerciseSeed {
  if (!options.includes(answer)) throw new Error(`Đáp án "${answer}" không có trong lựa chọn của câu: ${prompt}`)
  return { prompt, visual, options, answer, explain, difficulty }
}

function intro(text: string, visual: QuestionVisual): LessonIntro {
  return { text, visual }
}

const itemName = { apple: 'quả táo', stick: 'que tính', dot: 'chấm tròn' } as const

function countEx(item: 'apple' | 'stick' | 'dot', count: number, difficulty: 1 | 2 | 3 = 1): ExerciseSeed {
  const name = itemName[item]
  return ex(
    `Có mấy ${name}?`,
    { kind: 'count', item, count },
    String(count),
    numberOptions(count),
    count === 0 ? `Không có ${name} nào, ta viết số 0.` : `Em đếm lần lượt từng ${name}: có ${count} ${name}.`,
    difficulty,
  )
}

function sign(a: number, b: number): '>' | '<' | '=' {
  return a > b ? '>' : a < b ? '<' : '='
}

const signWord = { '>': 'lớn hơn', '<': 'bé hơn', '=': 'bằng' } as const

function compareSignEx(a: number, b: number, visual: QuestionVisual, difficulty: 1 | 2 | 3 = 1): ExerciseSeed {
  const s = sign(a, b)
  return ex(`Chọn dấu đúng: ${a} ? ${b}`, visual, s, ['>', '<', '='], `${a} ${signWord[s]} ${b}, nên ta viết ${a} ${s} ${b}.`, difficulty)
}

function moreLessEx(item: 'apple' | 'stick' | 'dot', left: number, right: number): ExerciseSeed {
  const answer = left > right ? 'Bên trái' : left < right ? 'Bên phải' : 'Bằng nhau'
  const explain =
    left === right
      ? `Hai bên đều có ${left} ${itemName[item]}, nên bằng nhau.`
      : `Bên trái có ${left}, bên phải có ${right}. ${answer} nhiều hơn.`
  return ex(`Bên nào có nhiều ${itemName[item]} hơn?`, { kind: 'compare-groups', item, left, right }, answer, ['Bên trái', 'Bên phải', 'Bằng nhau'], explain)
}

function splitEx(item: 'apple' | 'stick' | 'dot', total: number, first: number, difficulty: 1 | 2 | 3 = 1): ExerciseSeed {
  const rest = total - first
  return ex(
    `${total} gồm ${first} và mấy?`,
    { kind: 'split', item, total, first },
    String(rest),
    numberOptions(rest),
    `${total} gồm ${first} và ${rest}, vì ${first} + ${rest} = ${total}.`,
    difficulty,
  )
}

function addEx(item: 'apple' | 'stick' | 'dot', a: number, b: number, difficulty: 1 | 2 | 3 = 1): ExerciseSeed {
  return ex(`Tính: ${a} + ${b} = ?`, { kind: 'add', item, groups: [a, b] }, String(a + b), numberOptions(a + b), `Gộp ${a} và ${b} được ${a + b}: ${a} + ${b} = ${a + b}.`, difficulty)
}

function subEx(item: 'apple' | 'stick' | 'dot', a: number, b: number, difficulty: 1 | 2 | 3 = 1): ExerciseSeed {
  return ex(`Tính: ${a} − ${b} = ?`, { kind: 'take-away', item, total: a, remove: b }, String(a - b), numberOptions(a - b), `Có ${a}, gạch bớt ${b}, còn lại ${a - b}: ${a} − ${b} = ${a - b}.`, difficulty)
}

function tensOnesEx(value: number): ExerciseSeed {
  const t = Math.floor(value / 10)
  const o = value % 10
  return ex(`Có ${t} bó chục và ${o} que lẻ. Đó là số nào?`, { kind: 'tens-ones', value }, String(value), numberOptions(value), `${t} chục và ${o} đơn vị là ${value}.`, 2)
}

function tensOnesReadEx(value: number): ExerciseSeed {
  const t = Math.floor(value / 10)
  const o = value % 10
  const answer = `${t} chục ${o} đơn vị`
  const options = [answer, `${o} chục ${t} đơn vị`, `${t + 1} chục ${o} đơn vị`, `${t} chục ${o + 1} đơn vị`]
  return ex(`Số ${value} gồm mấy chục và mấy đơn vị?`, { kind: 'tens-ones', value }, answer, options, `${value} có chữ số ${t} ở hàng chục và ${o} ở hàng đơn vị.`, 2)
}

function tensCalcEx(a: number, b: number, op: '+' | '-'): ExerciseSeed {
  const result = op === '+' ? a + b : a - b
  const shown = op === '+' ? '+' : '−'
  const how =
    op === '+'
      ? `Cộng đơn vị với đơn vị, chục với chục: ${a} + ${b} = ${result}.`
      : `Trừ đơn vị cho đơn vị, chục cho chục: ${a} − ${b} = ${result}.`
  return ex(`Tính: ${a} ${shown} ${b} = ?`, { kind: 'tens-calc', a, b, op }, String(result), numberOptions(result), how, 2)
}

function rowEx(numbers: number[], hideIndex: number, difficulty: 1 | 2 | 3 = 1): ExerciseSeed {
  const answer = numbers[hideIndex]
  const shown = numbers.map((n, i) => (i === hideIndex ? null : n))
  const step = numbers[1] - numbers[0]
  return ex(
    'Số nào còn thiếu trong ô trống?',
    { kind: 'number-row', numbers: shown },
    String(answer),
    numberOptions(answer),
    step === 1 ? `Các số tăng dần thêm 1, ô trống là ${answer}.` : `Các số tăng dần thêm ${step}, ô trống là ${answer}.`,
    difficulty,
  )
}

/** Bốn lựa chọn giờ quanh đáp án, vòng trong khoảng 1 đến 12 trên mặt đồng hồ */
function hourOptions(hour: number): string[] {
  const wrap = (n: number) => ((n - 1 + 12) % 12) + 1
  return [...new Set([hour, wrap(hour - 1), wrap(hour + 1), wrap(hour + 2)])].sort((a, b) => a - b).map(n => `${n} giờ`)
}

function clockEx(hour: number): ExerciseSeed {
  return ex('Đồng hồ chỉ mấy giờ?', { kind: 'clock', hour }, `${hour} giờ`, hourOptions(hour), `Kim ngắn chỉ số ${hour}, kim dài chỉ số 12: ${hour} giờ đúng.`)
}

const weekdays = ['thứ Hai', 'thứ Ba', 'thứ Tư', 'thứ Năm', 'thứ Sáu', 'thứ Bảy', 'Chủ nhật']

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function tomorrowEx(today: number): ExerciseSeed {
  const next = (today + 1) % 7
  const options = [weekdays[next], weekdays[(today + 2) % 7], weekdays[(today + 6) % 7], weekdays[today]].map(capitalize)
  return ex(`Hôm nay là ${weekdays[today]}. Ngày mai là thứ mấy?`, { kind: 'week', highlight: today }, capitalize(weekdays[next]), options, `Ngay sau ${weekdays[today]} là ${weekdays[next]}.`, 2)
}

function yesterdayEx(today: number): ExerciseSeed {
  const prev = (today + 6) % 7
  const options = [weekdays[prev], weekdays[(today + 1) % 7], weekdays[(today + 5) % 7], weekdays[today]].map(capitalize)
  return ex(`Hôm nay là ${weekdays[today]}. Hôm qua là thứ mấy?`, { kind: 'week', highlight: today }, capitalize(weekdays[prev]), options, `Ngay trước ${weekdays[today]} là ${weekdays[prev]}.`, 2)
}

const shapeName = { square: 'Hình vuông', circle: 'Hình tròn', triangle: 'Hình tam giác', rectangle: 'Hình chữ nhật' } as const
const shapeOptions = ['Hình vuông', 'Hình tròn', 'Hình tam giác', 'Hình chữ nhật']

function shapeNameEx(shape: 'square' | 'circle' | 'triangle' | 'rectangle'): ExerciseSeed {
  return ex('Đây là hình gì?', { kind: 'shapes', shapes: [shape] }, shapeName[shape], shapeOptions, `Đây là ${shapeName[shape].toLowerCase()}.`)
}

function shapeCountEx(shapes: ('square' | 'circle' | 'triangle' | 'rectangle')[], target: 'square' | 'circle' | 'triangle' | 'rectangle'): ExerciseSeed {
  const n = shapes.filter(s => s === target).length
  const name = shapeName[target].toLowerCase()
  return ex(`Có mấy ${name}?`, { kind: 'shapes', shapes }, String(n), numberOptions(n), `Em tìm và đếm từng ${name}: có ${n} ${name}.`, 2)
}

const placeAnswer = { above: 'Ở trên', below: 'Ở dưới', left: 'Bên trái', right: 'Bên phải', between: 'Ở giữa' } as const

function positionEx(place: 'above' | 'below' | 'left' | 'right' | 'between'): ExerciseSeed {
  const prompt = place === 'between' ? 'Quả bóng ở đâu so với hai cái hộp?' : 'Quả bóng ở đâu so với cái hộp?'
  const options = place === 'between' ? ['Ở giữa', 'Bên trái', 'Bên phải', 'Ở trên'] : ['Ở trên', 'Ở dưới', 'Bên trái', 'Bên phải']
  const explain =
    place === 'between' ? 'Quả bóng nằm giữa hai cái hộp.' : `Nhìn từ phía em, quả bóng ${placeAnswer[place].toLowerCase()} cái hộp.`
  return ex(prompt, { kind: 'position', place }, placeAnswer[place], options, explain)
}

function longerEx(a: number, b: number): ExerciseSeed {
  const answer = a > b ? 'Bút chì trên' : a < b ? 'Bút chì dưới' : 'Dài bằng nhau'
  return ex(
    'Bút chì nào dài hơn?',
    { kind: 'length', a, b },
    answer,
    ['Bút chì trên', 'Bút chì dưới', 'Dài bằng nhau'],
    a === b ? 'Hai đầu bút chì thẳng hàng nhau, nên dài bằng nhau.' : `Đặt thẳng một đầu, ${answer.toLowerCase()} thò ra xa hơn nên dài hơn.`,
  )
}

function shorterEx(a: number, b: number): ExerciseSeed {
  const answer = a < b ? 'Bút chì trên' : 'Bút chì dưới'
  return ex('Bút chì nào ngắn hơn?', { kind: 'length', a, b }, answer, ['Bút chì trên', 'Bút chì dưới', 'Dài bằng nhau'], `${answer} kết thúc sớm hơn nên ngắn hơn.`)
}

function rulerEx(length: number): ExerciseSeed {
  return ex('Bút chì dài mấy xăng-ti-mét?', { kind: 'ruler', length }, `${length} cm`, numberOptions(length).filter(o => o !== '0').map(o => `${o} cm`).slice(0, 4), `Một đầu bút ở vạch 0, đầu kia ở vạch ${length}: bút dài ${length} cm.`, 2)
}

// ---------- Chương trình ----------

export const grade1Chapters: ChapterSeed[] = [
  {
    number: 1,
    title: 'Các số từ 0 đến 10',
    lessons: [
      {
        slug: 'cac-so-0-den-5',
        title: 'Các số 0, 1, 2, 3, 4, 5',
        mark: '0–5',
        description: 'Đếm đồ vật và nhận biết các số từ 0 đến 5',
        intro: [
          intro('Đếm từng quả táo, mỗi lần đếm chạm vào một quả. Số cuối cùng em đọc là số quả táo.', { kind: 'count', item: 'apple', count: 3 }),
          intro('Không có quả nào thì ta viết số 0.', { kind: 'count', item: 'apple', count: 0 }),
        ],
        exercises: [countEx('apple', 2), countEx('apple', 4), countEx('dot', 5), countEx('stick', 1), countEx('apple', 3), countEx('dot', 0, 2)],
      },
      {
        slug: 'cac-so-6-den-10',
        title: 'Các số 6, 7, 8, 9, 10',
        mark: '6–10',
        description: 'Đếm đến 10 và biết thứ tự các số',
        intro: [
          intro('Đếm tiếp sau số 5: sáu, bảy, tám, chín, mười.', { kind: 'count', item: 'dot', count: 7 }),
          intro('Các số xếp theo thứ tự, số sau hơn số trước 1 đơn vị.', { kind: 'number-row', numbers: [6, 7, 8, 9, 10] }),
        ],
        exercises: [
          countEx('dot', 6),
          countEx('stick', 8),
          countEx('apple', 7),
          countEx('dot', 10, 2),
          countEx('stick', 9, 2),
          rowEx([5, 6, 7, 8, 9], 2),
          rowEx([6, 7, 8, 9, 10], 4, 2),
        ],
      },
      {
        slug: 'nhieu-hon-it-hon',
        title: 'Nhiều hơn, ít hơn, bằng nhau',
        mark: 'hơn',
        description: 'So sánh số lượng hai nhóm đồ vật',
        intro: [
          intro('Ghép từng quả bên trái với một quả bên phải. Bên nào còn thừa thì bên đó nhiều hơn.', { kind: 'compare-groups', item: 'apple', left: 4, right: 2 }),
          intro('Ghép vừa hết, không bên nào thừa, thì hai bên bằng nhau.', { kind: 'compare-groups', item: 'dot', left: 3, right: 3 }),
        ],
        exercises: [moreLessEx('apple', 5, 3), moreLessEx('dot', 2, 4), moreLessEx('stick', 3, 3), moreLessEx('apple', 1, 4), moreLessEx('dot', 6, 5), moreLessEx('stick', 7, 7)],
      },
      {
        slug: 'so-sanh-so',
        title: 'So sánh số: dấu >, <, =',
        mark: '>',
        description: 'Dùng dấu lớn hơn, bé hơn, bằng',
        intro: [
          intro('3 quả nhiều hơn 2 quả, ta nói 3 lớn hơn 2 và viết 3 > 2. Đầu nhọn của dấu chỉ về số bé hơn.', { kind: 'compare-groups', item: 'apple', left: 3, right: 2 }),
          intro('Hai nhóm bằng nhau thì dùng dấu =.', { kind: 'compare-groups', item: 'dot', left: 4, right: 4 }),
        ],
        exercises: [
          compareSignEx(4, 6, { kind: 'compare-groups', item: 'dot', left: 4, right: 6 }),
          compareSignEx(5, 2, { kind: 'compare-groups', item: 'apple', left: 5, right: 2 }),
          compareSignEx(3, 3, { kind: 'compare-groups', item: 'stick', left: 3, right: 3 }),
          compareSignEx(7, 9, { kind: 'compare-groups', item: 'dot', left: 7, right: 9 }, 2),
          compareSignEx(10, 8, { kind: 'compare-groups', item: 'stick', left: 10, right: 8 }, 2),
          compareSignEx(0, 1, { kind: 'compare-groups', item: 'apple', left: 0, right: 1 }, 2),
          compareSignEx(6, 6, { kind: 'compare-groups', item: 'dot', left: 6, right: 6 }),
        ],
      },
      {
        slug: 'may-va-may',
        title: 'Mấy và mấy',
        mark: '5=2+3',
        description: 'Tách một số thành hai phần',
        intro: [
          intro('5 chấm gồm 2 chấm tím và 3 chấm vàng. Ta nói: 5 gồm 2 và 3.', { kind: 'split', item: 'dot', total: 5, first: 2 }),
          intro('Cùng số 5 còn tách được cách khác: 5 gồm 4 và 1.', { kind: 'split', item: 'dot', total: 5, first: 4 }),
        ],
        exercises: [
          splitEx('dot', 4, 1),
          splitEx('dot', 5, 3),
          splitEx('apple', 6, 2),
          splitEx('dot', 7, 4),
          splitEx('stick', 8, 5, 2),
          splitEx('dot', 9, 6, 2),
          splitEx('dot', 10, 3, 2),
        ],
      },
    ],
  },
  {
    number: 2,
    title: 'Làm quen với một số hình',
    lessons: [
      {
        slug: 'hinh-phang',
        title: 'Hình vuông, hình tròn, hình tam giác, hình chữ nhật',
        mark: '△',
        description: 'Nhận biết bốn hình phẳng quen thuộc',
        intro: [
          intro('Hình vuông có 4 cạnh dài bằng nhau. Hình chữ nhật có 4 cạnh, hai cạnh dài và hai cạnh ngắn.', { kind: 'shapes', shapes: ['square', 'rectangle'] }),
          intro('Hình tam giác có 3 cạnh. Hình tròn không có cạnh thẳng nào.', { kind: 'shapes', shapes: ['triangle', 'circle'] }),
        ],
        exercises: [
          shapeNameEx('circle'),
          shapeNameEx('triangle'),
          shapeNameEx('square'),
          shapeNameEx('rectangle'),
          shapeCountEx(['circle', 'square', 'circle', 'triangle', 'circle'], 'circle'),
          shapeCountEx(['triangle', 'rectangle', 'triangle', 'square', 'triangle', 'triangle'], 'triangle'),
          shapeCountEx(['square', 'rectangle', 'square', 'circle', 'rectangle'], 'rectangle'),
        ],
      },
      {
        slug: 'khoi-lap-phuong-khoi-hop',
        title: 'Khối lập phương, khối hộp chữ nhật',
        mark: '▣',
        description: 'Nhận biết hai loại khối',
        intro: [
          intro('Khối lập phương có các mặt đều là hình vuông, giống viên xúc xắc.', { kind: 'solids', solids: ['cube'] }),
          intro('Khối hộp chữ nhật dài hơn, giống hộp bút hay viên gạch.', { kind: 'solids', solids: ['box'] }),
        ],
        exercises: [
          ex('Đây là khối gì?', { kind: 'solids', solids: ['cube'] }, 'Khối lập phương', ['Khối lập phương', 'Khối hộp chữ nhật'], 'Các mặt đều là hình vuông: khối lập phương.'),
          ex('Đây là khối gì?', { kind: 'solids', solids: ['box'] }, 'Khối hộp chữ nhật', ['Khối lập phương', 'Khối hộp chữ nhật'], 'Khối dài, có mặt hình chữ nhật: khối hộp chữ nhật.'),
          ex('Có mấy khối lập phương?', { kind: 'solids', solids: ['cube', 'box', 'cube', 'cube'] }, '3', numberOptions(3), 'Em đếm các khối có mặt vuông: có 3 khối lập phương.', 2),
          ex('Có mấy khối hộp chữ nhật?', { kind: 'solids', solids: ['box', 'cube', 'box'] }, '2', numberOptions(2), 'Em đếm các khối dài: có 2 khối hộp chữ nhật.', 2),
          ex('Có tất cả mấy khối?', { kind: 'solids', solids: ['cube', 'box', 'cube', 'box', 'cube'] }, '5', numberOptions(5), 'Đếm hết các khối: có 5 khối.'),
        ],
      },
      {
        slug: 'vi-tri',
        title: 'Vị trí: trên, dưới, trái, phải, ở giữa',
        mark: '↕',
        description: 'Nói được vị trí của đồ vật',
        intro: [
          intro('Quả bóng nằm trên nắp hộp: quả bóng ở trên cái hộp.', { kind: 'position', place: 'above' }),
          intro('Trái và phải tính theo tay của em khi nhìn vào hình.', { kind: 'position', place: 'left' }),
        ],
        exercises: [positionEx('above'), positionEx('below'), positionEx('left'), positionEx('right'), positionEx('between')],
      },
    ],
  },
  {
    number: 3,
    title: 'Phép cộng, phép trừ trong phạm vi 10',
    lessons: [
      {
        slug: 'phep-cong-trong-10',
        title: 'Phép cộng trong phạm vi 10',
        mark: '+',
        description: 'Gộp hai nhóm, đếm tất cả',
        intro: [
          intro('Có 3 quả, thêm 2 quả. Gộp lại được 5 quả: 3 + 2 = 5.', { kind: 'add', item: 'apple', groups: [3, 2] }),
          intro('Đổi chỗ hai số, kết quả không đổi: 2 + 3 cũng bằng 5.', { kind: 'add', item: 'dot', groups: [2, 3] }),
        ],
        exercises: [addEx('apple', 2, 3), addEx('dot', 4, 1), addEx('apple', 3, 3), addEx('dot', 5, 4, 2), addEx('stick', 6, 2), addEx('dot', 7, 3, 2), addEx('apple', 0, 5), addEx('dot', 4, 4)],
      },
      {
        slug: 'phep-tru-trong-10',
        title: 'Phép trừ trong phạm vi 10',
        mark: '−',
        description: 'Bớt đi, đếm phần còn lại',
        intro: [
          intro('Có 5 que, bớt 2 que. Gạch đi 2 que, còn lại 3 que: 5 − 2 = 3.', { kind: 'take-away', item: 'stick', total: 5, remove: 2 }),
          intro('Bớt hết thì còn 0: 4 − 4 = 0.', { kind: 'take-away', item: 'dot', total: 4, remove: 4 }),
        ],
        exercises: [subEx('stick', 5, 2), subEx('apple', 7, 3), subEx('stick', 9, 4, 2), subEx('dot', 6, 6), subEx('apple', 8, 1), subEx('stick', 10, 3, 2), subEx('dot', 6, 2)],
      },
      {
        slug: 'luyen-tap-cong-tru-10',
        title: 'Luyện tập cộng, trừ trong phạm vi 10',
        mark: '±',
        description: 'Ôn cộng, trừ và tìm số còn thiếu',
        intro: [
          intro('Cộng và trừ là hai phép ngược nhau: 3 + 4 = 7 thì 7 − 4 = 3.', { kind: 'split', item: 'dot', total: 7, first: 3 }),
        ],
        exercises: [
          addEx('dot', 5, 5),
          subEx('stick', 8, 5),
          addEx('apple', 1, 8),
          subEx('dot', 10, 6, 2),
          ex('Số nào thêm vào 3 để được 7?', { kind: 'split', item: 'dot', total: 7, first: 3 }, '4', numberOptions(4), '3 + 4 = 7, nên số cần thêm là 4.', 3),
          ex('Số nào thêm vào 6 để được 9?', { kind: 'split', item: 'stick', total: 9, first: 6 }, '3', numberOptions(3), '6 + 3 = 9, nên số cần thêm là 3.', 3),
          addEx('stick', 2, 6),
          subEx('apple', 9, 7, 2),
        ],
      },
    ],
  },
  {
    number: 4,
    title: 'Các số trong phạm vi 100',
    lessons: [
      {
        slug: 'so-co-hai-chu-so',
        title: 'Số có hai chữ số: chục và đơn vị',
        mark: '10',
        description: 'Đọc, viết số bằng bó chục và que lẻ',
        intro: [
          intro('Mười que buộc lại thành một bó chục. 2 bó chục và 3 que lẻ là số 23.', { kind: 'tens-ones', value: 23 }),
          intro('Chữ số bên trái chỉ số chục, chữ số bên phải chỉ số đơn vị.', { kind: 'tens-ones', value: 41 }),
        ],
        exercises: [tensOnesEx(23), tensOnesEx(15), tensOnesEx(40), tensOnesReadEx(36), tensOnesReadEx(52), tensOnesEx(68), tensOnesReadEx(71)],
      },
      {
        slug: 'so-sanh-so-hai-chu-so',
        title: 'So sánh các số có hai chữ số',
        mark: '<',
        description: 'So số chục trước, rồi so số đơn vị',
        intro: [
          intro('So số bó chục trước. 3 bó nhiều hơn 2 bó, nên 31 > 28.', { kind: 'compare', left: 31, right: 28 }),
          intro('Số bó bằng nhau thì so que lẻ: 15 > 12.', { kind: 'compare', left: 15, right: 12 }),
        ],
        exercises: [
          compareSignEx(34, 43, { kind: 'compare', left: 34, right: 43 }, 2),
          compareSignEx(56, 52, { kind: 'compare', left: 56, right: 52 }, 2),
          compareSignEx(70, 69, { kind: 'compare', left: 70, right: 69 }, 2),
          compareSignEx(25, 25, { kind: 'compare', left: 25, right: 25 }, 2),
          compareSignEx(18, 81, { kind: 'compare', left: 18, right: 81 }, 3),
          compareSignEx(47, 74, { kind: 'compare', left: 47, right: 74 }, 3),
        ],
      },
      {
        slug: 'dem-den-100',
        title: 'Đếm đến 100',
        mark: '100',
        description: 'Đếm thêm 1 và đếm theo chục',
        intro: [
          intro('Đếm thêm 1: số đứng sau lớn hơn số đứng trước 1 đơn vị.', { kind: 'number-row', numbers: [46, 47, 48, 49, 50] }),
          intro('Đếm theo chục: mỗi lần thêm 1 bó, số tăng 10.', { kind: 'number-row', numbers: [60, 70, 80, 90, 100] }),
        ],
        exercises: [
          rowEx([21, 22, 23, 24, 25], 2),
          rowEx([37, 38, 39, 40, 41], 3, 2),
          rowEx([10, 20, 30, 40, 50], 3),
          rowEx([55, 56, 57, 58, 59], 0, 2),
          rowEx([96, 97, 98, 99, 100], 4, 2),
          rowEx([30, 40, 50, 60, 70], 1),
          rowEx([79, 80, 81, 82, 83], 1, 3),
        ],
      },
    ],
  },
  {
    number: 5,
    title: 'Độ dài và đo độ dài',
    lessons: [
      {
        slug: 'dai-hon-ngan-hon',
        title: 'Dài hơn, ngắn hơn',
        mark: '↔',
        description: 'So sánh độ dài hai đồ vật',
        intro: [intro('Đặt hai bút chì thẳng một đầu. Bút nào thò ra xa hơn thì dài hơn.', { kind: 'length', a: 7, b: 4 })],
        exercises: [longerEx(7, 4), longerEx(3, 6), longerEx(5, 5), shorterEx(8, 5), shorterEx(2, 6)],
      },
      {
        slug: 'do-do-dai-cm',
        title: 'Đo độ dài: xăng-ti-mét',
        mark: 'cm',
        description: 'Dùng thước đo theo đơn vị xăng-ti-mét',
        intro: [intro('Đặt một đầu bút chì đúng vạch 0. Đầu kia chỉ vạch số mấy thì bút dài bấy nhiêu xăng-ti-mét.', { kind: 'ruler', length: 6 })],
        exercises: [rulerEx(4), rulerEx(7), rulerEx(9), rulerEx(5), rulerEx(10), rulerEx(8)],
      },
    ],
  },
  {
    number: 6,
    title: 'Phép cộng, phép trừ (không nhớ) trong phạm vi 100',
    lessons: [
      {
        slug: 'cong-khong-nho-100',
        title: 'Phép cộng không nhớ trong phạm vi 100',
        mark: '+',
        description: 'Cộng chục với chục, đơn vị với đơn vị',
        intro: [intro('23 + 4: giữ nguyên 2 bó chục, cộng que lẻ 3 + 4 = 7. Vậy 23 + 4 = 27.', { kind: 'tens-calc', a: 23, b: 4, op: '+' })],
        exercises: [tensCalcEx(23, 4, '+'), tensCalcEx(30, 20, '+'), tensCalcEx(41, 15, '+'), tensCalcEx(52, 6, '+'), tensCalcEx(34, 23, '+'), tensCalcEx(60, 7, '+')],
      },
      {
        slug: 'tru-khong-nho-100',
        title: 'Phép trừ không nhớ trong phạm vi 100',
        mark: '−',
        description: 'Trừ chục cho chục, đơn vị cho đơn vị',
        intro: [intro('38 − 5: giữ nguyên 3 bó chục, bớt 5 que lẻ trong 8 que, còn 3. Vậy 38 − 5 = 33.', { kind: 'tens-calc', a: 38, b: 5, op: '-' })],
        exercises: [tensCalcEx(38, 5, '-'), tensCalcEx(50, 20, '-'), tensCalcEx(67, 24, '-'), tensCalcEx(49, 6, '-'), tensCalcEx(85, 31, '-'), tensCalcEx(76, 6, '-')],
      },
    ],
  },
  {
    number: 7,
    title: 'Thời gian: giờ và ngày trong tuần',
    lessons: [
      {
        slug: 'xem-gio-dung',
        title: 'Xem giờ đúng',
        mark: '7:00',
        description: 'Đọc giờ đúng trên đồng hồ kim',
        intro: [intro('Khi kim dài chỉ số 12, kim ngắn chỉ số mấy thì là mấy giờ đúng. Đồng hồ này chỉ 3 giờ.', { kind: 'clock', hour: 3 })],
        exercises: [clockEx(7), clockEx(9), clockEx(12), clockEx(2), clockEx(5), clockEx(10)],
      },
      {
        slug: 'ngay-trong-tuan',
        title: 'Các ngày trong tuần',
        mark: '7',
        description: 'Biết một tuần có 7 ngày và thứ tự các ngày',
        intro: [intro('Một tuần có 7 ngày: thứ Hai, thứ Ba, thứ Tư, thứ Năm, thứ Sáu, thứ Bảy, Chủ nhật.', { kind: 'week', highlight: -1 })],
        exercises: [
          ex('Một tuần có mấy ngày?', { kind: 'week', highlight: -1 }, '7', numberOptions(7), 'Đếm từ thứ Hai đến Chủ nhật: có 7 ngày.'),
          tomorrowEx(1),
          tomorrowEx(4),
          yesterdayEx(3),
          tomorrowEx(5),
          yesterdayEx(0),
        ],
      },
    ],
  },
]

/** Tất cả bài của lớp 1 theo thứ tự học */
export const grade1Lessons = grade1Chapters.flatMap(c => c.lessons)
