'use client'

import { useVietnameseVoice } from '@/hooks/useVietnameseVoice'
import type { VoiceStatus } from '@/types/tiengviet'

const STATUS_NOTE: Record<VoiceStatus, string> = {
  checking: 'đang kiểm tra danh sách giọng',
  ready: 'trình duyệt có giọng tiếng Việt',
  missing: 'trình duyệt chưa có giọng tiếng Việt',
  unsupported: 'trình duyệt không hỗ trợ đọc thành tiếng',
}

/** Một dòng cho biết trình duyệt có giọng đọc tiếng Việt hay không */
export default function VoiceStatusLine() {
  const status = useVietnameseVoice()

  return (
    <p className="text-lg font-semibold text-graphite">
      Giọng đọc tiếng Việt: <span className="rounded-lg bg-sun/40 px-2 font-bold text-ink-deep">{status}</span>
      <span className="text-pencil"> ({STATUS_NOTE[status]})</span>
    </p>
  )
}
