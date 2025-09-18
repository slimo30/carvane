"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  Play,
  CheckCircle,
  Camera,
  AlertTriangle,
  Star,
  Timer,
  Users,
  TrendingUp,
  ArrowLeft,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface KDSTicket {
  id: string
  orderNumber: string
  customerName: string
  items: Array<{
    name: string
    quantity: number
    specialInstructions?: string
    allergens?: string[]
  }>
  estimatedTime: number
  priority: "normal" | "high" | "urgent"
  orderTime: Date
  startTime?: Date
  completionTime?: Date
  photos?: string[]
  notes?: string
  score?: number
  status: "pending" | "in-progress" | "completed"
}

interface SimulationScenario {
  id: string
  name: string
  description: string
  difficulty: "Facile" | "Moyen" | "Difficile"
  duration: number
  ticketCount: number
  rushPeriod: boolean
}

export default function ModernKDSSimulation() {
  const router = useRouter()
  const [simulationStatus, setSimulationStatus] = useState<"idle" | "scenario-select" | "running" | "completed">("idle")
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario | null>(null)
  const [tickets, setTickets] = useState<KDSTicket[]>([])
  const [completedTickets, setCompletedTickets] = useState<KDSTicket[]>([])
  const [activeTickets, setActiveTickets] = useState<KDSTicket[]>([])
  const [simulationScore, setSimulationScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [rushMode, setRushMode] = useState(false)

  const scenarios: SimulationScenario[] = [
    {
      id: "beginner",
      name: "Service Calme",
      description: "Période tranquille avec 3-4 commandes simples",
      difficulty: "Facile",
      duration: 20,
      ticketCount: 4,
      rushPeriod: false,
    },
    {
      id: "lunch-rush",
      name: "Rush du Déjeuner",
      description: "Période d'affluence avec 6-8 commandes simultanées",
      difficulty: "Moyen",
      duration: 35,
      ticketCount: 8,
      rushPeriod: true,
    },
    {
      id: "dinner-peak",
      name: "Pic du Dîner",
      description: "Service intense avec 10+ commandes et priorités urgentes",
      difficulty: "Difficile",
      duration: 45,
      ticketCount: 12,
      rushPeriod: true,
    },
  ]

  const generateTickets = (scenario: SimulationScenario): KDSTicket[] => {
    const mockItems = [
      { name: "Poulet Rôti Express", time: 15, allergens: ["gluten"] },
      { name: "Salade César", time: 8, allergens: ["gluten", "œufs"] },
      { name: "Soupe à l'Oignon", time: 12, allergens: ["lactose"] },
      { name: "Risotto aux Champignons", time: 25, allergens: ["lactose"] },
      { name: "Saumon Grillé", time: 18, allergens: ["poisson"] },
      { name: "Tarte aux Pommes", time: 30, allergens: ["gluten", "œufs", "lactose"] },
    ]

    const priorities = scenario.rushPeriod ? ["normal", "high", "urgent", "urgent"] : ["normal", "normal", "high"]

    const specialInstructions = [
      "Bien cuit",
      "Cuisson à point",
      "Sans sel",
      "Extra sauce",
      "Servir tiède",
      "Extra parmesan",
      "Sans oignon",
    ]

    return Array.from({ length: scenario.ticketCount }, (_, i) => {
      const itemCount = Math.floor(Math.random() * 3) + 1
      const selectedItems = Array.from({ length: itemCount }, () => {
        const item = mockItems[Math.floor(Math.random() * mockItems.length)]
        return {
          name: item.name,
          quantity: Math.floor(Math.random() * 2) + 1,
          specialInstructions:
            Math.random() > 0.7
              ? specialInstructions[Math.floor(Math.random() * specialInstructions.length)]
              : undefined,
          allergens: item.allergens,
        }
      })

      const estimatedTime = selectedItems.reduce(
        (acc, item) => acc + (mockItems.find((m) => m.name === item.name)?.time || 15),
        0,
      )

      return {
        id: `ticket-${i + 1}`,
        orderNumber: `CMD-${String(i + 1).padStart(3, "0")}`,
        customerName: `Client ${i + 1}`,
        items: selectedItems,
        estimatedTime,
        priority: priorities[Math.floor(Math.random() * priorities.length)] as "normal" | "high" | "urgent",
        orderTime: new Date(Date.now() - Math.random() * 300000), // Random time in last 5 minutes
        status: "pending",
      }
    })
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (simulationStatus === "running") {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1)

        // Simulate rush periods
        if (selectedScenario?.rushPeriod && timeElapsed > 300 && timeElapsed < 900) {
          setRushMode(true)
        } else {
          setRushMode(false)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [simulationStatus, timeElapsed, selectedScenario])

  const startScenario = (scenario: SimulationScenario) => {
    setSelectedScenario(scenario)
    const generatedTickets = generateTickets(scenario)
    setTickets(generatedTickets)
    setCompletedTickets([])
    setActiveTickets([])
    setSimulationScore(0)
    setTimeElapsed(0)
    setSimulationStatus("running")
  }

  const startTicket = (ticket: KDSTicket) => {
    const updatedTicket = {
      ...ticket,
      status: "in-progress" as const,
      startTime: new Date(),
    }

    setTickets((prev) => prev.map((t) => (t.id === ticket.id ? updatedTicket : t)))
    setActiveTickets((prev) => [...prev, updatedTicket])
  }

  const completeTicket = (ticketId: string, photos: string[] = [], notes = "") => {
    const ticket = tickets.find((t) => t.id === ticketId)
    if (!ticket) return

    const completionTime = new Date()
    const actualTime = ticket.startTime
      ? Math.round((completionTime.getTime() - ticket.startTime.getTime()) / 1000 / 60)
      : ticket.estimatedTime

    let score = 100
    const timeVariance = Math.abs(actualTime - ticket.estimatedTime) / ticket.estimatedTime

    if (timeVariance > 0.3)
      score -= 25 // Significant time variance
    else if (timeVariance > 0.15) score -= 10 // Minor time variance

    if (photos.length === 0) score -= 20 // No photo penalty
    if (!notes.trim()) score -= 10 // No notes penalty
    if (ticket.priority === "urgent" && actualTime > ticket.estimatedTime) score -= 15 // Urgent order late

    // Rush period bonus/penalty
    if (rushMode) {
      if (actualTime <= ticket.estimatedTime)
        score += 10 // Rush period bonus
      else score -= 20 // Rush period penalty
    }

    const completedTicket: KDSTicket = {
      ...ticket,
      status: "completed",
      completionTime,
      photos,
      notes,
      score: Math.max(0, score),
    }

    setTickets((prev) => prev.map((t) => (t.id === ticketId ? completedTicket : t)))
    setActiveTickets((prev) => prev.filter((t) => t.id !== ticketId))
    setCompletedTickets((prev) => [...prev, completedTicket])

    // Update simulation score
    const allCompleted = [...completedTickets, completedTicket]
    const avgScore = allCompleted.reduce((acc, t) => acc + (t.score || 0), 0) / allCompleted.length
    setSimulationScore(Math.round(avgScore))

    // Check completion
    if (allCompleted.length >= (selectedScenario?.ticketCount || 0)) {
      setTimeout(() => setSimulationStatus("completed"), 1000)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScenarioColor = (difficulty: string) => {
    switch (difficulty) {
      case "Facile":
        return "bg-green-100 text-green-800 border-green-200"
      case "Moyen":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Difficile":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-xl">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Simulation KDS</h1>
                <p className="text-sm text-gray-600">Entraînement Kitchen Display System</p>
              </div>
            </div>

            {simulationStatus === "running" && (
              <div className="flex items-center gap-6">
                {rushMode && <Badge className="bg-red-100 text-red-800 border-red-200 animate-pulse">🔥 RUSH</Badge>}
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">{formatTime(timeElapsed)}</div>
                  <div className="text-xs text-gray-600">Temps écoulé</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{simulationScore}%</div>
                  <div className="text-xs text-gray-600">Score</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {simulationStatus === "idle" && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choisissez votre Scénario</h2>
            <p className="text-gray-600 mb-8">Sélectionnez un niveau de difficulté pour commencer l'entraînement</p>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {scenarios.map((scenario) => (
                <Card
                  key={scenario.id}
                  className="cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden"
                  onClick={() => startScenario(scenario)}
                >
                  <div className="p-6">
                    <div className="mb-4">
                      <Badge className={`${getScenarioColor(scenario.difficulty)} border font-medium mb-3`}>
                        {scenario.difficulty}
                      </Badge>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{scenario.name}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{scenario.description}</p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-gray-600">
                          <Timer className="w-4 h-4 mr-2" />
                          Durée
                        </span>
                        <span className="font-medium">{scenario.duration} min</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          Commandes
                        </span>
                        <span className="font-medium">{scenario.ticketCount} tickets</span>
                      </div>
                      {scenario.rushPeriod && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center text-orange-600">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Rush
                          </span>
                          <span className="font-medium text-orange-600">Oui</span>
                        </div>
                      )}
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl">
                      <Play className="w-5 h-5 mr-2" />
                      Commencer
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {simulationStatus === "running" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {tickets.filter((t) => t.status === "pending").length}
                  </div>
                  <div className="text-sm text-gray-600">En attente</div>
                </div>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{activeTickets.length}</div>
                  <div className="text-sm text-gray-600">En cours</div>
                </div>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{completedTickets.length}</div>
                  <div className="text-sm text-gray-600">Terminés</div>
                </div>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{simulationScore}%</div>
                  <div className="text-sm text-gray-600">Performance</div>
                </div>
              </Card>
            </div>

            <Progress value={(completedTickets.length / tickets.length) * 100} className="h-3 rounded-full" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tickets
                .filter((t) => t.status !== "completed")
                .sort((a, b) => {
                  const priorityOrder = { urgent: 3, high: 2, normal: 1 }
                  return priorityOrder[b.priority] - priorityOrder[a.priority]
                })
                .map((ticket) => (
                  <Card
                    key={ticket.id}
                    className={`
                      transition-all duration-300 border-0 shadow-lg rounded-2xl overflow-hidden
                      ${
                        ticket.status === "in-progress"
                          ? "bg-blue-50 border-l-4 border-l-blue-500 shadow-xl"
                          : "bg-white/80 backdrop-blur-sm hover:shadow-xl"
                      }
                      ${ticket.priority === "urgent" ? "ring-2 ring-red-200" : ""}
                    `}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-lg">{ticket.orderNumber}</div>
                        <Badge className={`${getPriorityColor(ticket.priority)} border text-xs`}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">{ticket.customerName}</div>

                      <div className="space-y-2 mb-4">
                        {ticket.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            <div className="font-medium">
                              {item.quantity}x {item.name}
                            </div>
                            {item.specialInstructions && (
                              <div className="text-xs text-orange-600 flex items-center mt-1">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                {item.specialInstructions}
                              </div>
                            )}
                            {item.allergens && item.allergens.length > 0 && (
                              <div className="text-xs text-red-600 mt-1">⚠️ {item.allergens.join(", ")}</div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {ticket.estimatedTime} min
                        </span>
                        <span>{new Date(ticket.orderTime).toLocaleTimeString()}</span>
                      </div>

                      {ticket.status === "pending" ? (
                        <Button
                          onClick={() => startTicket(ticket)}
                          className="w-full bg-green-500 hover:bg-green-600 rounded-xl"
                          size="sm"
                        >
                          Commencer
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-xs text-blue-600 font-medium text-center">En cours...</div>
                          <Button
                            onClick={() => {
                              const photo = `photo_${Date.now()}.jpg`
                              const notes = prompt("Notes sur la préparation:") || ""
                              completeTicket(ticket.id, [photo], notes)
                            }}
                            className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl"
                            size="sm"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Terminer
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {simulationStatus === "completed" && (
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="text-center p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Simulation Terminée !</h2>
                <p className="text-gray-600 mb-8">
                  Excellent travail ! Vous avez complété le scénario "{selectedScenario?.name}"
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{completedTickets.length}</div>
                    <div className="text-sm text-gray-600">Tickets complétés</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{simulationScore}%</div>
                    <div className="text-sm text-gray-600">Score final</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{formatTime(timeElapsed)}</div>
                    <div className="text-sm text-gray-600">Temps total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {completedTickets.filter((t) => t.photos && t.photos.length > 0).length}
                    </div>
                    <div className="text-sm text-gray-600">Photos prises</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <h3 className="font-bold text-lg mb-4">Détails de Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completedTickets.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-3 bg-white rounded-xl">
                        <div className="text-left">
                          <div className="font-medium">{ticket.orderNumber}</div>
                          <div className="text-sm text-gray-600">{ticket.customerName}</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-bold">{ticket.score}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => {
                      setSimulationStatus("idle")
                      setCompletedTickets([])
                      setActiveTickets([])
                      setTickets([])
                    }}
                    className="bg-blue-500 hover:bg-blue-600 rounded-2xl px-8"
                  >
                    Nouveau Scénario
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/worker/validation")}
                    className="rounded-2xl px-8"
                  >
                    Demander Validation
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
