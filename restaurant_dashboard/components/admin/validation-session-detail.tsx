"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, Camera, FileText, Star, User } from "lucide-react"

interface ValidationSessionDetailProps {
  sessionId: string
  onValidate: (approved: boolean, feedback: string, score: number) => void
  onClose: () => void
}

export function ValidationSessionDetail({ sessionId, onValidate, onClose }: ValidationSessionDetailProps) {
  const [feedback, setFeedback] = useState("")
  const [score, setScore] = useState(85)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  // Mock session data - would come from API
  const session = {
    id: sessionId,
    employeeName: "Marie Dubois",
    employeeId: "EMP-001",
    type: "KDS Simulation",
    startTime: new Date("2024-01-15T14:30:00"),
    endTime: new Date("2024-01-15T15:45:00"),
    status: "pending",
    overallScore: 87,
    tickets: [
      {
        id: "1",
        orderNumber: "CMD-001",
        items: ["Poulet rôti express", "Salade César"],
        estimatedTime: 25,
        actualTime: 23,
        score: 95,
        photos: ["/plated-chicken-dish.jpg"],
        notes: "Cuisson parfaite, présentation soignée",
        issues: [],
      },
      {
        id: "2",
        orderNumber: "CMD-002",
        items: ["Soupe à l'oignon", "Tarte aux pommes"],
        estimatedTime: 50,
        actualTime: 55,
        score: 80,
        photos: ["/french-onion-soup.png", "/apple-tart.jpg"],
        notes: "Soupe excellente, tarte légèrement trop cuite",
        issues: ["Dépassement de temps", "Cuisson tarte"],
      },
      {
        id: "3",
        orderNumber: "CMD-003",
        items: ["Risotto aux champignons"],
        estimatedTime: 25,
        actualTime: 22,
        score: 90,
        photos: ["/mushroom-risotto.png"],
        notes: "Texture crémeuse parfaite, assaisonnement équilibré",
        issues: [],
      },
    ],
  }

  const handleApprove = () => {
    onValidate(true, feedback, score)
  }

  const handleReject = () => {
    onValidate(false, feedback, score)
  }

  const formatDuration = (start: Date, end: Date) => {
    const diff = Math.round((end.getTime() - start.getTime()) / 1000 / 60)
    return `${diff} minutes`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-yellow-600"
    if (score >= 70) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Validation de Session</h2>
              <p className="text-muted-foreground">Session #{session.id}</p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Session Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informations de Session</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employé:</span>
                    <span className="font-medium">{session.employeeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID:</span>
                    <span>{session.employeeId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="secondary">{session.type}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Durée:</span>
                    <span>{formatDuration(session.startTime, session.endTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Score global:</span>
                    <span className={`font-bold ${getScoreColor(session.overallScore)}`}>{session.overallScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tickets:</span>
                    <span>{session.tickets.length} complétés</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tickets Detail */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Détail des Tickets</h3>
            {session.tickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{ticket.orderNumber}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className={`font-bold ${getScoreColor(ticket.score)}`}>{ticket.score}%</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Articles préparés:</h4>
                      <ul className="space-y-1">
                        {ticket.items.map((item, index) => (
                          <li key={index} className="text-sm">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Temps:</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Estimé:</span>
                          <span>{ticket.estimatedTime} min</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Réel:</span>
                          <span
                            className={ticket.actualTime > ticket.estimatedTime ? "text-red-600" : "text-green-600"}
                          >
                            {ticket.actualTime} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {ticket.photos.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <Camera className="h-4 w-4 mr-1" />
                        Photos ({ticket.photos.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {ticket.photos.map((photo, index) => (
                          <img
                            key={index}
                            src={photo || "/placeholder.svg"}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80"
                            onClick={() => {
                              if (selectedImages.includes(photo)) {
                                setSelectedImages((prev) => prev.filter((p) => p !== photo))
                              } else {
                                setSelectedImages((prev) => [...prev, photo])
                              }
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {ticket.notes && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        Notes de l'employé
                      </h4>
                      <p className="text-sm bg-muted p-3 rounded-lg">{ticket.notes}</p>
                    </div>
                  )}

                  {ticket.issues.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 text-orange-600">Points d'attention:</h4>
                      <ul className="space-y-1">
                        {ticket.issues.map((issue, index) => (
                          <li key={index} className="text-sm text-orange-600">
                            • {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Validation Form */}
          <Card>
            <CardHeader>
              <CardTitle>Évaluation et Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Score final (0-100):</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(Number.parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>0</span>
                  <span className={`font-medium ${getScoreColor(score)}`}>{score}%</span>
                  <span>100</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Commentaires et recommandations:</label>
                <Textarea
                  placeholder="Entrez vos commentaires sur la performance, les points forts et les axes d'amélioration..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={handleApprove} className="flex-1" size="lg">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Valider la session
                </Button>
                <Button onClick={handleReject} variant="destructive" className="flex-1" size="lg">
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeter la session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
