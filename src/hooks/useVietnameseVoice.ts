'use client'

import { useSyncExternalStore } from 'react'
import type { VoiceStatus } from '@/types/tiengviet'

/** Trình duyệt nạp danh sách giọng chậm nên báo lại qua sự kiện voiceschanged */
function subscribe(onChange: () => void): () => void {
  if (!('speechSynthesis' in window)) return () => {}
  window.speechSynthesis.addEventListener('voiceschanged', onChange)
  return () => window.speechSynthesis.removeEventListener('voiceschanged', onChange)
}

// Kết quả là chuỗi nên so sánh giữa các lần đọc vẫn ổn định
function getSnapshot(): VoiceStatus {
  if (!('speechSynthesis' in window)) return 'unsupported'
  const voices = window.speechSynthesis.getVoices()
  // Danh sách rỗng: chưa nạp xong, giữ checking chờ voiceschanged
  if (voices.length === 0) return 'checking'
  return voices.some(v => v.lang.toLowerCase().startsWith('vi')) ? 'ready' : 'missing'
}

// Trên server chưa biết trình duyệt có giọng nào, nên coi như đang kiểm tra
const getServerSnapshot = (): VoiceStatus => 'checking'

/** Kiểm tra trình duyệt có giọng đọc tiếng Việt (lang bắt đầu bằng "vi") hay không */
export function useVietnameseVoice(): VoiceStatus {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
