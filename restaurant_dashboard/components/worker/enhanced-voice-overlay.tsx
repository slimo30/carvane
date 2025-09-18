"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, VolumeX, SkipForward, RotateCcw, X, Settings } from "lucide-react"
import { useVoiceControl } from "@/hooks/use-voice-control"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"

interface EnhancedVoiceOverlayProps {
  currentStep: {
    id: string
    instruction: string
    index: number
    voicePrompt?: string
  }
  onNext: () => void
  onRepeat: () => void
  onClose: () => void
  onVoiceCommand?: (command: string) => void
}

export function EnhancedVoiceOverlay({
  currentStep,
  onNext,
  onRepeat,
  onClose,
  onVoiceCommand,
}: EnhancedVoiceOverlayProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [voiceRate, setVoiceRate] = useState(1)
  const [voiceVolume, setVoiceVolume] = useState(1)
  const [lastCommand, setLastCommand] = useState("")

  const { speak, stop, isSpeaking } = useTextToSpeech({
    language: "fr-FR",
    rate: voiceRate,
    volume: voiceVolume,
  })

  const { isListening, transcript, startListening, stopListening, isSupported } = useVoiceControl({
    language: "fr-FR",
    continuous: false,
    interimResults: false,
  })

  const voiceCommands = [
    { patterns: ["suivant", "next", "continuer", "étape suivante"], action: "next" },
    { patterns: ["répéter", "repeat", "encore", "redis"], action: "repeat" },
    { patterns: ["aide", "help", "assistance", "commandes"], action: "help" },
    { patterns: ["pause", "arrêt", "stop"], action: "pause" },
    { patterns: ["fermer", "close", "quitter"], action: "close" },
  ]

  useEffect(() => {
    // Auto-speak instruction when step changes
    const textToSpeak = currentStep.voicePrompt || currentStep.instruction
    const fullPrompt = `Étape ${currentStep.index}: ${textToSpeak}. Dites 'suivant' quand vous êtes prêt.`
    speak(fullPrompt)
  }, [currentStep, speak])

  useEffect(() => {
    // Process voice commands when transcript changes
    if (transcript) {
      handleVoiceCommand(transcript.toLowerCase())
    }
  }, [transcript])

  const handleVoiceCommand = (command: string) => {
    const foundCommand = voiceCommands.find((vc) => vc.patterns.some((pattern) => command.includes(pattern)))

    if (foundCommand) {
      setLastCommand(command)
      switch (foundCommand.action) {
        case "next":
          onNext()
          break
        case "repeat":
          onRepeat()
          speakCurrentInstruction()
          break
        case "help":
          speakHelp()
          break
        case "pause":
          stop()
          break
        case "close":
          onClose()
          break
      }
      onVoiceCommand?.(foundCommand.action)
    } else {
      setLastCommand("Commande non reconnue")
      speak("Commande non reconnue. Dites 'aide' pour les commandes disponibles.")
    }
  }

  const speakCurrentInstruction = () => {
    const textToSpeak = currentStep.voicePrompt || currentStep.instruction
    speak(`Étape ${currentStep.index}: ${textToSpeak}`)
  }

  const speakHelp = () => {
    const helpText =
      "Commandes disponibles: 'suivant' pour l'étape suivante, 'répéter' pour réécouter, 'pause' pour arrêter la lecture, 'fermer' pour quitter."
    speak(helpText)
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Assistant Vocal</h3>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showSettings && (
            <div className="mb-4 p-4 bg-muted rounded-lg space-y-3">
              <div>
                <label className="text-sm font-medium">Vitesse de lecture</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(Number.parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="mb-4">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full transition-all ${
                  isSpeaking ? "bg-primary animate-pulse scale-110" : "bg-muted"
                }`}
              >
                {isSpeaking ? <Volume2 className="h-8 w-8 text-white" /> : <VolumeX className="h-8 w-8" />}
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-2">Étape {currentStep.index}</div>
            <div className="font-medium mb-4 text-balance">{currentStep.instruction}</div>

            {isSpeaking && (
              <Badge variant="secondary" className="mb-4 animate-pulse">
                Lecture en cours...
              </Badge>
            )}

            {isListening && (
              <Badge variant="default" className="mb-4 animate-pulse">
                Écoute active...
              </Badge>
            )}
          </div>

          <div className="space-y-4">
            {isSupported ? (
              <div className="text-center">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  size="lg"
                  onClick={toggleListening}
                  className="w-full"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      Arrêter l'écoute
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Commande vocale
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                Reconnaissance vocale non supportée par ce navigateur
              </div>
            )}

            {transcript && (
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Commande détectée:</div>
                <div className="text-primary">{transcript}</div>
              </div>
            )}

            {lastCommand && (
              <div className="text-center p-2 bg-primary/10 rounded-lg">
                <div className="text-xs text-muted-foreground">Dernière commande:</div>
                <div className="text-sm">{lastCommand}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={onRepeat} className="bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Répéter
              </Button>
              <Button onClick={onNext}>
                <SkipForward className="h-4 w-4 mr-2" />
                Suivant
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center space-y-1">
              <div>Commandes vocales disponibles:</div>
              <div className="text-primary">"suivant" • "répéter" • "aide" • "pause" • "fermer"</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
