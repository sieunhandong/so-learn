import { getQuestions } from '@/lib/content'
import type { QuestionVisual } from '@/types/math'
import ProblemShowcase, { type ProblemExample } from './ProblemShowcase'

const kinds: { kind: QuestionVisual['kind']; title: string; body: string }[] = [
  { kind: 'add', title: 'Gộp hai nhóm', body: 'Bé đếm nhóm thứ nhất, rồi đếm tiếp sang nhóm thứ hai để ra tổng.' },
  { kind: 'take-away', title: 'Gạch bớt đi', body: 'Phần bị bớt được gạch bằng bút đỏ. Bé chỉ cần đếm phần còn lại.' },
  { kind: 'compare', title: 'So bó chục', body: 'Mỗi bó là 10 que. Bé so số bó trước, bằng nhau thì so que lẻ.' },
]

/** Ba cách minh họa bài toán, lấy từ chính các câu hỏi trong bài luyện tập */
export default function ProblemGallery() {
  const questions = getQuestions()
  const examples: ProblemExample[] = kinds.flatMap(k => {
    const question = questions.find(q => q.visual.kind === k.kind)
    return question ? [{ ...k, question }] : []
  })

  return <ProblemShowcase examples={examples} />
}
