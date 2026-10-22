// Sinh supabase/seed.sql từ nội dung trong src/content/grade1.ts.
// Chạy: npm run seed:build
// Seed dùng "on conflict ... do update", nên chạy lại nhiều lần không tạo trùng và không đổi id câu hỏi.
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const { grade1Chapters } = await import(pathToFileURL(resolve(root, 'src/content/grade1.ts')).href)

const text = value => `'${String(value).replaceAll("'", "''")}'`
const json = value => `${text(JSON.stringify(value))}::jsonb`

const topicRows = []
const exerciseRows = []
let position = 0

for (const chapter of grade1Chapters) {
  for (const lesson of chapter.lessons) {
    position += 1
    topicRows.push(
      `(${text(lesson.slug)}, 1, ${chapter.number}, ${text(chapter.title)}, ${position}, ${text(lesson.title)}, ${text(lesson.mark)}, ${text(lesson.description)}, ${json(lesson.intro)})`,
    )
    lesson.exercises.forEach((e, i) => {
      exerciseRows.push(
        `(${text(`${lesson.slug}-${i + 1}`)}, 1, ${text(lesson.slug)}, ${i + 1}, ${text(e.prompt)}, ${text(e.answer)}, ${json(e.options)}, 'multiple_choice', ${e.difficulty}, ${json(e.visual)}, ${text(e.explain)})`,
      )
    })
  }
}

const sql = `-- File này được sinh tự động bởi scripts/build-seed.mjs. Đừng sửa tay: sửa src/content/grade1.ts rồi chạy lại.
-- Chạy trong Supabase Dashboard > SQL Editor, sau file migrations.

insert into public.topics (id, grade, chapter_number, chapter_title, position, title, mark, description, intro) values
${topicRows.join(',\n')}
on conflict (id) do update set
  grade = excluded.grade,
  chapter_number = excluded.chapter_number,
  chapter_title = excluded.chapter_title,
  position = excluded.position,
  title = excluded.title,
  mark = excluded.mark,
  description = excluded.description,
  intro = excluded.intro;

insert into public.exercises (slug, grade, topic, position, question, answer, options, type, difficulty, visual, explain) values
${exerciseRows.join(',\n')}
on conflict (slug) do update set
  grade = excluded.grade,
  topic = excluded.topic,
  position = excluded.position,
  question = excluded.question,
  answer = excluded.answer,
  options = excluded.options,
  type = excluded.type,
  difficulty = excluded.difficulty,
  visual = excluded.visual,
  explain = excluded.explain;
`

const out = resolve(root, 'supabase/seed.sql')
await mkdir(dirname(out), { recursive: true })
await writeFile(out, sql, 'utf8')
console.log(`Đã ghi ${out}: ${topicRows.length} bài, ${exerciseRows.length} câu hỏi.`)
