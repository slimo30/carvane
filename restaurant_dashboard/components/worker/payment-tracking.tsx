"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DollarSign, 
  Wallet, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Receipt,
  Download,
  Filter,
  Search
} from "lucide-react"

interface PaymentRecord {
  id: string
  recipe: string
  amount: number
  status: 'completed' | 'pending' | 'processing'
  date: string
  paymentMethod: 'cash' | 'card' | 'digital'
  validationStatus: 'approved' | 'pending' | 'rejected'
}

interface EarningsStats {
  totalEarnings: number
  todayEarnings: number
  thisWeekEarnings: number
  thisMonthEarnings: number
  pendingAmount: number
  averagePerRecipe: number
  totalRecipes: number
}

export function PaymentTracking() {
  const [stats, setStats] = useState<EarningsStats>({
    totalEarnings: 1247.50,
    todayEarnings: 89.30,
    thisWeekEarnings: 456.80,
    thisMonthEarnings: 1247.50,
    pendingAmount: 156.80,
    averagePerRecipe: 26.54,
    totalRecipes: 47
  })

  const [payments, setPayments] = useState<PaymentRecord[]>([
    {
      id: "1",
      recipe: "Poulet Rôti Express",
      amount: 12.50,
      status: 'completed',
      date: "Aujourd'hui",
      paymentMethod: 'cash',
      validationStatus: 'approved'
    },
    {
      id: "2",
      recipe: "Salade César",
      amount: 8.30,
      status: 'completed',
      date: "Hier",
      paymentMethod: 'card',
      validationStatus: 'approved'
    },
    {
      id: "3",
      recipe: "Soupe à l'oignon",
      amount: 15.20,
      status: 'pending',
      date: "Il y a 2 jours",
      paymentMethod: 'digital',
      validationStatus: 'pending'
    },
    {
      id: "4",
      recipe: "Risotto aux Champignons",
      amount: 18.70,
      status: 'pending',
      date: "Il y a 3 jours",
      paymentMethod: 'cash',
      validationStatus: 'pending'
    },
    {
      id: "5",
      recipe: "Pâtes Carbonara",
      amount: 11.40,
      status: 'completed',
      date: "Il y a 4 jours",
      paymentMethod: 'card',
      validationStatus: 'approved'
    }
  ])

  const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'processing'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default">Terminé</Badge>
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>
      case 'processing':
        return <Badge variant="outline">En cours</Badge>
      default:
        return null
    }
  }

  const getValidationBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-100 text-green-800">Approuvé</Badge>
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>
      default:
        return null
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <DollarSign className="h-4 w-4" />
      case 'card':
        return <CreditCard className="h-4 w-4" />
      case 'digital':
        return <Receipt className="h-4 w-4" />
      default:
        return null
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status === filter
    const matchesSearch = payment.recipe.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const exportPayments = () => {
    // In a real app, this would generate and download a CSV/PDF
    alert("Export des paiements en cours...")
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total gagné</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aujourd'hui</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.todayEarnings)}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Moyenne/recette</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.averagePerRecipe)}</p>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique des paiements</CardTitle>
              <CardDescription>Suivez tous vos gains et paiements</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportPayments}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all" onClick={() => setFilter('all')}>
                  Tous ({payments.length})
                </TabsTrigger>
                <TabsTrigger value="completed" onClick={() => setFilter('completed')}>
                  Terminés ({payments.filter(p => p.status === 'completed').length})
                </TabsTrigger>
                <TabsTrigger value="pending" onClick={() => setFilter('pending')}>
                  En attente ({payments.filter(p => p.status === 'pending').length})
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher une recette..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md text-sm"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              {filteredPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun paiement trouvé</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          {getPaymentMethodIcon(payment.paymentMethod)}
                        </div>
                        <div>
                          <h4 className="font-medium">{payment.recipe}</h4>
                          <p className="text-sm text-muted-foreground">{payment.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusBadge(payment.status)}
                            {getValidationBadge(payment.validationStatus)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Weekly/Monthly Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Cette semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Gains totaux</span>
                <span className="font-bold">{formatCurrency(stats.thisWeekEarnings)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Recettes complétées</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Moyenne par jour</span>
                <span className="font-bold">{formatCurrency(stats.thisWeekEarnings / 7)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
              Ce mois-ci
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Gains totaux</span>
                <span className="font-bold">{formatCurrency(stats.thisMonthEarnings)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Recettes complétées</span>
                <span className="font-bold">{stats.totalRecipes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Moyenne par recette</span>
                <span className="font-bold">{formatCurrency(stats.averagePerRecipe)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

