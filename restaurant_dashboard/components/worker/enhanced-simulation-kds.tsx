"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Play, CheckCircle, Camera, Mic, AlertTriangle, Star } from "lucide-react"
import { WorkerHeader } from "./worker-header"
import { MultiTimerDisplay } from "./multi-timer-display"
import { EnhancedVoiceOverlay } from "./enhanced-voice-overlay"
import Link from "next/link"

interface SimulationTicket {
  id: string
  orderNumber: string
  items: Array<{
    name: string
    quantity: number
    specialInstructions?: string
  }>
  estimatedTime: number
  priority: "normal" | "high" | "urgent"
  startTime?: Date
  completionTime?: Date
  photos?: string[]
  notes?: string
  score?: number
}

export function EnhancedSimulationKDS() {
  const [simulationStatus, setSimulationStatus] = useState<"idle" | "running" | "completed" | "validation">("idle")
  const [completedTickets, setCompletedTickets] = useState<SimulationTicket[]>([])
  const [activeTicket, setActiveTicket] = useState<SimulationTicket | null>(null)
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false)
  const [simulationScore, setSimulationScore] = useState(0)
  const [validationRequested, setValidationRequested] = useState(false)

  const tickets: SimulationTicket[] = [
    {
      id: "1",
      orderNumber: "CMD-001",
      items: [
        { name: "Poulet rôti express", quantity: 1, specialInstructions: "Bien cuit" },
        { name: "Salade César", quantity: 1 },
      ],
      estimatedTime: 25,
      priority: "normal",
    },
    {
      id: "2",
      orderNumber: "CMD-002",
      items: [
        { name: "Soupe à l'oignon", quantity: 2 },
        { name: "Tarte aux pommes", quantity: 1, specialInstructions: "Servir tiède" },
      ],
      estimatedTime: 50,
      priority: "high",
    },
    {
      id: "3",
      orderNumber: "CMD-003",
      items: [{ name: "Risotto aux champignons", quantity: 1, specialInstructions: "Extra parmesan" }],
      estimatedTime: 25,
      priority: "normal",
    },
    {
      id: "4",
      orderNumber: "CMD-004",
      items: [
        { name: "Saumon grillé", quantity: 1, specialInstructions: "Cuisson à point" },
        { name: "Légumes de saison", quantity: 1 },
      ],
      estimatedTime: 28,
      priority: "urgent",
    },
    {
      id: "5",
      orderNumber: "CMD-005",
      items: [{ name: "Poulet rôti express", quantity: 2 }],
      estimatedTime: 15,
      priority: "normal",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "secondary"
      default:
        return "default"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Urgent"
      case "high":
        return "Priorité"
      default:
        return "Normal"
    }
  }

  const startSimulation = () => {
    setSimulationStatus("running")
    setCompletedTickets([])
    setSimulationScore(0)
  }

  const startTicket = (ticket: SimulationTicket) => {
    const updatedTicket = {
      ...ticket,
      startTime: new Date(),
    }
    setActiveTicket(updatedTicket)
  }

  const completeTicket = (ticket: SimulationTicket, photos: string[] = [], notes = "") => {
    const completionTime = new Date()
    const actualTime = ticket.startTime
      ? Math.round((completionTime.getTime() - ticket.startTime.getTime()) / 1000 / 60)
      : ticket.estimatedTime

    let score = 100
    if (actualTime > ticket.estimatedTime * 1.2) score -= 20 // Over time penalty
    if (actualTime < ticket.estimatedTime * 0.8) score -= 10 // Too fast penalty
    if (photos.length === 0) score -= 15 // No photo penalty
    if (!notes.trim()) score -= 10 // No notes penalty

    const completedTicket: SimulationTicket = {
      ...ticket,
      completionTime,
      photos,
      notes,
      score: Math.max(0, score),
    }

    setCompletedTickets((prev) => [...prev, completedTicket])
    setActiveTicket(null)

    // Update overall simulation score
    const newAvgScore =
      [...completedTickets, completedTicket].reduce((acc, t) => acc + (t.score || 0), 0) / (completedTickets.length + 1)
    setSimulationScore(Math.round(newAvgScore))

    // Check if simulation is complete
    if (completedTickets.length + 1 >= 3) {
      setTimeout(() => {
        setSimulationStatus("completed")
      }, 1000)
    }
  }

  const requestValidation = () => {
    setValidationRequested(true)
    setSimulationStatus("validation")

    // Mock API call to request validation
    setTimeout(() => {
      alert("Demande de validation envoyée au chef ! Vous recevrez une notification une fois validée.")
    }, 1000)
  }

  const takePhoto = () => {
    // Mock photo capture
    const mockPhoto = `photo_${Date.now()}.jpg`
    return mockPhoto
  }

  return (
    <div className="min-h-screen bg-background">
      <WorkerHeader />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Simulation KDS Avancée</h1>
          <p className="text-muted-foreground">Entraînement complet avec photos, notes et évaluation de performance</p>
        </div>

        {simulationStatus === "idle" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Simulation KDS Complète</CardTitle>
              <CardDescription>
                Simulation avancée avec prise de photos, notes et évaluation de performance. Complétez au moins 3
                tickets pour demander une validation.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div>
                  <div className="text-2xl font-bold text-primary">{tickets.length}</div>
                  <div className="text-sm text-muted-foreground">Tickets disponibles</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">3</div>
                  <div className="text-sm text-muted-foreground">Minimum requis</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">~45</div>
                  <div className="text-sm text-muted-foreground">Minutes estimées</div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Critères d'évaluation:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Respect des temps de préparation</li>
                  <li>• Prise de photos du plat fini</li>
                  <li>• Notes sur la préparation</li>
                  <li>• Suivi des instructions spéciales</li>
                </ul>
              </div>

              <Button size="lg" onClick={startSimulation}>
                <Play className="h-5 w-5 mr-2" />
                Démarrer la simulation
              </Button>
            </CardContent>
          </Card>
        )}

        {simulationStatus === "running" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">
                  Simulation en cours
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Tickets complétés: {completedTickets.length} / {tickets.length}
                </div>
                <Progress value={(completedTickets.length / tickets.length) * 100} className="w-48 mt-2" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{simulationScore}%</div>
                <div className="text-sm text-muted-foreground">Score moyen</div>
              </div>
            </div>

            {/* Active Ticket Detail */}
            {activeTicket && (
              <Card className="border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Ticket Actif: {activeTicket.orderNumber}</CardTitle>
                    <Badge variant={getPriorityColor(activeTicket.priority)}>
                      {getPriorityLabel(activeTicket.priority)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Articles à préparer:</h4>
                    {activeTicket.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                        <div>
                          <span className="font-medium">
                            {item.quantity}x {item.name}
                          </span>
                          {item.specialInstructions && (
                            <div className="text-sm text-orange-600 flex items-center mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              {item.specialInstructions}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {activeTicket.estimatedTime} min estimées
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowVoiceOverlay(true)}>
                      <Mic className="h-4 w-4 mr-2" />
                      Assistant vocal
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        const photo = takePhoto()
                        const notes = prompt("Notes sur la préparation:") || ""
                        completeTicket(activeTicket, [photo], notes)
                      }}
                      className="flex-1"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Terminer avec photo
                    </Button>
                    <Button variant="outline" onClick={() => completeTicket(activeTicket)} className="flex-1">
                      Terminer sans photo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timer Display */}
            <MultiTimerDisplay
              stepTimers={
                activeTicket
                  ? [
                      {
                        name: `Timer ${activeTicket.orderNumber}`,
                        duration: activeTicket.estimatedTime * 60,
                        autoStart: true,
                      },
                    ]
                  : []
              }
            />

            {/* Available Tickets */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets
                .filter(
                  (ticket) => !completedTickets.find((ct) => ct.id === ticket.id) && ticket.id !== activeTicket?.id,
                )
                .map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-lg transition-all">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{ticket.orderNumber}</CardTitle>
                        <Badge variant={getPriorityColor(ticket.priority)}>{getPriorityLabel(ticket.priority)}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium mb-2">Articles:</div>
                          <ul className="space-y-1">
                            {ticket.items.map((item, index) => (
                              <li key={index} className="text-sm">
                                {item.quantity}x {item.name}
                                {item.specialInstructions && (
                                  <div className="text-xs text-orange-600 ml-2">⚠ {item.specialInstructions}</div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {ticket.estimatedTime} min estimées
                        </div>

                        <Button className="w-full" onClick={() => startTicket(ticket)} disabled={!!activeTicket}>
                          {activeTicket ? "Terminez le ticket actuel" : "Commencer"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Completed Tickets Summary */}
            {completedTickets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tickets Complétés ({completedTickets.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedTickets.map((ticket) => (
                      <div key={ticket.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{ticket.orderNumber}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-medium">{ticket.score}%</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {ticket.photos?.length || 0} photo(s) • {ticket.notes ? "Notes incluses" : "Pas de notes"}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {simulationStatus === "completed" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">Simulation Terminée !</CardTitle>
              <CardDescription>
                Excellent travail ! Vous avez complété {completedTickets.length} tickets avec un score moyen de{" "}
                {simulationScore}%.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{completedTickets.length}</div>
                  <div className="text-sm text-muted-foreground">Tickets complétés</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{simulationScore}%</div>
                  <div className="text-sm text-muted-foreground">Score moyen</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">
                    {completedTickets.filter((t) => t.photos && t.photos.length > 0).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Photos prises</div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Détails de Performance:</h4>
                <div className="space-y-2 text-sm">
                  {completedTickets.map((ticket) => (
                    <div key={ticket.id} className="flex justify-between">
                      <span>{ticket.orderNumber}</span>
                      <span className="font-medium">{ticket.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button size="lg" onClick={requestValidation} disabled={validationRequested}>
                {validationRequested ? "Validation demandée" : "Demander validation"}
              </Button>

              <div className="flex space-x-2">
                <Link href="/worker/recipes" className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    Nouvelle recette
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSimulationStatus("idle")
                    setCompletedTickets([])
                    setValidationRequested(false)
                  }}
                  className="flex-1"
                >
                  Refaire simulation
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {simulationStatus === "validation" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Validation en Attente</CardTitle>
              <CardDescription>
                Votre simulation a été envoyée pour validation. Un chef examinera votre travail.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">En attente de validation...</p>
              </div>

              <Link href="/worker">
                <Button variant="outline">Retour à l'accueil</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Voice Overlay */}
        {showVoiceOverlay && activeTicket && (
          <EnhancedVoiceOverlay
            currentStep={{
              id: activeTicket.id,
              instruction: `Préparez ${activeTicket.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}`,
              index: 1,
              voicePrompt: `Commencez la préparation du ticket ${activeTicket.orderNumber}`,
            }}
            onNext={() => setShowVoiceOverlay(false)}
            onRepeat={() => {}}
            onClose={() => setShowVoiceOverlay(false)}
          />
        )}
      </div>
    </div>
  )
}
