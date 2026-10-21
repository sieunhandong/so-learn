'use client'

import { useState, useSyncExternalStore } from 'react'

export interface Speech {
  supported: boolean
  speaking: boolean
  speak: (text: string) => void
  stop: () => void
}

const subscribeNoop = () => () => {}

/** Đọc đề bằng giọng tiếng Việt của trình duyệt (Web Speech API) */
export function useSpeech(): Speech {
  const supported = useSyncExternalStore(
    subscribeNoop,
    () => 'speechSynthesis' in window,
    () => false,
  )
  const [speaking, setSpeaking] = useState(false)

  function stop() {
    if (!supported) return
    window.speechSynthesis.cancel()
    setSpeaking(false)
  }

  function speak(text: string) {
    if (!supported) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'vi-VN'
    utterance.rate = 0.9
    const voice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('vi'))
    if (voice) utterance.voice = voice
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  return { supported, speaking, speak, stop }
}
