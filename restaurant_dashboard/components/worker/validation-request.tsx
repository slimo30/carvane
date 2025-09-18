"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Clock, Star, Camera, FileText, Send, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ValidationRequestProps {
  sessionData: {
    id: string
    recipeName: string
    duration: number
    estimatedDuration: number
    completedSteps: number
    totalSteps: number
    score: number
    photos: string[]
    notes: string
    problems: number
  }
}

export default function ValidationRequest({ sessionData }: ValidationRequestProps) {
  const router = useRouter()
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmitValidation = async () => {
    setIsSubmitting(true)

    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)

      // Show success message
      setTimeout(() => {
        router.push("/worker")
      }, 3000)
    }, 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 80) return "bg-blue-100 text-blue-800 border-blue-200"
    if (score >= 70) return "bg-orange-100 text-orange-800 border-orange-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <Card className="max-w-md mx-4 bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Demande Envoyée !</h2>
            <p className="text-gray-600 mb-6">
              Votre demande de validation a été envoyée avec succès. Un chef examinera votre travail sous peu.
            </p>
            <div className="bg-green-50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-green-700">Vous recevrez une notification une fois la validation terminée.</p>
            </div>
            <Button onClick={() => router.push("/worker")} className="bg-green-500 hover:bg-green-600 rounded-2xl">
              Retour à l'accueil
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-xl">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Demande de Validation</h1>
              <p className="text-sm text-gray-600">Résumé de votre session</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden mb-8">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{sessionData.recipeName}</h2>
              <p className="text-gray-600">Session terminée avec succès</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{sessionData.duration} min</div>
                <div className="text-sm text-gray-600">Durée réelle</div>
                <div className="text-xs text-gray-500">(estimé: {sessionData.estimatedDuration} min)</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {sessionData.completedSteps}/{sessionData.totalSteps}
                </div>
                <div className="text-sm text-gray-600">Étapes complétées</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(sessionData.score)}`}>{sessionData.score}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{sessionData.photos.length}</div>
                <div className="text-sm text-gray-600">Photos prises</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Performance
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Score global</span>
                    <Badge className={`${getScoreBadge(sessionData.score)} border font-medium`}>
                      {sessionData.score}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Respect du timing</span>
                    <Badge
                      className={
                        sessionData.duration <= sessionData.estimatedDuration * 1.1
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-orange-100 text-orange-800 border-orange-200"
                      }
                    >
                      {sessionData.duration <= sessionData.estimatedDuration * 1.1 ? "Excellent" : "À améliorer"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Documentation</span>
                    <Badge
                      className={
                        sessionData.photos.length > 0 && sessionData.notes
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-orange-100 text-orange-800 border-orange-200"
                      }
                    >
                      {sessionData.photos.length > 0 && sessionData.notes ? "Complète" : "Partielle"}
                    </Badge>
                  </div>
                  {sessionData.problems > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Problèmes signalés</span>
                      <Badge className="bg-red-100 text-red-800 border-red-200">{sessionData.problems}</Badge>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-blue-500" />
                  Documentation
                </h3>
                {sessionData.photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {sessionData.photos.slice(0, 4).map((photo, index) => (
                      <img
                        key={index}
                        src={photo || "/placeholder.svg"}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 mb-4">Aucune photo prise</div>
                )}

                {sessionData.notes ? (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <FileText className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Vos notes</span>
                    </div>
                    <p className="text-sm text-gray-600">{sessionData.notes}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">Aucune note ajoutée</div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-lg font-bold text-gray-900 mb-4">
                Commentaires additionnels (optionnel)
              </label>
              <Textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Ajoutez des commentaires sur votre expérience, les difficultés rencontrées, ou des questions pour le chef..."
                rows={4}
                className="rounded-2xl"
              />
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 mb-8">
              <h4 className="font-bold text-blue-900 mb-2">Que se passe-t-il ensuite ?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Un chef examinera votre session dans les 24h</li>
                <li>• Vous recevrez une notification avec le résultat</li>
                <li>• En cas de validation, vous obtiendrez un badge de compétence</li>
                <li>• En cas de rejet, vous recevrez des conseils d'amélioration</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.back()} className="flex-1 rounded-2xl">
                Retour
              </Button>
              <Button
                onClick={handleSubmitValidation}
                disabled={isSubmitting}
                className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-2xl"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Demander la validation
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
