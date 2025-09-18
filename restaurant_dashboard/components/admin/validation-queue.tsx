"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, Clock, Play, User, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AdminLayout } from "./admin-layout"

export function ValidationQueue() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [validationNote, setValidationNote] = useState("")
  const [validationAction, setValidationAction] = useState<"approve" | "reject" | null>(null)

  // Mock data - would come from API
  const pendingValidations = [
    {
      id: "1",
      sessionId: "session-1",
      employeeId: "1",
      employeeName: "Marie Dubois",
      recipeName: "Poulet rôti express",
      requestedAt: "2024-01-15T10:30:00Z",
      actualDuration: 18,
      estimatedDuration: 15,
      completedSteps: 5,
      totalSteps: 5,
      problems: 0,
      timeline: [
        { step: 1, duration: 125, expected: 120, status: "completed" },
        { step: 2, duration: 195, expected: 180, status: "completed" },
        { step: 3, duration: 65, expected: 60, status: "completed" },
        { step: 4, duration: 720, expected: 720, status: "completed" },
        { step: 5, duration: 115, expected: 120, status: "completed" },
      ],
    },
    {
      id: "2",
      sessionId: "session-2",
      employeeId: "3",
      employeeName: "Sophie Laurent",
      recipeName: "Salade César",
      requestedAt: "2024-01-15T11:45:00Z",
      actualDuration: 12,
      estimatedDuration: 10,
      completedSteps: 4,
      totalSteps: 4,
      problems: 1,
      timeline: [
        { step: 1, duration: 90, expected: 120, status: "completed" },
        { step: 2, duration: 200, expected: 180, status: "completed" },
        { step: 3, duration: 240, expected: 180, status: "completed" },
        { step: 4, duration: 190, expected: 120, status: "completed" },
      ],
    },
    {
      id: "3",
      sessionId: "session-3",
      employeeId: "4",
      employeeName: "Pierre Durand",
      recipeName: "Soupe à l'oignon",
      requestedAt: "2024-01-15T09:15:00Z",
      actualDuration: 22,
      estimatedDuration: 20,
      completedSteps: 6,
      totalSteps: 6,
      problems: 0,
      timeline: [
        { step: 1, duration: 140, expected: 120, status: "completed" },
        { step: 2, duration: 190, expected: 180, status: "completed" },
        { step: 3, duration: 300, expected: 240, status: "completed" },
        { step: 4, duration: 480, expected: 600, status: "completed" },
        { step: 5, duration: 180, expected: 180, status: "completed" },
        { step: 6, duration: 130, expected: 120, status: "completed" },
      ],
    },
  ]

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

  const getPerformanceColor = (actual: number, expected: number) => {
    const ratio = actual / expected
    if (ratio <= 1.1) return "text-green-600"
    if (ratio <= 1.3) return "text-amber-600"
    return "text-red-600"
  }

  const handleValidation = async (action: "approve" | "reject") => {
    if (!selectedSession) return

    const session = pendingValidations.find((v) => v.id === selectedSession)
    if (!session) return

    try {
      // Mock API call
      const validationData = {
        sessionId: session.sessionId,
        action,
        note: validationNote,
        reviewedAt: new Date().toISOString(),
      }

      console.log("[Validation]", validationData)

      if (action === "approve") {
        alert(`Session de ${session.employeeName} approuvée ! Badge généré et envoyé.`)
      } else {
        alert(`Session de ${session.employeeName} rejetée. L'employé a été notifié.`)
      }

      setSelectedSession(null)
      setValidationNote("")
      setValidationAction(null)
    } catch (error) {
      console.error("Error processing validation:", error)
    }
  }

  const selectedSessionData = pendingValidations.find((v) => v.id === selectedSession)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold">File de Validation</h2>
          <p className="text-muted-foreground">Sessions en attente de validation ({pendingValidations.length})</p>
        </div>

        {/* Validation Cards */}
        <div className="grid gap-6">
          {pendingValidations.map((validation) => (
            <Card key={validation.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{validation.employeeName}</CardTitle>
                      <CardDescription>{validation.recipeName}</CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(validation.requestedAt)}
                    </Badge>
                    {validation.problems > 0 && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {validation.problems} problème{validation.problems > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Performance Summary */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Durée réelle:</span>
                        <span
                          className={getPerformanceColor(
                            validation.actualDuration * 60,
                            validation.estimatedDuration * 60,
                          )}
                        >
                          {validation.actualDuration} min
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Durée estimée:</span>
                        <span className="text-muted-foreground">{validation.estimatedDuration} min</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Étapes complétées:</span>
                        <span>
                          {validation.completedSteps}/{validation.totalSteps}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Preview */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Timeline des étapes</h4>
                    <div className="space-y-2">
                      {validation.timeline.slice(0, 3).map((step, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Étape {step.step}:</span>
                          <span className={getPerformanceColor(step.duration, step.expected)}>
                            {formatDuration(step.duration)}
                          </span>
                          <span className="text-muted-foreground">(attendu: {formatDuration(step.expected)})</span>
                        </div>
                      ))}
                      {validation.timeline.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{validation.timeline.length - 3} étapes supplémentaires
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => setSelectedSession(validation.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Voir détails
                    </Button>

                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedSession(validation.id)
                          setValidationAction("approve")
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approuver
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedSession(validation.id)
                          setValidationAction("reject")
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Validation Modal */}
        <Dialog
          open={!!selectedSession}
          onOpenChange={() => {
            setSelectedSession(null)
            setValidationAction(null)
            setValidationNote("")
          }}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {validationAction === "approve"
                  ? "Approuver"
                  : validationAction === "reject"
                    ? "Rejeter"
                    : "Détails de"}{" "}
                la session
              </DialogTitle>
              <DialogDescription>
                {selectedSessionData && (
                  <>
                    Session de {selectedSessionData.employeeName} - {selectedSessionData.recipeName}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            {selectedSessionData && (
              <div className="space-y-6">
                {/* Detailed Timeline */}
                <div>
                  <h4 className="font-medium mb-3">Timeline complète</h4>
                  <div className="space-y-2">
                    {selectedSessionData.timeline.map((step, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-medium">Étape {step.step}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <span>
                            Réalisé:{" "}
                            <span className={getPerformanceColor(step.duration, step.expected)}>
                              {formatDuration(step.duration)}
                            </span>
                          </span>
                          <span className="text-muted-foreground">Attendu: {formatDuration(step.expected)}</span>
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                step.duration <= step.expected * 1.1
                                  ? "bg-green-500"
                                  : step.duration <= step.expected * 1.3
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${Math.min((step.duration / step.expected) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Validation Note */}
                {validationAction && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {validationAction === "approve"
                        ? "Note de félicitations (optionnel)"
                        : "Raison du rejet (requis)"}
                    </label>
                    <Textarea
                      value={validationNote}
                      onChange={(e) => setValidationNote(e.target.value)}
                      placeholder={
                        validationAction === "approve"
                          ? "Excellente performance, continuez ainsi..."
                          : "Veuillez reprendre l'étape 2, temps de cuisson trop long..."
                      }
                      rows={3}
                    />
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSession(null)
                  setValidationAction(null)
                  setValidationNote("")
                }}
              >
                Annuler
              </Button>

              {validationAction && (
                <Button
                  variant={validationAction === "approve" ? "default" : "destructive"}
                  onClick={() => handleValidation(validationAction)}
                  disabled={validationAction === "reject" && !validationNote.trim()}
                >
                  {validationAction === "approve" ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approuver et générer badge
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeter et demander reprise
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
