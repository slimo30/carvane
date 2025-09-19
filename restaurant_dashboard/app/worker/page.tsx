"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { CookingPot, Robot, ChefHat as PhChefHat } from "phosphor-react"
import { EnhancedWorkerDashboard } from "@/components/worker/enhanced-worker-dashboard"
import { AIOnboarding } from "@/components/worker/ai-onboarding"

export default function WorkerPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem('onboarding-completed')
    if (completed === 'true') {
      setHasCompletedOnboarding(true)
    }
  }, [])

  const handleStartOnboarding = () => {
    setShowOnboarding(true)
  }

  const handleSkipOnboarding = () => {
    setHasCompletedOnboarding(true)
    localStorage.setItem('onboarding-completed', 'true')
  }

  const handleCompleteOnboarding = () => {
    setHasCompletedOnboarding(true)
    setShowOnboarding(false)
    localStorage.setItem('onboarding-completed', 'true')
  }

  if (showOnboarding) {
    return <AIOnboarding onComplete={handleCompleteOnboarding} />
  }

  if (hasCompletedOnboarding) {
    return <EnhancedWorkerDashboard />
  }

  // Show onboarding choice screen
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
              <PhChefHat size={40} className="text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold mb-4">Bienvenue dans votre cuisine !</CardTitle>
          <CardDescription className="text-lg">
            Choisissez comment vous souhaitez commencer votre expérience culinaire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleStartOnboarding}>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <Robot size={24} className="text-primary" />
                  <CardTitle className="text-xl">Formation guidée</CardTitle>
                </div>
                <CardDescription>
                  Suivez notre formation d'intégration avec l'assistance IA pour découvrir 
                  tous les outils et fonctionnalités disponibles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Assistant IA personnalisé
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CookingPot size={16} className="mr-2" />
                    Première recette guidée
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Formation complète en 30 min
                  </div>
                </div>
                <Button className="w-full mt-4">
                  Commencer la formation
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleSkipOnboarding}>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-2">
                  <PhChefHat size={24} className="text-secondary" />
                  <CardTitle className="text-xl">Commencer directement</CardTitle>
                </div>
                <CardDescription>
                  Accédez directement à votre tableau de bord et commencez à cuisiner 
                  immédiatement. Vous pourrez toujours suivre la formation plus tard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ChefHat className="h-4 w-4 mr-2" />
                    Accès immédiat au tableau de bord
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Toutes les fonctionnalités disponibles
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Formation accessible à tout moment
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Aller au tableau de bord
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Vous pourrez toujours accéder à la formation depuis votre tableau de bord 
              si vous choisissez de commencer directement.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
