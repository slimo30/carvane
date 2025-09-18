"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, X } from "lucide-react"

interface ModernVoiceOverlayProps {
  currentStep: {
    id: string
    instruction: string
    index: number
  }
  onNext: () => void
  onRepeat: () => void
  onProblem: () => void
  onClose: () => void
  isVisible: boolean
}

type VoiceState = "idle" | "listening" | "processing" | "speaking" | "error"
type STTFeedback = "listening" | "processing" | "recognized" | "not-recognized" | "error"

export default function ModernVoiceOverlay({
  currentStep,
  onNext,
  onRepeat,
  onProblem,
  onClose,
  isVisible,
}: ModernVoiceOverlayProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>("idle")
  const [sttFeedback, setSTTFeedback] = useState<STTFeedback>("listening")
  const [recognizedText, setRecognizedText] = useState("")
  const [ttsSubtitle, setTTSSubtitle] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    if (isVisible) {
      speakInstruction()
    }
  }, [isVisible, currentStep])

  const speakInstruction = () => {
    setIsSpeaking(true)
    setVoiceState("speaking")
    const instruction = `Étape ${currentStep.index}: ${currentStep.instruction}`
    setTTSSubtitle(instruction)

    // Simulate TTS duration
    setTimeout(() => {
      setTTSSubtitle("Dites 'Suivant', 'Répéter' ou 'Problème'")
      setTimeout(() => {
        setIsSpeaking(false)
        setVoiceState("idle")
        setTTSSubtitle("")
      }, 2000)
    }, 4000)
  }

  const startListening = () => {
    setIsListening(true)
    setVoiceState("listening")
    setSTTFeedback("listening")
    setRecognizedText("")

    // Simulate listening phase
    setTimeout(() => {
      setSTTFeedback("processing")
      setVoiceState("processing")

      // Simulate processing and recognition
      setTimeout(() => {
        const mockCommands = [
          { text: "suivant", action: "next", success: true },
          { text: "répéter", action: "repeat", success: true },
          { text: "problème", action: "problem", success: true },
          { text: "commande inconnue", action: "unknown", success: false },
        ]

        const randomCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)]
        setRecognizedText(randomCommand.text)

        if (randomCommand.success) {
          setSTTFeedback("recognized")
          handleVoiceCommand(randomCommand.action)
        } else {
          setSTTFeedback("not-recognized")
        }

        setIsListening(false)
        setVoiceState("idle")

        // Clear feedback after delay
        setTimeout(() => {
          setSTTFeedback("listening")
          setRecognizedText("")
        }, 2000)
      }, 1500)
    }, 1000)
  }

  const handleVoiceCommand = (action: string) => {
    switch (action) {
      case "next":
        onNext()
        break
      case "repeat":
        onRepeat()
        speakInstruction()
        break
      case "problem":
        onProblem()
        break
    }
  }

  const getSTTFeedbackMessage = () => {
    switch (sttFeedback) {
      case "listening":
        return "Écoute en cours..."
      case "processing":
        return "Traitement..."
      case "recognized":
        return `Commande reconnue: "${recognizedText}"`
      case "not-recognized":
        return "Commande non reconnue"
      case "error":
        return "Erreur de reconnaissance"
      default:
        return "Écoute en cours..."
    }
  }

  const getMicrophoneState = () => {
    if (voiceState === "listening") return "animate-pulse scale-110"
    if (voiceState === "processing") return "animate-spin"
    if (voiceState === "speaking") return "animate-bounce"
    return ""
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-8 right-8 text-white hover:bg-white/20 rounded-2xl"
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="mb-8">
          <div
            className={`
            w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300
            ${
              voiceState === "listening"
                ? "bg-green-500/80"
                : voiceState === "processing"
                  ? "bg-blue-500/80"
                  : voiceState === "speaking"
                    ? "bg-purple-500/80"
                    : "bg-white/20"
            }
            ${getMicrophoneState()}
          `}
          >
            {voiceState === "speaking" ? (
              <Volume2 className="w-16 h-16 text-white" />
            ) : isListening ? (
              <MicOff className="w-16 h-16 text-white" />
            ) : (
              <Mic className="w-16 h-16 text-white" />
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-2xl font-bold text-white mb-4">{getSTTFeedbackMessage()}</div>

          {recognizedText && sttFeedback === "recognized" && (
            <div className="bg-green-500/20 border border-green-500/30 rounded-2xl px-6 py-3">
              <div className="text-green-300 text-lg font-medium">"{recognizedText}"</div>
            </div>
          )}

          {sttFeedback === "not-recognized" && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl px-6 py-3">
              <div className="text-red-300 text-lg font-medium">Commande non reconnue</div>
            </div>
          )}
        </div>

        {ttsSubtitle && (
          <div className="absolute bottom-32 left-8 right-8">
            <div className="bg-black/80 rounded-2xl px-8 py-6 text-center">
              <div className="text-xl font-medium text-white leading-relaxed">{ttsSubtitle}</div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            onClick={startListening}
            disabled={isListening || isSpeaking}
            className={`
              px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300
              ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-white/20 hover:bg-white/30 text-white border border-white/30"
              }
            `}
          >
            {isListening ? (
              <>
                <MicOff className="w-6 h-6 mr-3" />
                Arrêter l'écoute
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 mr-3" />
                Commande vocale
              </>
            )}
          </Button>

          <div className="text-white/70 text-center">
            <div className="text-sm mb-2">Commandes disponibles:</div>
            <div className="flex gap-4 text-xs">
              <span className="bg-white/10 px-3 py-1 rounded-full">"Suivant"</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">"Répéter"</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">"Problème"</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={onRepeat}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-2xl"
            >
              Répéter
            </Button>
            <Button
              variant="outline"
              onClick={onNext}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-2xl"
            >
              Suivant
            </Button>
            <Button
              variant="outline"
              onClick={onProblem}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-2xl"
            >
              Problème
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
