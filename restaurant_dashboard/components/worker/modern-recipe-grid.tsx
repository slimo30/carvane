"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Play, AlertTriangle, ChefHat, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface Recipe {
  id: string
  name: string
  description: string
  image: string
  estimatedTime: number
  allergens: string[]
  difficulty: "Facile" | "Moyen" | "Difficile"
  category: string
}

export default function ModernRecipeGrid() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const recipes: Recipe[] = [
    {
      id: "1",
      name: "Poulet Rôti Express",
      description: "Poulet rôti avec légumes de saison",
      image: "/placeholder-gp6j5.png",
      estimatedTime: 15,
      allergens: ["gluten"],
      difficulty: "Facile",
      category: "Plats principaux",
    },
    {
      id: "2",
      name: "Salade César",
      description: "Salade César classique avec croûtons maison",
      image: "/placeholder-uvw0h.png",
      estimatedTime: 10,
      allergens: ["gluten", "œufs"],
      difficulty: "Facile",
      category: "Entrées",
    },
    {
      id: "3",
      name: "Soupe à l'Oignon",
      description: "Soupe à l'oignon gratinée au fromage",
      image: "/placeholder-t7529.png",
      estimatedTime: 20,
      allergens: ["lactose"],
      difficulty: "Moyen",
      category: "Soupes",
    },
    {
      id: "4",
      name: "Risotto aux Champignons",
      description: "Risotto crémeux aux champignons de Paris",
      image: "/placeholder-79mlk.png",
      estimatedTime: 25,
      allergens: ["lactose"],
      difficulty: "Moyen",
      category: "Plats principaux",
    },
    {
      id: "5",
      name: "Tarte aux Pommes",
      description: "Tarte aux pommes traditionnelle",
      image: "/placeholder-y4eem.png",
      estimatedTime: 30,
      allergens: ["gluten", "œufs", "lactose"],
      difficulty: "Difficile",
      category: "Desserts",
    },
    {
      id: "6",
      name: "Saumon Grillé",
      description: "Saumon grillé avec sauce hollandaise",
      image: "/placeholder-dph3e.png",
      estimatedTime: 18,
      allergens: ["poisson", "œufs"],
      difficulty: "Moyen",
      category: "Plats principaux",
    },
  ]

  const categories = ["all", ...Array.from(new Set(recipes.map((r) => r.category)))]
  const filteredRecipes = selectedCategory === "all" ? recipes : recipes.filter((r) => r.category === selectedCategory)

  const getAllergenIcon = (allergen: string) => {
    const allergenMap: Record<string, { icon: string; color: string }> = {
      gluten: { icon: "🌾", color: "bg-amber-100 text-amber-800" },
      lactose: { icon: "🥛", color: "bg-blue-100 text-blue-800" },
      œufs: { icon: "🥚", color: "bg-yellow-100 text-yellow-800" },
      poisson: { icon: "🐟", color: "bg-cyan-100 text-cyan-800" },
      noix: { icon: "🥜", color: "bg-orange-100 text-orange-800" },
    }
    return allergenMap[allergen] || { icon: "⚠️", color: "bg-gray-100 text-gray-800" }
  }

  const getDifficultyColor = (difficulty: Recipe["difficulty"]) => {
    const colors = {
      Facile: "bg-green-100 text-green-800 border-green-200",
      Moyen: "bg-amber-100 text-amber-800 border-amber-200",
      Difficile: "bg-red-100 text-red-800 border-red-200",
    }
    return colors[difficulty]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()} className="rounded-xl">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Recettes Rapides</h1>
                  <p className="text-sm text-gray-600">{filteredRecipes.length} recettes disponibles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-2xl whitespace-nowrap"
            >
              {category === "all" ? "Toutes" : category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className="group bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer"
              onClick={() => router.push(`/worker/recipe/${recipe.id}`)}
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                <div className="absolute top-4 right-4">
                  <Badge className={`${getDifficultyColor(recipe.difficulty)} border font-medium`}>
                    {recipe.difficulty}
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">{recipe.estimatedTime} min</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{recipe.description}</p>
                </div>

                {recipe.allergens.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Allergènes</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recipe.allergens.map((allergen) => {
                        const allergenInfo = getAllergenIcon(allergen)
                        return (
                          <Badge
                            key={allergen}
                            className={`${allergenInfo.color} border text-xs font-medium px-2 py-1`}
                          >
                            <span className="mr-1">{allergenInfo.icon}</span>
                            {allergen}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-2xl shadow-lg transition-all duration-300 font-semibold"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/worker/recipe/${recipe.id}`)
                  }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Démarrer
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ChefHat className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune recette trouvée</h3>
            <p className="text-gray-600">Essayez de sélectionner une autre catégorie</p>
          </div>
        )}
      </div>
    </div>
  )
}
