"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, CheckCircle, ArrowRight, Sparkles, Clock } from "lucide-react"
import { ChefHat as PhChefHat, Robot, BookOpen as PhBookOpen } from "phosphor-react"
import Link from "next/link"

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
  aiMessage: string
}

type AIOnboardingProps = {
  onComplete?: () => void
}

export function AIOnboarding({ onComplete }: AIOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showAIMessage, setShowAIMessage] = useState(false)

  const onboardingSteps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Bienvenue dans votre cuisine !",
      description: "Découvrez votre espace de travail et les outils disponibles",
      completed: true,
      aiMessage:
        "Bonjour ! Je suis votre assistant culinaire IA. Je vais vous accompagner dans votre formation. Commençons par explorer votre espace de travail !",
    },
    {
      id: "safety",
      title: "Règles de sécurité",
      description: "Apprenez les consignes de sécurité essentielles",
      completed: true,
      aiMessage:
        "La sécurité est primordiale en cuisine. Regardons ensemble les règles de base pour travailler en toute sécurité.",
    },
    {
      id: "tools",
      title: "Découverte des outils",
      description: "Familiarisez-vous avec les ustensiles et équipements",
      completed: false,
      aiMessage:
        "Maintenant, explorons les outils de votre cuisine. Je vais vous montrer comment utiliser chaque équipement efficacement.",
    },
    {
      id: "first-recipe",
      title: "Première recette guidée",
      description: "Réalisez votre première recette avec mon assistance",
      completed: false,
      aiMessage:
        "Prêt pour votre première recette ? Je vais vous guider étape par étape avec des instructions vocales.",
    },
  ]

  const completedSteps = onboardingSteps.filter((step) => step.completed).length
  const progressPercentage = (completedSteps / onboardingSteps.length) * 100

  useEffect(() => {
    // Show AI message after component mounts
    const timer = setTimeout(() => setShowAIMessage(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const handleStepClick = (index: number) => {
    setCurrentStep(index)
    setShowAIMessage(false)
    setTimeout(() => setShowAIMessage(true), 300)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PhChefHat size={32} className="text-primary" />
              <div>
                <h1 className="text-xl font-bold">Formation Cuisinier</h1>
                <p className="text-sm text-muted-foreground">Nouveau membre de l'équipe</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              <Sparkles className="h-3 w-3 mr-1" />
              IA Activée
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PhBookOpen size={20} className="mr-2 text-primary" />
              Progression de l'intégration
            </CardTitle>
            <CardDescription>Votre parcours d'intégration personnalisé avec assistance IA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression globale</span>
                  <span className="font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{completedSteps}</div>
                  <div className="text-sm text-muted-foreground">Étapes complétées</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{onboardingSteps.length - completedSteps}</div>
                  <div className="text-sm text-muted-foreground">Étapes restantes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">2h</div>
                  <div className="text-sm text-muted-foreground">Temps estimé</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* AI Assistant */}
          <Card className="lg:order-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Robot size={20} className="mr-2 text-accent" />
                Assistant IA Culinaire
              </CardTitle>
              <CardDescription>Votre guide personnel pour l'intégration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="bg-accent">
                    <AvatarFallback>
                      <Robot size={16} className="text-accent-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div
                      className={`bg-card border rounded-lg p-3 transition-all duration-500 ${
                        showAIMessage ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                      }`}
                    >
                      <p className="text-sm">{onboardingSteps[currentStep]?.aiMessage}</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Poser une question
                  </Button>
                  <Button size="sm" variant="outline">
                    🎤
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding Steps */}
          <Card className="lg:order-1">
            <CardHeader>
              <CardTitle>Étapes d'intégration</CardTitle>
              <CardDescription>Cliquez sur une étape pour obtenir des conseils personnalisés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {onboardingSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      currentStep === index ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => handleStepClick(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <h3 className="font-medium">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-primary">Commencer la formation</CardTitle>
              <CardDescription>Démarrez votre première recette guidée par l'IA</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/worker/recipes">
                <Button className="w-full">
                  <ChefHat className="h-4 w-4 mr-2" />
                  Première recette guidée
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-accent">Mode d'entraînement</CardTitle>
              <CardDescription>Pratiquez avec des simulations sans pression</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/worker/simulation">
                <Button variant="secondary" className="w-full">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Simulation d'entraînement
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Finish / Complete Onboarding */}
        <div className="mt-6">
          <Button className="w-full md:w-auto" onClick={() => onComplete && onComplete()}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Terminer l'intégration
          </Button>
        </div>
      </div>
    </div>
  )
}
