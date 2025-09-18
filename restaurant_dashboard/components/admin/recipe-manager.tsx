"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BookOpen, Plus, Search, Edit, Copy, Trash2, Clock, Users, Eye } from "lucide-react"
import { AdminLayout } from "./admin-layout"
import { RecipeEditor } from "./recipe-editor"
import Image from "next/image"

export function RecipeManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [filterDifficulty, setFilterDifficulty] = useState("all")

  // Mock data - would come from API
  const recipes = [
    {
      id: "1",
      name: "Poulet rôti express",
      description: "Poulet rôti avec légumes de saison",
      image: "/roasted-chicken-with-vegetables.jpg",
      estimatedTime: 15,
      difficulty: "Facile",
      allergens: ["gluten"],
      steps: 5,
      ingredients: 5,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
      version: "1.2",
      isActive: true,
      usageCount: 45,
    },
    {
      id: "2",
      name: "Salade César",
      description: "Salade César classique avec croûtons maison",
      image: "/caesar-salad-croutons.png",
      estimatedTime: 10,
      difficulty: "Facile",
      allergens: ["gluten", "œufs"],
      steps: 4,
      ingredients: 8,
      createdAt: "2024-01-02T00:00:00Z",
      updatedAt: "2024-01-12T00:00:00Z",
      version: "1.0",
      isActive: true,
      usageCount: 32,
    },
    {
      id: "3",
      name: "Soupe à l'oignon",
      description: "Soupe à l'oignon gratinée au fromage",
      image: "/french-onion-soup.png",
      estimatedTime: 20,
      difficulty: "Moyen",
      allergens: ["lactose"],
      steps: 6,
      ingredients: 6,
      createdAt: "2024-01-03T00:00:00Z",
      updatedAt: "2024-01-08T00:00:00Z",
      version: "2.1",
      isActive: true,
      usageCount: 28,
    },
    {
      id: "4",
      name: "Risotto aux champignons",
      description: "Risotto crémeux aux champignons de Paris",
      image: "/creamy-mushroom-risotto.png",
      estimatedTime: 25,
      difficulty: "Moyen",
      allergens: ["lactose"],
      steps: 7,
      ingredients: 9,
      createdAt: "2024-01-04T00:00:00Z",
      updatedAt: "2024-01-14T00:00:00Z",
      version: "1.3",
      isActive: true,
      usageCount: 19,
    },
    {
      id: "5",
      name: "Tarte aux pommes",
      description: "Tarte aux pommes traditionnelle",
      image: "/placeholder-0jh92.png",
      estimatedTime: 30,
      difficulty: "Difficile",
      allergens: ["gluten", "œufs", "lactose"],
      steps: 8,
      ingredients: 7,
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-05T00:00:00Z",
      version: "1.0",
      isActive: false,
      usageCount: 5,
    },
    {
      id: "6",
      name: "Saumon grillé",
      description: "Saumon grillé avec sauce hollandaise",
      image: "/placeholder-6njea.png",
      estimatedTime: 18,
      difficulty: "Moyen",
      allergens: ["poisson", "œufs"],
      steps: 6,
      ingredients: 8,
      createdAt: "2024-01-06T00:00:00Z",
      updatedAt: "2024-01-13T00:00:00Z",
      version: "1.1",
      isActive: true,
      usageCount: 22,
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Facile":
        return "default"
      case "Moyen":
        return "secondary"
      case "Difficile":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = filterDifficulty === "all" || recipe.difficulty === filterDifficulty
    return matchesSearch && matchesDifficulty
  })

  const handleDuplicateRecipe = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId)
    if (recipe) {
      console.log("[Duplicate Recipe]", recipe)
      alert(`Recette "${recipe.name}" dupliquée avec succès !`)
    }
  }

  const handleDeleteRecipe = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId)
    if (recipe && confirm(`Êtes-vous sûr de vouloir supprimer "${recipe.name}" ?`)) {
      console.log("[Delete Recipe]", recipeId)
      alert("Recette supprimée avec succès !")
    }
  }

  const handleToggleActive = (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId)
    if (recipe) {
      console.log("[Toggle Recipe Active]", { recipeId, newStatus: !recipe.isActive })
      alert(`Recette ${!recipe.isActive ? "activée" : "désactivée"} avec succès !`)
    }
  }

  if (selectedRecipe || isCreating) {
    return (
      <RecipeEditor
        recipeId={selectedRecipe}
        onClose={() => {
          setSelectedRecipe(null)
          setIsCreating(false)
        }}
        onSave={(recipeData) => {
          console.log("[Save Recipe]", recipeData)
          alert("Recette sauvegardée avec succès !")
          setSelectedRecipe(null)
          setIsCreating(false)
        }}
      />
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Gestion des Recettes</h2>
            <p className="text-muted-foreground">
              Créez et gérez les recettes de formation ({filteredRecipes.length} recettes)
            </p>
          </div>

          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle recette
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
                  placeholder="Rechercher une recette..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="all">Toutes difficultés</option>
                <option value="Facile">Facile</option>
                <option value="Moyen">Moyen</option>
                <option value="Difficile">Difficile</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Recipe Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              className={`hover:shadow-lg transition-shadow ${!recipe.isActive ? "opacity-60 border-dashed" : ""}`}
            >
              <div className="relative h-48">
                <Image
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Badge variant={getDifficultyColor(recipe.difficulty)}>{recipe.difficulty}</Badge>
                  {!recipe.isActive && (
                    <Badge variant="outline" className="bg-white/90">
                      Inactive
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="outline" className="bg-white/90 text-xs">
                    v{recipe.version}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg">{recipe.name}</CardTitle>
                <CardDescription>{recipe.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {recipe.estimatedTime} min
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-1" />
                      {recipe.usageCount} utilisations
                    </div>
                    <div className="text-muted-foreground">{recipe.steps} étapes</div>
                    <div className="text-muted-foreground">{recipe.ingredients} ingrédients</div>
                  </div>

                  {recipe.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {recipe.allergens.map((allergen) => (
                        <Badge key={allergen} variant="outline" className="text-xs">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">Modifiée le {formatDate(recipe.updatedAt)}</div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedRecipe(recipe.id)}>
                      <Edit className="h-3 w-3 mr-1" />
                      Éditer
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => handleDuplicateRecipe(recipe.id)}>
                      <Copy className="h-3 w-3" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => handleToggleActive(recipe.id)}>
                      <Eye className={`h-3 w-3 ${recipe.isActive ? "text-green-500" : "text-muted-foreground"}`} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRecipes.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune recette trouvée</h3>
              <p className="text-muted-foreground mb-4">Aucune recette ne correspond à vos critères de recherche.</p>
              <Button onClick={() => setSearchTerm("")}>Effacer les filtres</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
