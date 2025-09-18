"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, MicOff, Volume2, SkipForward, RotateCcw, X } from "lucide-react"

interface VoiceOverlayProps {
  currentStep: {
    id: string
    instruction: string
    index: number
  }
  onNext: () => void
  onRepeat: () => void
  onClose: () => void
}

export function VoiceOverlay({ currentStep, onNext, onRepeat, onClose }: VoiceOverlayProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [recognizedText, setRecognizedText] = useState("")
  const [lastCommand, setLastCommand] = useState("")

  // Mock voice commands - would integrate with Web Speech API
  const voiceCommands = [
    { command: "suivant", action: "next" },
    { command: "répéter", action: "repeat" },
    { command: "aide", action: "help" },
  ]

  useEffect(() => {
    // Auto-start TTS when overlay opens
    speakInstruction()
  }, [currentStep])

  const speakInstruction = () => {
    setIsSpeaking(true)
    // Mock TTS - would use Web Speech API
    const utterance = `Étape ${currentStep.index}: ${currentStep.instruction}. Dites 'suivant' quand vous êtes prêt.`
    console.log("[TTS]", utterance)

    // Simulate TTS duration
    setTimeout(() => {
      setIsSpeaking(false)
    }, 3000)
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      // Mock speech recognition
      setTimeout(() => {
        const mockCommands = ["suivant", "répéter", "aide"]
        const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)]
        setRecognizedText(randomCommand)
        setLastCommand(randomCommand)
        handleVoiceCommand(randomCommand)
        setIsListening(false)
      }, 2000)
    }
  }

  const handleVoiceCommand = (command: string) => {
    const foundCommand = voiceCommands.find((vc) => command.toLowerCase().includes(vc.command))

    if (foundCommand) {
      switch (foundCommand.action) {
        case "next":
          onNext()
          break
        case "repeat":
          onRepeat()
          speakInstruction()
          break
        case "help":
          speakHelp()
          break
      }
    } else {
      setRecognizedText("Commande non reconnue")
    }
  }

  const speakHelp = () => {
    const helpText =
      "Commandes disponibles: dites 'suivant' pour passer à l'étape suivante, 'répéter' pour réécouter l'instruction."
    console.log("[TTS Help]", helpText)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Contrôle Vocal</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center mb-6">
            <div className="mb-4">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                  isSpeaking ? "bg-primary animate-pulse" : "bg-muted"
                }`}
              >
                <Volume2 className="h-8 w-8 text-white" />
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-2">Étape {currentStep.index}</div>
            <div className="font-medium mb-4">{currentStep.instruction}</div>

            {isSpeaking && (
              <Badge variant="secondary" className="mb-4">
                Lecture en cours...
              </Badge>
            )}
          </div>

          <div className="space-y-4">
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

            {isListening && (
              <div className="text-center">
                <div className="animate-pulse text-primary font-medium">Écoute en cours...</div>
                <div className="text-xs text-muted-foreground mt-1">Dites "suivant", "répéter" ou "aide"</div>
              </div>
            )}

            {recognizedText && (
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-sm font-medium">Commande reconnue:</div>
                <div className="text-primary">{recognizedText}</div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button variant="outline" onClick={onRepeat} className="flex-1 bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Répéter
              </Button>
              <Button onClick={onNext} className="flex-1">
                <SkipForward className="h-4 w-4 mr-2" />
                Suivant
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Commandes vocales: "suivant", "répéter", "aide"
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
