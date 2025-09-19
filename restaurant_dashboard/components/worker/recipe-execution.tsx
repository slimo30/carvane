"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { SkipForward, ArrowCounterClockwise, Warning, CheckCircle as PhCheckCircle, Timer as PhTimer, SpeakerHigh, SpeakerX } from "phosphor-react"
import { WorkerHeader } from "./worker-header"
import { VoiceOverlay } from "./voice-overlay"
import { TimerDisplay } from "./timer-display"
import { ProblemModal } from "./problem-modal"
import Image from "next/image"

interface RecipeExecutionProps {
  recipeId: string
}

export function RecipeExecution({ recipeId }: RecipeExecutionProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [showProblemModal, setShowProblemModal] = useState(false)
  const [sessionStartTime] = useState(new Date())

  // Mock recipe data - would come from API
  const recipe = {
    id: recipeId,
    name: "Poulet rôti express",
    description: "Poulet rôti avec légumes de saison",
    image: "/placeholder-eyeem.png",
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

  const handleNextStep = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      setCompletedSteps((prev) => new Set([...prev, currentStepIndex]))
      setCurrentStepIndex((prev) => prev + 1)
      setIsTimerActive(false)
      setTimerSeconds(0)
    }
  }

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
      setIsTimerActive(false)
      setTimerSeconds(0)
    }
  }

  const handleStartTimer = () => {
    if (currentStep.timeSec) {
      setTimerSeconds(currentStep.timeSec)
      setIsTimerActive(true)
    }
  }

  const handleCompleteRecipe = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStepIndex]))
    // Would trigger completion logic and navigation
    alert(
      "Recette terminée ! Durée réelle: " + Math.round((Date.now() - sessionStartTime.getTime()) / 60000) + " minutes",
    )
  }

  const isLastStep = currentStepIndex === recipe.steps.length - 1
  const isStepCompleted = completedSteps.has(currentStepIndex)

  return (
    <div className="min-h-screen bg-background">
      <WorkerHeader />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Recipe Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{recipe.name}</h1>
            <Badge variant="outline" className="flex items-center">
              <PhTimer className="h-3 w-3 mr-1" />
              {recipe.estimatedTime} min
            </Badge>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progression</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recipe Info */}
          <div className="lg:col-span-1">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">Ingrédients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span>{ingredient.name}</span>
                      <span className="text-muted-foreground">{ingredient.quantity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="relative h-48 rounded-lg overflow-hidden mb-4">
              <Image src={recipe.image || "/placeholder.svg"} alt={recipe.name} fill className="object-cover" />
            </div>
          </div>

          {/* Current Step */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    Étape {currentStep.index} sur {recipe.steps.length}
                    {isStepCompleted && <CheckCircle className="h-5 w-5 text-green-500 ml-2" />}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsVoiceActive(!isVoiceActive)}>
                    {isVoiceActive ? <SpeakerHigh className="h-4 w-4" /> : <SpeakerX className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6 leading-relaxed">{currentStep.instruction}</p>

                {/* Timer */}
                {currentStep.timeSec && (
                  <div className="mb-6">
                    <TimerDisplay
                      duration={currentStep.timeSec}
                      isActive={isTimerActive}
                      onComplete={() => {
                        setIsTimerActive(false)
                        // Auto-complete step when timer ends
                        if (!isStepCompleted) {
                          setCompletedSteps((prev) => new Set([...prev, currentStepIndex]))
                        }
                      }}
                    />
                    {!isTimerActive && (
                      <Button onClick={handleStartTimer} className="mt-2">
                        <PhTimer className="h-4 w-4 mr-2" />
                        Démarrer le minuteur
                      </Button>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={handlePreviousStep} disabled={currentStepIndex === 0}>
                    <ArrowCounterClockwise className="h-4 w-4 mr-2" />
                    Répéter
                  </Button>

                  <Button variant="destructive" onClick={() => setShowProblemModal(true)}>
                    <Warning className="h-4 w-4 mr-2" />
                    Problème
                  </Button>

                  {!isLastStep ? (
                    <Button onClick={handleNextStep} className="ml-auto">
                      Suivant
                      <SkipForward className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleCompleteRecipe} className="ml-auto">
                      <PhCheckCircle className="h-4 w-4 mr-2" />
                      Terminé
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Steps Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Toutes les étapes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recipe.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-start space-x-3 p-3 rounded-lg border ${
                        index === currentStepIndex
                          ? "border-primary bg-primary/5"
                          : completedSteps.has(index)
                            ? "border-green-200 bg-green-50"
                            : "border-border"
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {completedSteps.has(index) ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <div
                            className={`w-5 h-5 rounded-full border-2 ${
                              index === currentStepIndex ? "border-primary" : "border-muted-foreground"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm mb-1">Étape {step.index}</div>
                        <div className="text-sm text-muted-foreground">{step.instruction}</div>
                        {step.timeSec && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            <Timer className="h-3 w-3 mr-1" />
                            {Math.round(step.timeSec / 60)} min
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Voice Overlay */}
      {isVoiceActive && (
        <VoiceOverlay
          currentStep={currentStep}
          onNext={handleNextStep}
          onRepeat={() => {
            /* TTS repeat logic */
          }}
          onClose={() => setIsVoiceActive(false)}
        />
      )}

      {/* Problem Modal */}
      <ProblemModal
        isOpen={showProblemModal}
        onClose={() => setShowProblemModal(false)}
        stepId={currentStep.id}
        recipeId={recipe.id}
      />
    </div>
  )
}
