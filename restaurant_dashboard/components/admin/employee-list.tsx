"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Search, Eye, CheckSquare, User, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AdminLayout } from "./admin-layout"
import Link from "next/link"

export function EmployeeList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock data - would come from API
  const employees = [
    {
      id: "1",
      name: "Marie Dubois",
      email: "marie.dubois@restaurant.com",
      status: "in_progress",
      progress: 65,
      lastActivity: "2024-01-15T10:30:00Z",
      completedSessions: 8,
      pendingValidations: 2,
      joinedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Jean Martin",
      email: "jean.martin@restaurant.com",
      status: "completed",
      progress: 100,
      lastActivity: "2024-01-15T09:15:00Z",
      completedSessions: 15,
      pendingValidations: 0,
      joinedAt: "2023-12-15T00:00:00Z",
    },
    {
      id: "3",
      name: "Sophie Laurent",
      email: "sophie.laurent@restaurant.com",
      status: "pending_validation",
      progress: 85,
      lastActivity: "2024-01-15T11:45:00Z",
      completedSessions: 12,
      pendingValidations: 3,
      joinedAt: "2024-01-05T00:00:00Z",
    },
    {
      id: "4",
      name: "Pierre Durand",
      email: "pierre.durand@restaurant.com",
      status: "in_progress",
      progress: 45,
      lastActivity: "2024-01-14T16:20:00Z",
      completedSessions: 6,
      pendingValidations: 1,
      joinedAt: "2024-01-10T00:00:00Z",
    },
    {
      id: "5",
      name: "Emma Rousseau",
      email: "emma.rousseau@restaurant.com",
      status: "not_started",
      progress: 0,
      lastActivity: null,
      completedSessions: 0,
      pendingValidations: 0,
      joinedAt: "2024-01-15T00:00:00Z",
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
      case "in_progress":
        return <Badge variant="secondary">En cours</Badge>
      case "pending_validation":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-600">
            En attente
          </Badge>
        )
      case "not_started":
        return <Badge variant="outline">Non commencé</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Jamais"
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Gestion des Employés</h2>
            <p className="text-muted-foreground">Suivi et gestion des formations des employés</p>
          </div>

          <Button>
            <User className="h-4 w-4 mr-2" />
            Nouvel employé
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtres et recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">Tous les statuts</option>
                <option value="not_started">Non commencé</option>
                <option value="in_progress">En cours</option>
                <option value="pending_validation">En attente</option>
                <option value="completed">Terminé</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <Card>
          <CardHeader>
            <CardTitle>Employés ({filteredEmployees.length})</CardTitle>
            <CardDescription>Liste des employés et leur progression dans la formation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{employee.name}</h3>
                      {getStatusBadge(employee.status)}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{employee.email}</div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Progression: {employee.progress}%</span>
                      <span>Sessions: {employee.completedSessions}</span>
                      <span>Dernière activité: {formatDate(employee.lastActivity)}</span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-32">
                    <div className="mb-1 text-xs text-muted-foreground text-right">{employee.progress}%</div>
                    <Progress value={employee.progress} className="h-2" />
                  </div>

                  <div className="flex-shrink-0 flex items-center space-x-2">
                    {employee.pendingValidations > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {employee.pendingValidations} validation{employee.pendingValidations > 1 ? "s" : ""}
                      </Badge>
                    )}

                    <Link href={`/admin/employee/${employee.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </Link>

                    {employee.pendingValidations > 0 && (
                      <Link href="/admin/validation-queue">
                        <Button size="sm">
                          <CheckSquare className="h-4 w-4 mr-1" />
                          Valider
                        </Button>
                      </Link>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir détails</DropdownMenuItem>
                        <DropdownMenuItem>Envoyer message</DropdownMenuItem>
                        <DropdownMenuItem>Réinitialiser progression</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
