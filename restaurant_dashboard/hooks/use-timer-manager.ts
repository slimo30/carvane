"use client"

import { useState, useEffect, useCallback } from "react"

interface Timer {
  id: string
  name: string
  duration: number
  timeLeft: number
  isRunning: boolean
  isCompleted: boolean
}

export function useTimerManager() {
  const [timers, setTimers] = useState<Timer[]>([])

  const addTimer = useCallback((name: string, duration: number) => {
    const timer: Timer = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      duration,
      timeLeft: duration,
      isRunning: false,
      isCompleted: false,
    }
    setTimers((prev) => [...prev, timer])
    return timer.id
  }, [])

  const startTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((timer) => (timer.id === id ? { ...timer, isRunning: true, isCompleted: false } : timer)),
    )
  }, [])

  const pauseTimer = useCallback((id: string) => {
    setTimers((prev) => prev.map((timer) => (timer.id === id ? { ...timer, isRunning: false } : timer)))
  }, [])

  const resetTimer = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((timer) =>
        timer.id === id ? { ...timer, timeLeft: timer.duration, isRunning: false, isCompleted: false } : timer,
      ),
    )
  }, [])

  const removeTimer = useCallback((id: string) => {
    setTimers((prev) => prev.filter((timer) => timer.id !== id))
  }, [])

  // Timer tick effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((timer) => {
          if (timer.isRunning && timer.timeLeft > 0) {
            const newTimeLeft = timer.timeLeft - 1
            if (newTimeLeft === 0) {
              // Timer completed
              playCompletionSound()
              return { ...timer, timeLeft: 0, isRunning: false, isCompleted: true }
            }
            return { ...timer, timeLeft: newTimeLeft }
          }
          return timer
        }),
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const playCompletionSound = () => {
    // Create audio context for completion sound
    if (typeof window !== "undefined" && "AudioContext" in window) {
      const audioContext = new AudioContext()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    }
  }

  return {
    timers,
    addTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    removeTimer,
  }
}
