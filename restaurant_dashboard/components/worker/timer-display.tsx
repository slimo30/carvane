"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Square } from "lucide-react"

interface TimerDisplayProps {
  duration: number // in seconds
  isActive: boolean
  onComplete: () => void
}

export function TimerDisplay({ duration, isActive, onComplete }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (isActive && !isRunning) {
      setTimeLeft(duration)
      setIsRunning(true)
    }
  }, [isActive, duration])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            onComplete()
            // Play completion sound
            playCompletionSound()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, onComplete])

  const playCompletionSound = () => {
    // Mock sound - would play actual audio
    console.log("[Timer] Completion sound played")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const progress = ((duration - timeLeft) / duration) * 100
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const stopTimer = () => {
    setIsRunning(false)
    setTimeLeft(duration)
  }

  return (
    <div className="flex items-center space-x-6">
      <div className="relative">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-muted"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`transition-all duration-1000 ${timeLeft <= 10 ? "text-destructive" : "text-primary"}`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-bold ${timeLeft <= 10 ? "text-destructive" : "text-foreground"}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Button variant={isRunning ? "secondary" : "default"} size="sm" onClick={toggleTimer}>
          {isRunning ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Démarrer
            </>
          )}
        </Button>

        <Button variant="outline" size="sm" onClick={stopTimer}>
          <Square className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  )
}
