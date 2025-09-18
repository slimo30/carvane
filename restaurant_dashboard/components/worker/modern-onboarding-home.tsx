"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChefHat, Clock, CheckCircle, AlertCircle, Play, Mic, MicOff } from "lucide-react"
import { useRouter } from "next/navigation"

interface OnboardingStats {
  completedRecipes: number
  totalRecipes: number
  completionPercentage: number
  status: "in-progress" | "waiting-validation" | "completed"
  lastSession?: Date
}

export default function ModernOnboardingHome() {
  const router = useRouter()
  const [stats, setStats] = useState<OnboardingStats>({
    completedRecipes: 3,
    totalRecipes: 8,
    completionPercentage: 37,
    status: "in-progress",
    lastSession: new Date(),
  })
  const [voiceEnabled, setVoiceEnabled] = useState(false)

  const ProgressCircle = ({ percentage }: { percentage: number }) => (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgb(243 244 246)"
          strokeWidth="8"
          className="drop-shadow-inner"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgb(34 197 94)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 45}`}
          strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
          className="transition-all duration-1000 ease-out drop-shadow-lg"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-gray-900">{percentage}%</div>
        <div className="text-sm text-gray-600 font-medium">Terminé</div>
      </div>
    </div>
  )

  const StatusBadge = ({ status }: { status: OnboardingStats["status"] }) => {
    const statusConfig = {
      "in-progress": {
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: Clock,
        text: "En cours",
      },
      "waiting-validation": {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: AlertCircle,
        text: "En attente de validation",
      },
      completed: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        text: "Terminé",
      },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} px-4 py-2 text-sm font-medium border flex items-center gap-2`}>
        <Icon className="w-4 h-4" />
        {config.text}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Formation Cuisinier</h1>
              <p className="text-gray-600">Bienvenue dans votre parcours d'apprentissage</p>
            </div>
          </div>

          <Button
            variant={voiceEnabled ? "default" : "outline"}
            size="lg"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="rounded-2xl shadow-lg"
          >
            {voiceEnabled ? <Mic className="w-5 h-5 mr-2" /> : <MicOff className="w-5 h-5 mr-2" />}
            {voiceEnabled ? "Vocal ON" : "Vocal OFF"}
          </Button>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl p-8 mb-8">
          <div className="text-center mb-8">
            <ProgressCircle percentage={stats.completionPercentage} />
            <div className="mt-6">
              <StatusBadge status={stats.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <div className="text-2xl font-bold text-green-600">{stats.completedRecipes}</div>
              <div className="text-sm text-gray-600">Recettes maîtrisées</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-2xl">
              <div className="text-2xl font-bold text-blue-600">{stats.totalRecipes - stats.completedRecipes}</div>
              <div className="text-sm text-gray-600">Recettes restantes</div>
            </div>
          </div>

          <Button
            size="lg"
            onClick={() => router.push("/worker/recipes")}
            className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Play className="w-6 h-6 mr-3" />
            Commencer les Recettes Rapides
          </Button>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
            onClick={() => router.push("/worker/simulation")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Simulation KDS</h3>
                <p className="text-sm text-gray-600">Entraînement avec tickets</p>
              </div>
            </div>
          </Card>

          <Card
            className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105"
            onClick={() => router.push("/worker/validation")}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Demander Validation</h3>
                <p className="text-sm text-gray-600">Valider vos compétences</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
