// Sinh supabase/seed.sql từ nội dung hai môn: src/content/grade1.ts (Toán) và src/content/tiengviet1.ts (Tiếng Việt).
// Chạy: npm run seed:build
// Seed dùng "on conflict ... do update", nên chạy lại nhiều lần không tạo trùng và không đổi id câu hỏi.
// Nội dung Tiếng Việt phải qua checkLessons (chữ đã học, chính tả, đáp án); có lỗi thì không ghi file.
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { grade1Chapters } from '../src/content/grade1.ts'
import { tiengViet1Chapters } from '../src/content/tiengviet1.ts'
import { checkLessons } from '../src/lib/tiengviet.ts'
import { buildSeed, toSql } from './seed-rows.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const problems = checkLessons(tiengViet1Chapters.flatMap(chapter => chapter.lessons))
if (problems.length > 0) {
  for (const problem of problems) console.error(problem)
  console.error(`Nội dung Tiếng Việt có ${problems.length} lỗi, chưa ghi seed.sql.`)
  process.exit(1)
}

const sources = [
  { subject: 'math', grade: 1, chapters: grade1Chapters },
  { subject: 'tieng-viet', grade: 1, chapters: tiengViet1Chapters },
]
const seed = buildSeed(sources)

const out = resolve(root, 'supabase/seed.sql')
await mkdir(dirname(out), { recursive: true })
await writeFile(out, toSql(seed), 'utf8')

// Số bài và số câu của từng môn
const count = subject => {
  const lessons = seed.topics.filter(t => t.subject === subject).length
  const questions = seed.exercises.filter(e => e.subject === subject).length
  return `${lessons} bài, ${questions} câu`
}
console.log(`Đã ghi ${out}`)
console.log(`Toán: ${count('math')}; Tiếng Việt: ${count('tieng-viet')}`)
