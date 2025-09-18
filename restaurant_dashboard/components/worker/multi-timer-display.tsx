"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Square, Plus, Trash2, Clock } from "lucide-react"
import { useTimerManager } from "@/hooks/use-timer-manager"

interface MultiTimerDisplayProps {
  stepTimers?: Array<{
    name: string
    duration: number
    autoStart?: boolean
  }>
}

export function MultiTimerDisplay({ stepTimers = [] }: MultiTimerDisplayProps) {
  const { timers, addTimer, startTimer, pauseTimer, resetTimer, removeTimer } = useTimerManager()
  const [newTimerName, setNewTimerName] = useState("")
  const [newTimerDuration, setNewTimerDuration] = useState(300) // 5 minutes default

  useState(() => {
    stepTimers.forEach((stepTimer) => {
      const timerId = addTimer(stepTimer.name, stepTimer.duration)
      if (stepTimer.autoStart) {
        setTimeout(() => startTimer(timerId), 100)
      }
    })
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const addCustomTimer = () => {
    if (newTimerName.trim()) {
      addTimer(newTimerName, newTimerDuration)
      setNewTimerName("")
      setNewTimerDuration(300)
    }
  }

  const getTimerColor = (timer: any) => {
    if (timer.isCompleted) return "text-green-500"
    if (timer.timeLeft <= 10) return "text-red-500"
    if (timer.timeLeft <= 60) return "text-orange-500"
    return "text-primary"
  }

  const activeTimers = timers.filter((t) => !t.isCompleted)
  const completedTimers = timers.filter((t) => t.isCompleted)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Minuteurs ({activeTimers.length} actifs)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Timers */}
        {activeTimers.length > 0 && (
          <div className="space-y-3">
            {activeTimers.map((timer) => {
              const progress = ((timer.duration - timer.timeLeft) / timer.duration) * 100
              const circumference = 2 * Math.PI * 20

              return (
                <div key={timer.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 50 50">
                        <circle
                          cx="25"
                          cy="25"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          className="text-muted-foreground/30"
                        />
                        <circle
                          cx="25"
                          cy="25"
                          r="20"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference - (progress / 100) * circumference}
                          className={`transition-all duration-1000 ${getTimerColor(timer)}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xs font-bold ${getTimerColor(timer)}`}>
                          {formatTime(timer.timeLeft)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="font-medium">{timer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatTime(timer.duration)} total
                        {timer.isRunning && <Badge className="ml-2 text-xs">En cours</Badge>}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => (timer.isRunning ? pauseTimer(timer.id) : startTimer(timer.id))}
                    >
                      {timer.isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => resetTimer(timer.id)}>
                      <Square className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeTimer(timer.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Completed Timers */}
        {completedTimers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Terminés</h4>
            {completedTimers.map((timer) => (
              <div key={timer.id} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">{timer.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    Terminé
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeTimer(timer.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add Custom Timer */}
        <div className="border-t pt-4 space-y-3">
          <h4 className="text-sm font-medium">Ajouter un minuteur</h4>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Nom du minuteur"
              value={newTimerName}
              onChange={(e) => setNewTimerName(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            <input
              type="number"
              placeholder="Secondes"
              value={newTimerDuration}
              onChange={(e) => setNewTimerDuration(Number.parseInt(e.target.value) || 0)}
              className="w-20 px-3 py-2 border rounded-md text-sm"
            />
            <Button size="sm" onClick={addCustomTimer}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {timers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Aucun minuteur actif</p>
            <p className="text-sm">Ajoutez un minuteur pour commencer</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
