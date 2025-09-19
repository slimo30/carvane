"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  CookingPot,
  Robot as Bot,
  ChatCircleText as MessageCircle,
  CheckCircle,
  ArrowRight,
  Sparkle as Sparkles,
  Clock,
  Book as BookOpen,
  CurrencyCircleDollar as DollarSign,
  CreditCard,
  Wallet,
  TrendUp as TrendingUp,
  Medal as Award,
  Play,
  Pause,
  ArrowCounterClockwise as RotateCcw,
  Warning as AlertTriangle,
  SpeakerHigh as Volume2,
  SpeakerX as VolumeX,
  Star,
  Target,
  Users,
  Calendar,
  ChartBar as BarChart3,
  Receipt,
  QrCode,
  CheckCircle as CheckCircle2,
  XCircle
} from "phosphor-react"
import Link from "next/link"
import Image from "next/image"

interface WorkerStats {
  totalEarnings: number
  todayEarnings: number
  completedRecipes: number
  averageRating: number
  currentStreak: number
  badgesEarned: number
  nextPayment: number
  pendingValidation: number
}

interface PaymentRequest {
  id: string
  tableId: string
  amount: number
  paymentMethod: 'cash' | 'card' | 'digital'
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: Date
  processedAt?: Date
  notes?: string
  workerId: string
}

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<any>
  color: string
  href: string
  badge?: string
}

interface RecentActivity {
  id: string
  type: "recipe_completed" | "payment_received" | "badge_earned" | "validation_approved"
  title: string
  description: string
  amount?: number
  time: string
  icon: React.ComponentType<any>
  color: string
}

