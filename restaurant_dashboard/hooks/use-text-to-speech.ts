"use client"

import { useState, useCallback } from "react"

interface TTSOptions {
  language?: string
  rate?: number
  pitch?: number
  volume?: number
}

export function useTextToSpeech(options: TTSOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(typeof window !== "undefined" && "speechSynthesis" in window)

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) {
        console.warn("Text-to-speech not supported")
        return
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = options.language || "fr-FR"
      utterance.rate = options.rate || 1
      utterance.pitch = options.pitch || 1
      utterance.volume = options.volume || 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(utterance)
    },
    [isSupported, options],
  )

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }, [isSupported])

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
  }
}
