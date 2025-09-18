"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, User, Clock, CheckCircle, AlertTriangle, Award, Mail, Calendar } from "lucide-react"
import { AdminLayout } from "./admin-layout"
import Link from "next/link"

interface EmployeeDetailProps {
  employeeId: string
}

export function EmployeeDetail({ employeeId }: EmployeeDetailProps) {
  // Mock data - would come from API
  const employee = {
    id: employeeId,
    name: "Marie Dubois",
    email: "marie.dubois@restaurant.com",
    status: "in_progress",
    progress: 65,
    joinedAt: "2024-01-01T00:00:00Z",
    lastActivity: "2024-01-15T10:30:00Z",
    completedSessions: 8,
    pendingValidations: 2,
    totalTimeSpent: 180, // minutes
    averageSessionTime: 22.5, // minutes
    badges: [
      { id: "1", name: "Premier pas", earnedAt: "2024-01-02T00:00:00Z" },
      { id: "2", name: "Cuisinier rapide", earnedAt: "2024-01-08T00:00:00Z" },
    ],
  }

  const sessions = [
    {
      id: "1",
      recipeName: "Poulet rôti express",
      startedAt: "2024-01-15T10:30:00Z",
      completedAt: "2024-01-15T10:48:00Z",
      duration: 18,
      status: "pending_validation",
      problems: 0,
      steps: [
        { name: "Préchauffage", duration: 125, expected: 120, status: "completed" },
        { name: "Découpe légumes", duration: 195, expected: 180, status: "completed" },
        { name: "Assaisonnement", duration: 65, expected: 60, status: "completed" },
        { name: "Cuisson", duration: 720, expected: 720, status: "completed" },
        { name: "Finition", duration: 115, expected: 120, status: "completed" },
      ],
    },
    {
      id: "2",
      recipeName: "Salade César",
      startedAt: "2024-01-14T14:20:00Z",
      completedAt: "2024-01-14T14:32:00Z",
      duration: 12,
      status: "completed",
      problems: 1,
      steps: [
        { name: "Préparation salade", duration: 90, expected: 120, status: "completed" },
        { name: "Sauce César", duration: 200, expected: 180, status: "completed" },
        { name: "Croûtons", duration: 240, expected: 180, status: "completed" },
        { name: "Assemblage", duration: 190, expected: 120, status: "completed" },
      ],
    },
    {
      id: "3",
      recipeName: "Soupe à l'oignon",
      startedAt: "2024-01-13T16:45:00Z",
      completedAt: "2024-01-13T17:07:00Z",
      duration: 22,
      status: "completed",
      problems: 0,
      steps: [
        { name: "Découpe oignons", duration: 140, expected: 120, status: "completed" },
        { name: "Cuisson oignons", duration: 480, expected: 600, status: "completed" },
        { name: "Bouillon", duration: 180, expected: 180, status: "completed" },
        { name: "Gratinage", duration: 520, expected: 480, status: "completed" },
      ],
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-500">
            Terminé
          </Badge>
        )
      case "pending_validation":
        return <Badge variant="secondary">En attente</Badge>
      case "in_progress":
        return <Badge variant="outline">En cours</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/employees">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{employee.name}</h2>
                <p className="text-muted-foreground">{employee.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {getStatusBadge(employee.status)}
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Contacter
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Employee Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Formation complétée</span>
                      <span className="font-medium">{employee.progress}%</span>
                    </div>
                    <Progress value={employee.progress} className="h-3" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{employee.completedSessions}</div>
                      <div className="text-xs text-muted-foreground">Sessions complétées</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary">{employee.pendingValidations}</div>
                      <div className="text-xs text-muted-foreground">En attente</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Temps total passé</span>
                    <span className="font-medium">
                      {Math.round(employee.totalTimeSpent / 60)}h {employee.totalTimeSpent % 60}min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Temps moyen/session</span>
                    <span className="font-medium">{employee.averageSessionTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Membre depuis</span>
                    <span className="font-medium">{formatDate(employee.joinedAt).split(" ")[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Dernière activité</span>
                    <span className="font-medium">{formatDate(employee.lastActivity)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges obtenus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employee.badges.map((badge) => (
                    <div key={badge.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                      <Award className="h-5 w-5 text-amber-500" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{badge.name}</div>
                        <div className="text-xs text-muted-foreground">{formatDate(badge.earnedAt)}</div>
                      </div>
                    </div>
                  ))}
                  {employee.badges.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Aucun badge obtenu pour le moment</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Session Timeline */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Historique des sessions</CardTitle>
                <CardDescription>Timeline détaillée des sessions de formation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {sessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{session.recipeName}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(session.startedAt)}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {session.duration} min
                            </span>
                            {session.problems > 0 && (
                              <span className="flex items-center text-amber-600">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {session.problems} problème{session.problems > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(session.status)}
                          {session.status === "pending_validation" && (
                            <Link href="/admin/validation-queue">
                              <Button size="sm">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Valider
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Step Timeline */}
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium mb-2">Détail des étapes</h5>
                        {session.steps.map((step, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span className="text-sm">{step.name}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs">
                              <span>
                                Réalisé:{" "}
                                <span className={getPerformanceColor(step.duration, step.expected)}>
                                  {formatDuration(step.duration)}
                                </span>
                              </span>
                              <span className="text-muted-foreground">Attendu: {formatDuration(step.expected)}</span>
                              <div className="w-16 bg-background rounded-full h-1">
                                <div
                                  className={`h-1 rounded-full ${
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