export function EnhancedWorkerDashboard() {
  const [stats, setStats] = useState<WorkerStats>({
    totalEarnings: 1247.50,
    todayEarnings: 89.30,
    completedRecipes: 47,
    averageRating: 4.8,
    currentStreak: 12,
    badgesEarned: 8,
    nextPayment: 156.80,
    pendingValidation: 2
  })

  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([])
  const [newPaymentRequest, setNewPaymentRequest] = useState({
    tableId: '',
    amount: 0,
    paymentMethod: 'cash' as 'cash' | 'card' | 'digital',
    notes: ''
  })

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: "1",
      type: "payment_received",
      title: "Paiement reçu",
      description: "Poulet rôti express - Validation approuvée",
      amount: 12.50,
      time: "Il y a 2h",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      id: "2",
      type: "badge_earned",
      title: "Badge débloqué",
      description: "Maître des légumes - 10 recettes de légumes",
      time: "Il y a 4h",
      icon: Award,
      color: "text-yellow-600"
    },
    {
      id: "3",
      type: "recipe_completed",
      title: "Recette terminée",
      description: "Salade César - En attente de validation",
      time: "Il y a 6h",
      icon: CheckCircle,
      color: "text-blue-600"
    }
  ])

  const quickActions: QuickAction[] = [
    {
      id: "start-cooking",
      title: "Commencer à cuisiner",
      description: "Démarrer une nouvelle recette guidée",
      icon: CookingPot,
      color: "bg-primary",
      href: "/worker/recipes"
    },
    {
      id: "simulation",
      title: "Mode simulation",
      description: "Pratiquer sans pression",
      icon: Play,
      color: "bg-secondary",
      href: "/worker/simulation"
    },
    {
      id: "earnings",
      title: "Mes gains",
      description: "Consulter mes paiements",
      icon: DollarSign,
      color: "bg-accent",
      href: "/worker/earnings"
    },
    {
      id: "validation",
      title: "Validation",
      description: "Sessions en attente",
      icon: CheckCircle,
      color: "bg-destructive",
      href: "/worker/validation",
      badge: stats.pendingValidation.toString()
    }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const handlePaymentRequest = () => {
    if (!newPaymentRequest.tableId || newPaymentRequest.amount <= 0) {
      alert("Veuillez remplir tous les champs requis")
      return
    }

    const request: PaymentRequest = {
      id: Date.now().toString(),
      tableId: newPaymentRequest.tableId,
      amount: newPaymentRequest.amount,
      paymentMethod: newPaymentRequest.paymentMethod,
      status: 'pending',
      requestedAt: new Date(),
      workerId: 'worker-1',
      notes: newPaymentRequest.notes
    }

    setPaymentRequests(prev => [request, ...prev])
    setNewPaymentRequest({ tableId: '', amount: 0, paymentMethod: 'cash', notes: '' })
    alert("Demande de paiement envoyée !")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>
      case 'approved':
        return <Badge variant="default">Approuvé</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejeté</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
                <CookingPot className="h-6 w-6 text-primary-foreground" weight="fill" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mon Espace Cuisinier</h1>
                <p className="text-sm text-muted-foreground">Bienvenue, Marie ! Prêt à cuisiner ?</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Badge variant="secondary">
                <Sparkles className="h-3 w-3 mr-1" />
                IA Activée
              </Badge>
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-sm">M</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-muted">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="cooking" className="flex items-center space-x-2">
              <CookingPot className="h-4 w-4" weight="fill" />
              <span>Cuisine</span>
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Gains</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Progrès</span>
            </TabsTrigger>
            <TabsTrigger value="payment-request" className="flex items-center space-x-2">
              <Receipt className="h-4 w-4" />
              <span>Paiement</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gains d'aujourd'hui</p>
                      <p className="text-2xl font-bold">{formatCurrency(stats.todayEarnings)}</p>
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
                      <p className="text-sm font-medium text-muted-foreground">Recettes terminées</p>
                      <p className="text-2xl font-bold">{stats.completedRecipes}</p>
                    </div>
                    <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Note moyenne</p>
                      <div className="flex items-center space-x-1">
                        <p className="text-2xl font-bold">{stats.averageRating}</p>
                        <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                      <Award className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Série actuelle</p>
                      <p className="text-2xl font-bold">{stats.currentStreak} jours</p>
                    </div>
                    <div className="w-12 h-12 bg-destructive/10 rounded-2xl flex items-center justify-center">
                      <Zap className="h-6 w-6 text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>Actions rapides</span>
                </CardTitle>
                <CardDescription>Commencez votre journée de travail</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action) => {
                    const Icon = action.icon
                    return (
                      <Link key={action.id} href={action.href}>
                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                          <CardContent className="p-6 text-center relative">
                            <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className="h-8 w-8 text-primary-foreground" />
                            </div>
                            <h3 className="font-semibold mb-2">{action.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                            {action.badge && (
                              <Badge variant="destructive" className="absolute top-2 right-2">
                                {action.badge}
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Activité récente</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const Icon = activity.icon
                      return (
                        <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                          {activity.amount && (
                            <div className="text-right">
                              <p className="font-semibold text-green-600">{formatCurrency(activity.amount)}</p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* AI Assistant */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <span>Assistant IA</span>
                  </CardTitle>
                  <CardDescription>Votre guide culinaire personnel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="bg-primary">
                        <AvatarFallback>
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-2xl p-4">
                        <p className="text-sm">
                          Salut Marie ! J'ai remarqué que tu excelles dans les recettes de légumes. 
                          Veux-tu essayer quelque chose de nouveau aujourd'hui ?
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Discuter
                      </Button>
                      <Button size="sm" variant="outline">
                        <Volume2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cooking Tab */}
          <TabsContent value="cooking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CookingPot className="h-5 w-5 text-primary" weight="fill" />
                  <span>Mode Cuisine</span>
                </CardTitle>
                <CardDescription>Choisissez votre prochaine recette</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "Poulet Rôti Express", difficulty: "Facile", time: "15 min", earnings: "12.50€", image: "/roasted-chicken-with-vegetables.jpg" },
                    { name: "Salade César", difficulty: "Moyen", time: "10 min", earnings: "8.30€", image: "/caesar-salad-croutons.png" },
                    { name: "Risotto aux Champignons", difficulty: "Difficile", time: "25 min", earnings: "18.70€", image: "/creamy-mushroom-risotto.png" }
                  ].map((recipe, index) => (
                    <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                      <div className="relative h-48 overflow-hidden rounded-t-xl">
                        <Image 
                          src={recipe.image} 
                          alt={recipe.name} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-background/90 text-foreground border-0">
                            {recipe.earnings}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">{recipe.name}</h3>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                          <span>{recipe.difficulty}</span>
                          <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                            {recipe.time}
                          </span>
                        </div>
                        <Button className="w-full">
                          <Play className="h-4 w-4 mr-2" />
                          Commencer
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <span>Mes Gains</span>
                </CardTitle>
                <CardDescription>Suivez vos revenus et paiements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-muted rounded-2xl">
                    <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
                    <p className="text-sm text-muted-foreground">Total gagné</p>
                  </div>
                  <div className="text-center p-6 bg-muted rounded-2xl">
                    <Wallet className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <p className="text-2xl font-bold">{formatCurrency(stats.nextPayment)}</p>
                    <p className="text-sm text-muted-foreground">Prochain paiement</p>
                  </div>
                  <div className="text-center p-6 bg-muted rounded-2xl">
                    <Calendar className="h-8 w-8 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold">Vendredi</p>
                    <p className="text-sm text-muted-foreground">Date de paiement</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Paiements récents</h3>
                  {[
                    { recipe: "Poulet Rôti Express", amount: 12.50, date: "Aujourd'hui", status: "payé" },
                    { recipe: "Salade César", amount: 8.30, date: "Hier", status: "payé" },
                    { recipe: "Soupe à l'oignon", amount: 15.20, date: "Il y a 2 jours", status: "en attente" }
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                      <div>
                        <h4 className="font-medium">{payment.recipe}</h4>
                        <p className="text-sm text-muted-foreground">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(payment.amount)}</p>
                        <Badge variant={payment.status === "payé" ? "default" : "secondary"}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Mon Progrès</span>
                </CardTitle>
                <CardDescription>Suivez votre évolution et vos accomplissements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Recettes maîtrisées</span>
                          <span>47/50</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Badges débloqués</span>
                          <span>8/12</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Série actuelle</span>
                          <span>12 jours</span>
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Badges récents</h3>
                    <div className="space-y-3">
                      {[
                        { name: "Maître des légumes", description: "10 recettes de légumes", icon: "🥬" },
                        { name: "Rapide comme l'éclair", description: "5 recettes en moins de 10 min", icon: "⚡" },
                        { name: "Perfectionniste", description: "Note moyenne > 4.5", icon: "⭐" }
                      ].map((badge, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-xl">
                          <div className="text-2xl">{badge.icon}</div>
                          <div>
                            <h4 className="font-medium">{badge.name}</h4>
                            <p className="text-sm text-muted-foreground">{badge.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Request Tab */}
          <TabsContent value="payment-request" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* New Payment Request */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Receipt className="h-5 w-5 text-primary" />
                    <span>Nouvelle demande de paiement</span>
                  </CardTitle>
                  <CardDescription>Enregistrer un paiement en ligne</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tableId">Numéro de table</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="tableId"
                        placeholder="Ex: T-15"
                        value={newPaymentRequest.tableId}
                        onChange={(e) => setNewPaymentRequest(prev => ({ ...prev, tableId: e.target.value }))}
                        className="flex-1"
                      />
                      <Button variant="outline" size="icon">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Montant (€)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newPaymentRequest.amount || ''}
                      onChange={(e) => setNewPaymentRequest(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Méthode de paiement</Label>
                    <Select
                      value={newPaymentRequest.paymentMethod}
                      onValueChange={(value: 'cash' | 'card' | 'digital') => 
                        setNewPaymentRequest(prev => ({ ...prev, paymentMethod: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Espèces</SelectItem>
                        <SelectItem value="card">Carte bancaire</SelectItem>
                        <SelectItem value="digital">Paiement digital</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optionnel)</Label>
                    <Input
                      id="notes"
                      placeholder="Commentaires..."
                      value={newPaymentRequest.notes}
                      onChange={(e) => setNewPaymentRequest(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  <Button onClick={handlePaymentRequest} className="w-full">
                    <Receipt className="h-4 w-4 mr-2" />
                    Envoyer la demande
                  </Button>
                </CardContent>
              </Card>

              {/* Payment Requests History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Demandes de paiement</span>
                  </CardTitle>
                  <CardDescription>Historique des demandes</CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune demande de paiement</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paymentRequests.map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(request.status)}
                            <div>
                              <h4 className="font-medium">Table {request.tableId}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(request.amount)} • {request.paymentMethod}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {request.requestedAt.toLocaleString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

