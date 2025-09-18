"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, CheckCircle, User, MessageSquare, UserCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AdminLayout } from "./admin-layout"

export function ProblemsManager() {
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null)
  const [resolution, setResolution] = useState("")
  const [assignedMentor, setAssignedMentor] = useState("")

  // Mock data - would come from API
  const problems = [
    {
      id: "1",
      sessionId: "session-1",
      employeeId: "2",
      employeeName: "Jean Martin",
      recipeName: "Poulet rôti express",
      stepId: "2",
      stepName: "Couper les légumes",
      type: "ingredient_missing",
      description: "Carottes non disponibles en cuisine",
      reportedAt: "2024-01-15T10:30:00Z",
      priority: "high",
      status: "open",
      assignedTo: null,
      resolution: null,
    },
    {
      id: "2",
      sessionId: "session-2",
      employeeId: "1",
      employeeName: "Marie Dubois",
      recipeName: "Salade César",
      stepId: "3",
      stepName: "Préparer la sauce",
      type: "equipment_issue",
      description: "Mixeur en panne, impossible de faire la sauce",
      reportedAt: "2024-01-15T09:15:00Z",
      priority: "urgent",
      status: "assigned",
      assignedTo: "Chef Martin",
      resolution: null,
    },
    {
      id: "3",
      sessionId: "session-3",
      employeeId: "3",
      employeeName: "Sophie Laurent",
      recipeName: "Soupe à l'oignon",
      stepId: "4",
      stepName: "Cuisson au four",
      type: "temperature_problem",
      description: "Four ne chauffe pas assez, température max 150°C",
      reportedAt: "2024-01-14T16:45:00Z",
      priority: "medium",
      status: "resolved",
      assignedTo: "Technicien Paul",
      resolution: "Four réparé, thermostat remplacé",
    },
    {
      id: "4",
      sessionId: "session-4",
      employeeId: "4",
      employeeName: "Pierre Durand",
      recipeName: "Risotto aux champignons",
      stepId: "1",
      stepName: "Préparation des ingrédients",
      type: "other",
      description: "Instructions pas claires pour la quantité de bouillon",
      reportedAt: "2024-01-14T14:20:00Z",
      priority: "low",
      status: "open",
      assignedTo: null,
      resolution: null,
    },
  ]

  const mentors = [
    { id: "1", name: "Chef Martin" },
    { id: "2", name: "Sous-chef Claire" },
    { id: "3", name: "Chef de partie Tom" },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "secondary"
      case "medium":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "Urgent"
      case "high":
        return "Élevée"
      case "medium":
        return "Moyenne"
      default:
        return "Faible"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">Ouvert</Badge>
      case "assigned":
        return <Badge variant="secondary">Assigné</Badge>
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-500">
            Résolu
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ingredient_missing":
        return "Ingrédient manquant"
      case "equipment_issue":
        return "Problème d'équipement"
      case "temperature_problem":
        return "Problème de température"
      default:
        return "Autre"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleAssignProblem = async (problemId: string, mentorId: string) => {
    try {
      console.log("[Assign Problem]", { problemId, mentorId })
      alert("Problème assigné avec succès !")
    } catch (error) {
      console.error("Error assigning problem:", error)
    }
  }

  const handleResolveProblem = async (problemId: string) => {
    if (!resolution.trim()) return

    try {
      console.log("[Resolve Problem]", { problemId, resolution })
      alert("Problème marqué comme résolu !")
      setSelectedProblem(null)
      setResolution("")
    } catch (error) {
      console.error("Error resolving problem:", error)
    }
  }

  const selectedProblemData = problems.find((p) => p.id === selectedProblem)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold">Gestion des Problèmes</h2>
          <p className="text-muted-foreground">
            Problèmes signalés par les employés ({problems.filter((p) => p.status !== "resolved").length} ouverts)
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid gap-4">
          {problems.map((problem) => (
            <Card
              key={problem.id}
              className={`hover:shadow-lg transition-shadow ${
                problem.priority === "urgent" ? "border-red-200" : problem.priority === "high" ? "border-amber-200" : ""
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        problem.priority === "urgent"
                          ? "text-red-500"
                          : problem.priority === "high"
                            ? "text-amber-500"
                            : "text-muted-foreground"
                      }`}
                    />
                    <div>
                      <CardTitle className="text-lg">{getTypeLabel(problem.type)}</CardTitle>
                      <CardDescription>
                        {problem.employeeName} - {problem.recipeName} (Étape: {problem.stepName})
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityColor(problem.priority)}>{getPriorityLabel(problem.priority)}</Badge>
                    {getStatusBadge(problem.status)}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{problem.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span>Signalé le {formatDate(problem.reportedAt)}</span>
                      {problem.assignedTo && (
                        <span className="flex items-center">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Assigné à {problem.assignedTo}
                        </span>
                      )}
                    </div>
                  </div>

                  {problem.resolution && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-1">Résolution</h5>
                      <p className="text-sm text-green-700">{problem.resolution}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    {problem.status === "open" && (
                      <>
                        <select
                          onChange={(e) => e.target.value && handleAssignProblem(problem.id, e.target.value)}
                          className="px-3 py-1 text-sm border border-border rounded-md bg-background"
                          defaultValue=""
                        >
                          <option value="">Assigner à...</option>
                          {mentors.map((mentor) => (
                            <option key={mentor.id} value={mentor.id}>
                              {mentor.name}
                            </option>
                          ))}
                        </select>
                      </>
                    )}

                    {problem.status !== "resolved" && (
                      <Button variant="outline" size="sm" onClick={() => setSelectedProblem(problem.id)}>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Résoudre
                      </Button>
                    )}

                    <Button variant="ghost" size="sm">
                      <User className="h-4 w-4 mr-1" />
                      Contacter {problem.employeeName}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resolution Modal */}
        <Dialog
          open={!!selectedProblem}
          onOpenChange={() => {
            setSelectedProblem(null)
            setResolution("")
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Résoudre le problème</DialogTitle>
              <DialogDescription>
                {selectedProblemData && <>Problème signalé par {selectedProblemData.employeeName}</>}
              </DialogDescription>
            </DialogHeader>

            {selectedProblemData && (
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">{getTypeLabel(selectedProblemData.type)}</h4>
                  <p className="text-sm text-muted-foreground">{selectedProblemData.description}</p>
                  <div className="text-xs text-muted-foreground mt-2">
                    {selectedProblemData.recipeName} - Étape: {selectedProblemData.stepName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description de la résolution</label>
                  <Textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="Décrivez comment le problème a été résolu..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedProblem(null)
                  setResolution("")
                }}
              >
                Annuler
              </Button>

              <Button
                onClick={() => selectedProblem && handleResolveProblem(selectedProblem)}
                disabled={!resolution.trim()}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Marquer comme résolu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
