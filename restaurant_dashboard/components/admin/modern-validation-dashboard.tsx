"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, Clock, Camera, FileText, Search, User, Award } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ValidationRequest {
  id: string
  sessionId: string
  employeeId: string
  employeeName: string
  recipeName: string
  requestedAt: string
  sessionData: {
    duration: number
    estimatedDuration: number
    completedSteps: number
    totalSteps: number
    score: number
    photos: string[]
    notes: string
    problems: number
    timeline: Array<{
      step: number
      duration: number
      expected: number
      status: string
    }>
  }
  additionalNotes?: string
  priority: "normal" | "high" | "urgent"
}

export default function ModernValidationDashboard() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [validationAction, setValidationAction] = useState<"approve" | "reject" | null>(null)
  const [feedback, setFeedback] = useState("")
  const [finalScore, setFinalScore] = useState(85)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  const validationRequests: ValidationRequest[] = [
    {
      id: "val-001",
      sessionId: "session-123",
      employeeId: "emp-001",
      employeeName: "Marie Dubois",
      recipeName: "Poulet Rôti Express",
      requestedAt: "2024-01-15T14:30:00Z",
      priority: "normal",
      sessionData: {
        duration: 18,
        estimatedDuration: 15,
        completedSteps: 5,
        totalSteps: 5,
        score: 87,
        photos: ["/roasted-chicken-with-vegetables.jpg", "/plated-dish.jpg"],
        notes: "Cuisson parfaite, présentation soignée. Légumes bien dorés.",
        problems: 0,
        timeline: [
          { step: 1, duration: 125, expected: 120, status: "completed" },
          { step: 2, duration: 195, expected: 180, status: "completed" },
          { step: 3, duration: 65, expected: 60, status: "completed" },
          { step: 4, duration: 720, expected: 720, status: "completed" },
          { step: 5, duration: 115, expected: 120, status: "completed" },
        ],
      },
      additionalNotes: "Première fois que je prépare ce plat, très satisfait du résultat !",
    },
    {
      id: "val-002",
      sessionId: "session-124",
      employeeId: "emp-002",
      employeeName: "Jean Martin",
      recipeName: "Salade César",
      requestedAt: "2024-01-15T15:45:00Z",
      priority: "high",
      sessionData: {
        duration: 12,
        estimatedDuration: 10,
        completedSteps: 4,
        totalSteps: 4,
        score: 92,
        photos: ["/caesar-salad.jpg"],
        notes: "Sauce parfaitement émulsionnée, croûtons croustillants.",
        problems: 0,
        timeline: [
          { step: 1, duration: 90, expected: 120, status: "completed" },
          { step: 2, duration: 200, expected: 180, status: "completed" },
          { step: 3, duration: 180, expected: 180, status: "completed" },
          { step: 4, duration: 150, expected: 120, status: "completed" },
        ],
      },
    },
    {
      id: "val-003",
      sessionId: "session-125",
      employeeId: "emp-003",
      employeeName: "Sophie Laurent",
      recipeName: "Risotto aux Champignons",
      requestedAt: "2024-01-15T16:20:00Z",
      priority: "urgent",
      sessionData: {
        duration: 28,
        estimatedDuration: 25,
        completedSteps: 6,
        totalSteps: 6,
        score: 78,
        photos: ["/mushroom-risotto.jpg"],
        notes: "Texture crémeuse obtenue, mais champignons légèrement trop cuits.",
        problems: 1,
        timeline: [
          { step: 1, duration: 140, expected: 120, status: "completed" },
          { step: 2, duration: 190, expected: 180, status: "completed" },
          { step: 3, duration: 300, expected: 240, status: "completed" },
          { step: 4, duration: 480, expected: 600, status: "completed" },
          { step: 5, duration: 200, expected: 180, status: "completed" },
          { step: 6, duration: 130, expected: 120, status: "completed" },
        ],
      },
      additionalNotes: "J'ai eu des difficultés avec la cuisson des champignons, ils ont un peu brûlé.",
    },
  ]

  const filteredRequests = validationRequests.filter((request) => {
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.recipeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || request.priority === filterPriority
    return matchesSearch && matchesPriority
  })

  const selectedRequestData = validationRequests.find((r) => r.id === selectedRequest)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-orange-600"
    return "text-red-600"
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

  const handleValidation = async (action: "approve" | "reject") => {
    if (!selectedRequestData) return

    const validationData = {
      sessionId: selectedRequestData.sessionId,
      action,
      feedback,
      finalScore,
      reviewedAt: new Date().toISOString(),
    }

    console.log("[Validation]", validationData)

    if (action === "approve") {
      alert(`Session de ${selectedRequestData.employeeName} approuvée ! Badge généré et envoyé.`)
    } else {
      alert(`Session de ${selectedRequestData.employeeName} rejetée. L'employé a été notifié.`)
    }

    setSelectedRequest(null)
    setValidationAction(null)
    setFeedback("")
    setFinalScore(85)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Validation Dashboard</h2>
          <p className="text-gray-600">{filteredRequests.length} demandes en attente de validation</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 rounded-2xl"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-2xl bg-white"
          >
            <option value="all">Toutes priorités</option>
            <option value="urgent">Urgent</option>
            <option value="high">Élevée</option>
            <option value="normal">Normale</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredRequests.map((request) => (
          <Card
            key={request.id}
            className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{request.employeeName}</h3>
                    <p className="text-gray-600">{request.recipeName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge className={`${getPriorityColor(request.priority)} border font-medium`}>
                    {request.priority.toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDate(request.requestedAt)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{request.sessionData.duration} min</div>
                  <div className="text-sm text-gray-600">Durée</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(request.sessionData.score)}`}>
                    {request.sessionData.score}%
                  </div>
                  <div className="text-sm text-gray-600">Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {request.sessionData.completedSteps}/{request.sessionData.totalSteps}
                  </div>
                  <div className="text-sm text-gray-600">Étapes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{request.sessionData.photos.length}</div>
                  <div className="text-sm text-gray-600">Photos</div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${request.sessionData.problems > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {request.sessionData.problems}
                  </div>
                  <div className="text-sm text-gray-600">Problèmes</div>
                </div>
              </div>

              {request.sessionData.photos.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <Camera className="w-4 h-4 mr-2" />
                    Photos de la session
                  </h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {request.sessionData.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-16 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {(request.sessionData.notes || request.additionalNotes) && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Notes de l'employé
                  </h4>
                  <div className="space-y-2">
                    {request.sessionData.notes && (
                      <div className="bg-gray-50 rounded-2xl p-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">Notes de session</div>
                        <p className="text-sm text-gray-600">{request.sessionData.notes}</p>
                      </div>
                    )}
                    {request.additionalNotes && (
                      <div className="bg-blue-50 rounded-2xl p-4">
                        <div className="text-sm font-medium text-blue-700 mb-1">Commentaires additionnels</div>
                        <p className="text-sm text-blue-600">{request.additionalNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedRequest(request.id)} className="flex-1 rounded-2xl">
                  Voir détails
                </Button>
                <Button
                  onClick={() => {
                    setSelectedRequest(request.id)
                    setValidationAction("approve")
                    setFinalScore(request.sessionData.score)
                  }}
                  className="flex-1 bg-green-500 hover:bg-green-600 rounded-2xl"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approuver
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedRequest(request.id)
                    setValidationAction("reject")
                    setFinalScore(request.sessionData.score)
                  }}
                  className="flex-1 rounded-2xl"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Rejeter
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!selectedRequest}
        onOpenChange={() => {
          setSelectedRequest(null)
          setValidationAction(null)
          setFeedback("")
          setFinalScore(85)
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {validationAction === "approve"
                ? "Approuver la session"
                : validationAction === "reject"
                  ? "Rejeter la session"
                  : "Détails de la session"}
            </DialogTitle>
            <DialogDescription>
              {selectedRequestData && (
                <>
                  Session de {selectedRequestData.employeeName} - {selectedRequestData.recipeName}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedRequestData && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedRequestData.sessionData.duration} min</div>
                  <div className="text-sm text-gray-600">Durée réelle</div>
                  <div className="text-xs text-gray-500">
                    (estimé: {selectedRequestData.sessionData.estimatedDuration} min)
                  </div>
                </Card>
                <Card className="p-4 text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(selectedRequestData.sessionData.score)}`}>
                    {selectedRequestData.sessionData.score}%
                  </div>
                  <div className="text-sm text-gray-600">Score auto</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedRequestData.sessionData.completedSteps}/{selectedRequestData.sessionData.totalSteps}
                  </div>
                  <div className="text-sm text-gray-600">Étapes</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedRequestData.sessionData.photos.length}
                  </div>
                  <div className="text-sm text-gray-600">Photos</div>
                </Card>
              </div>

              <div>
                <h4 className="font-medium mb-3">Timeline détaillée</h4>
                <div className="space-y-2">
                  {selectedRequestData.sessionData.timeline.map((step, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-2xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium">Étape {step.step}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>
                          Réalisé:{" "}
                          <span className={getScoreColor((step.expected / step.duration) * 100)}>
                            {formatDuration(step.duration)}
                          </span>
                        </span>
                        <span className="text-gray-500">Attendu: {formatDuration(step.expected)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {validationAction && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Score final (0-100):</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={finalScore}
                      onChange={(e) => setFinalScore(Number.parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>0</span>
                      <span className={`font-medium ${getScoreColor(finalScore)}`}>{finalScore}%</span>
                      <span>100</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {validationAction === "approve"
                        ? "Commentaires et félicitations"
                        : "Raison du rejet et conseils d'amélioration"}
                    </label>
                    <Textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder={
                        validationAction === "approve"
                          ? "Excellente performance ! Continuez ainsi..."
                          : "Points à améliorer : cuisson des légumes, présentation..."
                      }
                      rows={4}
                      className="rounded-2xl"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedRequest(null)
                setValidationAction(null)
                setFeedback("")
                setFinalScore(85)
              }}
              className="rounded-2xl"
            >
              Annuler
            </Button>

            {validationAction && (
              <Button
                variant={validationAction === "approve" ? "default" : "destructive"}
                onClick={() => handleValidation(validationAction)}
                disabled={validationAction === "reject" && !feedback.trim()}
                className="rounded-2xl"
              >
                {validationAction === "approve" ? (
                  <>
                    <Award className="w-4 h-4 mr-2" />
                    Valider et générer badge
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeter avec feedback
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
