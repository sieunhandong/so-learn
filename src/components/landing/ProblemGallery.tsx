import { getQuestions } from '@/lib/content'
import ProblemShowcase, { type ProblemExample } from './ProblemShowcase'

// Tên tab và cách làm cho từng câu hỏi mẫu, theo id câu hỏi trong bộ luyện tập
const notes: Record<string, { title: string; body: string }> = {
  '1': { title: 'Gộp hai nhóm táo', body: 'Bé đếm nhóm thứ nhất, rồi đếm tiếp sang nhóm thứ hai để ra tổng.' },
  '2': { title: 'Đếm tiếp chấm tròn', body: 'Hai màu chấm cho hai số. Bé bắt đầu từ 7, đếm tiếp thêm 4 chấm vàng.' },
  '3': { title: 'Gạch bớt que tính', body: 'Phần bị bớt được gạch bằng bút đỏ. Bé chỉ cần đếm phần còn lại.' },
  '4': { title: 'So bó chục', body: 'Mỗi bó là 10 que. Bé so số bó trước, bằng nhau thì so que lẻ.' },
  '5': { title: 'Hai nhóm bằng nhau', body: 'Hai nhóm cùng 6 que. Bé đếm cả hai nhóm, hoặc nhớ 6 + 6 là gấp đôi 6.' },
}

/** Mọi câu hỏi mẫu trong bài luyện tập, mỗi câu một tab trong băng trượt */
export default function ProblemGallery() {
  const examples: ProblemExample[] = getQuestions().flatMap(question => {
    const note = notes[question.id]
    return note ? [{ ...note, question }] : []
  })

  return <ProblemShowcase examples={examples} />
}
