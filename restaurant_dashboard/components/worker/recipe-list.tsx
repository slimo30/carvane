"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock as PhClock, Users as PhUsers, Warning } from "phosphor-react"
import Link from "next/link"
import { WorkerHeader } from "./worker-header"
import Image from "next/image"

export function RecipeList() {
  // Mock data - would come from API
  const recipes = [
    {
      id: "1",
      name: "Poulet rôti express",
      description: "Poulet rôti avec légumes de saison",
      image: "/roasted-chicken-with-vegetables.jpg",
      estimatedTime: 15,
      allergens: ["gluten"],
      difficulty: "Facile",
    },
    {
      id: "2",
      name: "Salade César",
      description: "Salade César classique avec croûtons maison",
      image: "/caesar-salad-croutons.png",
      estimatedTime: 10,
      allergens: ["gluten", "œufs"],
      difficulty: "Facile",
    },
    {
      id: "3",
      name: "Soupe à l'oignon",
      description: "Soupe à l'oignon gratinée au fromage",
      image: "/french-onion-soup.png",
      estimatedTime: 20,
      allergens: ["lactose"],
      difficulty: "Moyen",
    },
    {
      id: "4",
      name: "Risotto aux champignons",
      description: "Risotto crémeux aux champignons de Paris",
      image: "/creamy-mushroom-risotto.png",
      estimatedTime: 25,
      allergens: ["lactose"],
      difficulty: "Moyen",
    },
    {
      id: "5",
      name: "Tarte aux pommes",
      description: "Tarte aux pommes traditionnelle",
      image: "/placeholder-0jh92.png",
      estimatedTime: 30,
      allergens: ["gluten", "œufs", "lactose"],
      difficulty: "Difficile",
    },
    {
      id: "6",
      name: "Saumon grillé",
      description: "Saumon grillé avec sauce hollandaise",
      image: "/placeholder-6njea.png",
      estimatedTime: 18,
      allergens: ["poisson", "œufs"],
      difficulty: "Moyen",
    },
  ]

  const getAllergenIcon = (allergen: string) => {
    // Simple allergen display - could be enhanced with specific icons
    return allergen
  }

  return (
    <div className="min-h-screen bg-background">
      <WorkerHeader />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Recettes Rapides</h1>
          <p className="text-muted-foreground">Choisissez une recette pour commencer votre formation</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative h-48">
                <Image src={recipe.image || "/placeholder.svg"} alt={recipe.name} fill className="object-cover" />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-xl">{recipe.name}</CardTitle>
                <CardDescription>{recipe.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <PhClock className="h-4 w-4 mr-1" />
                      {recipe.estimatedTime} min
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <PhUsers className="h-4 w-4 mr-1" />1 portion
                    </div>
                  </div>

                  {recipe.allergens.length > 0 && (
                    <div className="flex items-start space-x-2">
                      <Warning className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="flex flex-wrap gap-1">
                        {recipe.allergens.map((allergen) => (
                          <Badge key={allergen} variant="outline" className="text-xs">
                            {getAllergenIcon(allergen)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link href={`/worker/recipe/${recipe.id}`}>
                    <Button className="w-full" size="lg">
                      Démarrer
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
