// Dựng các dòng topics/exercises và câu lệnh SQL cho seed, dùng chung cho nhiều môn.
// Hàm ở đây thuần túy (không đọc/ghi file, không kiểm tra nội dung) để test gọi được với dữ liệu mẫu.
// scripts/build-seed.mjs lo phần nạp nội dung, kiểm tra và ghi supabase/seed.sql.

/**
 * Chuyển nội dung các môn thành dòng khớp cột trong bảng (có thêm `subject`).
 * Mỗi nguồn là { subject, grade, chapters }; position của bài đánh lại từ 1 cho mỗi nguồn.
 */
export function buildSeed(sources) {
  const topics = []
  const exercises = []

  for (const { subject, grade, chapters } of sources) {
    let position = 0
    for (const chapter of chapters) {
      for (const lesson of chapter.lessons) {
        position += 1
        topics.push({
          id: lesson.slug,
          subject,
          grade,
          chapter_number: chapter.number,
          chapter_title: chapter.title,
          position,
          title: lesson.title,
          mark: lesson.mark,
          description: lesson.description,
          intro: lesson.intro,
        })
        lesson.exercises.forEach((e, i) => {
          exercises.push({
            slug: `${lesson.slug}-${i + 1}`,
            subject,
            grade,
            topic: lesson.slug,
            position: i + 1,
            question: e.prompt,
            answer: e.answer,
            options: e.options,
            // Câu ghép tiếng kéo thả các ô; mọi câu còn lại chọn một đáp án
            type: e.visual?.kind === 'build' ? 'drag_drop' : 'multiple_choice',
            difficulty: e.difficulty,
            visual: e.visual,
            explain: e.explain,
          })
        })
      }
    }
  }

  return { topics, exercises }
}

/** Giá trị SQL của một ô: số để nguyên, chuỗi nhân đôi dấu nháy đơn, còn lại là jsonb */
function sqlValue(column, value) {
  if (value === undefined) throw new Error(`Thiếu giá trị cho cột ${column}`)
  if (typeof value === 'number') return String(value)
  const quote = text => `'${text.replaceAll("'", "''")}'`
  if (typeof value === 'string') return quote(value)
  return `${quote(JSON.stringify(value))}::jsonb`
}

/** Một lệnh insert ... on conflict ... do update cho cả bảng; rỗng nếu không có dòng nào */
function insertSql(table, key, rows) {
  if (rows.length === 0) return ''
  const columns = Object.keys(rows[0])
  const values = rows.map(row => `(${columns.map(c => sqlValue(c, row[c])).join(', ')})`)
  const updates = columns.filter(c => c !== key).map(c => `  ${c} = excluded.${c}`)
  return `insert into public.${table} (${columns.join(', ')}) values
${values.join(',\n')}
on conflict (${key}) do update set
${updates.join(',\n')};
`
}

/** Toàn bộ nội dung supabase/seed.sql: một lệnh insert cho topics, một cho exercises */
export function toSql({ topics, exercises }) {
  const header = `-- File này được sinh tự động bởi scripts/build-seed.mjs. Đừng sửa tay: sửa src/content/grade1.ts (Toán) hoặc src/content/tiengviet1.ts (Tiếng Việt) rồi chạy lại.
-- Chạy trong Supabase Dashboard > SQL Editor, sau file migrations.
`
  // Bảng không có dòng nào thì bỏ lệnh, tránh VALUES rỗng
  const statements = [insertSql('topics', 'id', topics), insertSql('exercises', 'slug', exercises)].filter(Boolean)
  return [header, ...statements].join('\n')
}
