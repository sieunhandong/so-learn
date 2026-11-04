import CountingVisual from '@/components/math/CountingVisual'
import ReadingVisualView from '@/components/tieng-viet/ReadingVisualView'
import { isReadingVisual } from '@/lib/questions'
import type { LessonVisual } from '@/types/lesson'

interface LessonVisualViewProps {
  visual: LessonVisual
}

/** Hình minh họa của một phần "Cùng học" hoặc một câu hỏi: hình của Tiếng Việt thì vẽ bằng ReadingVisualView, còn lại là hình của Toán */
export default function LessonVisualView({ visual }: LessonVisualViewProps) {
  return isReadingVisual(visual) ? <ReadingVisualView visual={visual} /> : <CountingVisual visual={visual} />
}
