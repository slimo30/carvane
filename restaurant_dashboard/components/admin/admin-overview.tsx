"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Clock, AlertTriangle, CheckCircle, TrendingUp, Search, Filter, BookOpen } from "lucide-react"
import { AdminLayout } from "./admin-layout"
import Link from "next/link"

export function AdminOverview() {
  // Mock data - would come from API
  const kpis = [
    {
      title: "Employés formés",
      value: "85%",
      change: "+12%",
      trend: "up" as const,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Temps moyen/recette",
      value: "18 min",
      change: "-3 min",
      trend: "down" as const,
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Problèmes ouverts",
      value: "2",
      change: "-5",
      trend: "down" as const,
      icon: AlertTriangle,
      color: "text-amber-600",
    },
    {
      title: "Validations en attente",
      value: "3",
      change: "+1",
      trend: "up" as const,
      icon: CheckCircle,
      color: "text-primary",
    },
  ]

  const recentActivity = [
    {
      id: "1",
      type: "validation_request",
      employee: "Marie Dubois",
      action: "Demande validation - Poulet rôti express",
      time: "Il y a 5 min",
      status: "pending",
    },
    {
      id: "2",
      type: "problem_reported",
      employee: "Jean Martin",
      action: "Problème signalé - Ingrédient manquant",
      time: "Il y a 12 min",
      status: "open",
    },
    {
      id: "3",
      type: "session_completed",
      employee: "Sophie Laurent",
      action: "Session terminée - Salade César",
      time: "Il y a 18 min",
      status: "completed",
    },
    {
      id: "4",
      type: "validation_approved",
      employee: "Pierre Durand",
      action: "Validation approuvée - Soupe à l'oignon",
      time: "Il y a 25 min",
      status: "approved",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "validation_request":
        return <CheckCircle className="h-4 w-4 text-secondary" />
      case "problem_reported":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "session_completed":
        return <Clock className="h-4 w-4 text-primary" />
      case "validation_approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">En attente</Badge>
      case "open":
        return <Badge variant="destructive">Ouvert</Badge>
      case "completed":
        return <Badge variant="outline">Terminé</Badge>
      case "approved":
        return <Badge variant="default">Approuvé</Badge>
      default:
        return null
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Vue d'ensemble</h2>
            <p className="text-muted-foreground">Tableau de bord de supervision des formations</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher un employé..." className="pl-10 w-64" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendingUp className={`h-3 w-3 mr-1 ${kpi.trend === "up" ? "text-green-500" : "text-red-500"}`} />
                    {kpi.change} depuis le mois dernier
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>Dernières actions des employés et du système</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{activity.employee}</div>
                        <div className="text-sm text-muted-foreground truncate">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">{activity.time}</div>
                      </div>
                      <div className="flex-shrink-0">{getStatusBadge(activity.status)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
                <CardDescription>Accès direct aux tâches importantes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/admin/validation-queue">
                  <Button className="w-full justify-start">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    File de validation
                    <Badge variant="destructive" className="ml-auto">
                      3
                    </Badge>
                  </Button>
                </Link>

                <Link href="/admin/problems">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Problèmes ouverts
                    <Badge variant="secondary" className="ml-auto">
                      2
                    </Badge>
                  </Button>
                </Link>

                <Link href="/admin/employees">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Gérer employés
                  </Button>
                </Link>

                <Link href="/admin/recipes">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Gérer recettes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Performance cette semaine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sessions complétées</span>
                    <span className="font-bold">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taux de réussite</span>
                    <span className="font-bold text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Temps moyen</span>
                    <span className="font-bold">16 min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Badges délivrés</span>
                    <span className="font-bold text-primary">12</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
