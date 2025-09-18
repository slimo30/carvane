"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, Pause, RotateCcw, AlertTriangle, CheckCircle, Volume2, VolumeX } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import ModernVoiceOverlay from "./modern-voice-overlay"

interface RecipeExecutionProps {
  recipeId: string
}

interface RecipeStep {
  id: string
  index: number
  instruction: string
  timeSec: number
  completed: boolean
}

interface Recipe {
  id: string
  name: string
  description: string
  image: string
  estimatedTime: number
  ingredients: Array<{ name: string; quantity: string }>
  steps: RecipeStep[]
}

export default function ModernRecipeExecution({ recipeId }: RecipeExecutionProps) {
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showProblemModal, setShowProblemModal] = useState(false)
  const [sessionStartTime] = useState(new Date())

  const recipe: Recipe = {
    id: recipeId,
    name: "Poulet Rôti Express",
    description: "Poulet rôti avec légumes de saison",
    image: "/roasted-chicken-with-vegetables.jpg",
    estimatedTime: 15,
    ingredients: [
      { name: "Poulet", quantity: "180g" },
      { name: "Pommes de terre", quantity: "200g" },
      { name: "Carottes", quantity: "100g" },
      { name: "Huile d'olive", quantity: "2 c.à.s" },
      { name: "Sel, poivre", quantity: "Au goût" },
    ],
    steps: [
      {
        id: "1",
        index: 1,
        instruction: "Préchauffer le four à 200°C et assaisonner le poulet avec sel et poivre",
        timeSec: 120,
        completed: false,
      },
      {
        id: "2",
        index: 2,
        instruction: "Couper les légumes en morceaux moyens et les disposer autour du poulet",
        timeSec: 180,
        completed: false,
      },
      {
        id: "3",
        index: 3,
        instruction: "Arroser d'huile d'olive et enfourner",
        timeSec: 60,
        completed: false,
      },
      {
        id: "4",
        index: 4,
        instruction: "Cuire pendant 12 minutes en surveillant la coloration",
        timeSec: 720,
        completed: false,
      },
      {
        id: "5",
        index: 5,
        instruction: "Vérifier la cuisson et laisser reposer 2 minutes avant de servir",
        timeSec: 120,
        completed: false,
      },
    ],
  }

  const currentStep = recipe.steps[currentStepIndex]
  const progress = (completedSteps.size / recipe.steps.length) * 100
  const isLastStep = currentStepIndex === recipe.steps.length - 1

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerActive(false)
            // Auto-complete step when timer ends
            setCompletedSteps((prev) => new Set([...prev, currentStepIndex]))
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerActive, timeRemaining, currentStepIndex])

  const CircularTimer = ({ duration, remaining }: { duration: number; remaining: number }) => {
    const percentage = duration > 0 ? (remaining / duration) * 100 : 0
    const circumference = 2 * Math.PI * 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    // Color coding: green → orange → red
    const getTimerColor = () => {
      if (percentage > 60) return "#10b981" // green
      if (percentage > 30) return "#f59e0b" // orange
      return "#ef4444" // red
    }

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgb(243 244 246)" strokeWidth="6" />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={getTimerColor()}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-gray-900">{formatTime(remaining)}</div>
          <div className="text-xs text-gray-600">restant</div>
        </div>
      </div>
    )
  }

  const handleStartTimer = () => {
    if (currentStep.timeSec) {
      setTimeRemaining(currentStep.timeSec)
      setIsTimerActive(true)
    }
  }

  const handleNextStep = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStepIndex]))
      setCurrentStepIndex((prev) => prev + 1)
      setIsTimerActive(false)
      setTimeRemaining(0)
    }
  }

  const handleRepeat = () => {
    // Reset current step timer
    setIsTimerActive(false)
    setTimeRemaining(0)
    // Voice repeat logic would go here
  }

  const handleCompleteRecipe = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStepIndex]))
    const duration = Math.round((Date.now() - sessionStartTime.getTime()) / 60000)
    alert(`Recette terminée ! Durée réelle: ${duration} minutes`)
    router.push("/worker/validation")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-xl">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Button>

            <div className="flex items-center gap-4">
              <Button
                variant={isVoiceActive ? "default" : "outline"}
                size="sm"
                onClick={() => setIsVoiceActive(!isVoiceActive)}
                className="rounded-xl"
              >
                {isVoiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="relative h-64 rounded-3xl overflow-hidden mb-8 shadow-2xl">
          <Image src={recipe.image || "/placeholder.svg"} alt={recipe.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
            <p className="text-white/90">{recipe.description}</p>
          </div>
          <div className="absolute top-6 right-6">
            <Badge className="bg-white/90 text-gray-900 border-0">
              Étape {currentStep.index} / {recipe.steps.length}
            </Badge>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Progression</span>
            <span className="font-medium text-gray-900">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3 rounded-full" />
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl p-8 mb-8 transition-all duration-500 ease-out">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
              <span className="text-2xl font-bold text-green-600">{currentStep.index}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Étape {currentStep.index}</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">{currentStep.instruction}</p>
          </div>

          {currentStep.timeSec && (
            <div className="text-center mb-8">
              <CircularTimer duration={currentStep.timeSec} remaining={timeRemaining} />
              {!isTimerActive && timeRemaining === 0 && (
                <Button
                  onClick={handleStartTimer}
                  size="lg"
                  className="mt-4 bg-green-500 hover:bg-green-600 rounded-2xl"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Démarrer le minuteur
                </Button>
              )}
              {isTimerActive && (
                <Button
                  onClick={() => setIsTimerActive(false)}
                  size="lg"
                  variant="outline"
                  className="mt-4 rounded-2xl"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </Button>
              )}
            </div>
          )}
        </Card>

        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-4">
            <div className="flex items-center gap-4">
              {/* Orange = Problem */}
              <Button
                size="lg"
                onClick={() => setShowProblemModal(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-6"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Problème
              </Button>

              {/* Grey = Repeat */}
              <Button
                size="lg"
                variant="outline"
                onClick={handleRepeat}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300 rounded-2xl px-6"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Répéter
              </Button>

              {/* Green = Next, Blue = Finish */}
              {!isLastStep ? (
                <Button
                  size="lg"
                  onClick={handleNextStep}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-2xl px-6"
                >
                  Suivant
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleCompleteRecipe}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-6"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Terminé
                </Button>
              )}
            </div>
          </div>
        </div>

        <ModernVoiceOverlay
          currentStep={currentStep}
          onNext={handleNextStep}
          onRepeat={handleRepeat}
          onProblem={() => setShowProblemModal(true)}
          onClose={() => setIsVoiceActive(false)}
          isVisible={isVoiceActive}
        />

        {showProblemModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 flex items-center justify-center">
            <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-10 h-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Signaler un Problème</h3>
              <p className="text-gray-600 mb-6">Quel type de problème rencontrez-vous ?</p>
              <div className="space-y-3 mb-6">
                <Button variant="outline" className="w-full rounded-2xl bg-transparent">
                  Ingrédient manquant
                </Button>
                <Button variant="outline" className="w-full rounded-2xl bg-transparent">
                  Équipement défaillant
                </Button>
                <Button variant="outline" className="w-full rounded-2xl bg-transparent">
                  Instructions peu claires
                </Button>
                <Button variant="outline" className="w-full rounded-2xl bg-transparent">
                  Autre problème
                </Button>
              </div>
              <Button onClick={() => setShowProblemModal(false)} variant="outline" className="rounded-2xl">
                Annuler
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
