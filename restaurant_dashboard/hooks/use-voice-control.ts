"use client"

import { useState, useEffect, useCallback } from "react"

interface VoiceControlOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
}

export function useVoiceControl(options: VoiceControlOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsSupported("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    }
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Speech recognition not supported")
      return
    }

    try {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.lang = options.language || "fr-FR"
      recognition.continuous = options.continuous || false
      recognition.interimResults = options.interimResults || false

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
      }

      recognition.onresult = (event) => {
        const result = event.results[event.results.length - 1]
        setTranscript(result[0].transcript)
        setConfidence(result[0].confidence)
      }

      recognition.onerror = (event) => {
        setError(event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (err) {
      setError("Failed to start speech recognition")
      setIsListening(false)
    }
  }, [isSupported, options])

  const stopListening = useCallback(() => {
    setIsListening(false)
  }, [])

  return {
    isListening,
    isSupported,
    transcript,
    confidence,
    error,
    startListening,
    stopListening,
  }
}
