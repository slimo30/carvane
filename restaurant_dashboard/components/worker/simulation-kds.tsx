"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, CheckCircle } from "lucide-react"
import { WorkerHeader } from "./worker-header"
import Link from "next/link"

export function SimulationKDS() {
  const [simulationStatus, setSimulationStatus] = useState<"idle" | "running" | "completed">("idle")
  const [completedTickets, setCompletedTickets] = useState<string[]>([])

  // Mock KDS tickets
  const tickets = [
    {
      id: "1",
      orderNumber: "CMD-001",
      items: ["Poulet rôti express", "Salade César"],
      estimatedTime: 25,
      priority: "normal" as const,
    },
    {
      id: "2",
      orderNumber: "CMD-002",
      items: ["Soupe à l'oignon", "Tarte aux pommes"],
      estimatedTime: 50,
      priority: "high" as const,
    },
    {
      id: "3",
      orderNumber: "CMD-003",
      items: ["Risotto aux champignons"],
      estimatedTime: 25,
      priority: "normal" as const,
    },
    {
      id: "4",
      orderNumber: "CMD-004",
      items: ["Saumon grillé", "Salade César"],
      estimatedTime: 28,
      priority: "urgent" as const,
    },
    {
      id: "5",
      orderNumber: "CMD-005",
      items: ["Poulet rôti express"],
      estimatedTime: 15,
      priority: "normal" as const,
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
  }

  const completeTicket = (ticketId: string) => {
    setCompletedTickets((prev) => [...prev, ticketId])

    // Check if all tickets are completed
    if (completedTickets.length + 1 >= 3) {
      // Complete at least 3 tickets
      setTimeout(() => {
        setSimulationStatus("completed")
      }, 1000)
    }
  }

  const requestValidation = () => {
    alert("Demande de validation envoyée au chef !")
  }

  return (
    <div className="min-h-screen bg-background">
      <WorkerHeader />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Simulation KDS</h1>
          <p className="text-muted-foreground">Entraînez-vous avec des commandes simulées du système KDS</p>
        </div>

        {simulationStatus === "idle" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Prêt pour la simulation ?</CardTitle>
              <CardDescription>
                Vous allez traiter une série de commandes simulées. Complétez au moins 3 tickets pour demander une
                validation.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
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
              </div>
              <Button size="lg" onClick={startSimulation}>
                <Play className="h-5 w-5 mr-2" />
                Démarrer la simulation
              </Button>
            </CardContent>
          </Card>
        )}

        {simulationStatus === "running" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <Badge variant="secondary" className="mb-2">
                  Simulation en cours
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Tickets complétés: {completedTickets.length} / {tickets.length}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.map((ticket) => {
                const isCompleted = completedTickets.includes(ticket.id)

                return (
                  <Card
                    key={ticket.id}
                    className={`transition-all ${
                      isCompleted ? "opacity-60 border-green-200 bg-green-50" : "hover:shadow-lg"
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{ticket.orderNumber}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityColor(ticket.priority)}>{getPriorityLabel(ticket.priority)}</Badge>
                          {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium mb-2">Articles:</div>
                          <ul className="space-y-1">
                            {ticket.items.map((item, index) => (
                              <li key={index} className="text-sm text-muted-foreground">
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {ticket.estimatedTime} min estimées
                        </div>

                        {!isCompleted ? (
                          <Button className="w-full" onClick={() => completeTicket(ticket.id)}>
                            Commencer
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full bg-transparent" disabled>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Terminé
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {simulationStatus === "completed" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">Simulation terminée !</CardTitle>
              <CardDescription>Félicitations ! Vous avez complété {completedTickets.length} tickets.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{completedTickets.length}</div>
                  <div className="text-sm text-muted-foreground">Tickets complétés</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">
                    {Math.round(tickets.reduce((acc, t) => acc + t.estimatedTime, 0) / tickets.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">Temps moyen (min)</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button size="lg" onClick={requestValidation}>
                  Demander validation
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
                    }}
                    className="flex-1"
                  >
                    Refaire simulation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
