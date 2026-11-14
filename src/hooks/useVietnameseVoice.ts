'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import type { VoiceStatus } from '@/types/tiengviet'

/** Chờ danh sách giọng tối đa ngần này mili giây; quá hạn mà vẫn rỗng thì coi như máy thiếu giọng */
const VOICE_WAIT_MS = 3000

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

/**
 * Kiểm tra trình duyệt có giọng đọc tiếng Việt (lang bắt đầu bằng "vi") hay không.
 * Một số trình duyệt không bao giờ báo voiceschanged và getVoices() rỗng mãi, nên sau VOICE_WAIT_MS vẫn đang
 * kiểm tra thì báo 'missing'. Nếu giọng về muộn hơn thì trạng thái vẫn đổi sang 'ready' như bình thường.
 */
export function useVietnameseVoice(): VoiceStatus {
  const status = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [waitedOut, setWaitedOut] = useState(false)

  useEffect(() => {
    // Chỉ hẹn giờ khi còn đang kiểm tra; đổi trạng thái hoặc gỡ component thì hủy hẹn giờ
    if (status !== 'checking') return
    const timer = setTimeout(() => setWaitedOut(true), VOICE_WAIT_MS)
    return () => clearTimeout(timer)
  }, [status])

  return status === 'checking' && waitedOut ? 'missing' : status
}
