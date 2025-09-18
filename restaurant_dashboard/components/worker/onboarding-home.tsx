"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Clock, CheckCircle, AlertCircle, BookOpen } from "lucide-react"
import Link from "next/link"
import { WorkerHeader } from "./worker-header"

export function OnboardingHome() {
  // Mock data - would come from API
  const onboardingProgress = 65
  const recentSessions = [
    { id: "1", recipe: "Poulet rôti express", status: "completed", duration: "12 min" },
    { id: "2", recipe: "Salade César", status: "pending_validation", duration: "8 min" },
    { id: "3", recipe: "Soupe à l'oignon", status: "in_progress", duration: "15 min" },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending_validation":
        return <Clock className="h-4 w-4 text-secondary" />
      case "in_progress":
        return <AlertCircle className="h-4 w-4 text-primary" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé"
      case "pending_validation":
        return "En attente de validation"
      case "in_progress":
        return "En cours"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <WorkerHeader />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <ChefHat className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Formation Culinaire</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Progression Globale
              </CardTitle>
              <CardDescription>Votre avancement dans le programme de formation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progression</span>
                    <span className="font-medium">{onboardingProgress}%</span>
                  </div>
                  <Progress value={onboardingProgress} className="h-3" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">12</div>
                    <div className="text-sm text-muted-foreground">Recettes complétées</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">3</div>
                    <div className="text-sm text-muted-foreground">En attente validation</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Recettes Rapides</CardTitle>
                <CardDescription>Commencez une nouvelle session de formation</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/worker/recipes">
                  <Button size="lg" className="w-full">
                    Démarrer une recette
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">Simulation KDS</CardTitle>
                <CardDescription>Entraînez-vous avec des commandes simulées</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/worker/simulation">
                  <Button variant="secondary" size="lg" className="w-full">
                    Lancer simulation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sessions Récentes</CardTitle>
            <CardDescription>Historique de vos dernières sessions de formation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(session.status)}
                    <div>
                      <div className="font-medium">{session.recipe}</div>
                      <div className="text-sm text-muted-foreground">Durée: {session.duration}</div>
                    </div>
                  </div>
                  <Badge variant={session.status === "completed" ? "default" : "secondary"}>
                    {getStatusText(session.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
