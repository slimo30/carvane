"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Trash2, GripVertical, Upload, Timer, Save, Eye } from "lucide-react"
import { AdminLayout } from "./admin-layout"
import Image from "next/image"

interface RecipeEditorProps {
  recipeId?: string | null
  onClose: () => void
  onSave: (recipeData: any) => void
}

interface RecipeStep {
  id: string
  index: number
  instruction: string
  timeSec?: number
  image?: string
}

interface Ingredient {
  id: string
  name: string
  quantity: string
  unit?: string
}

export function RecipeEditor({ recipeId, onClose, onSave }: RecipeEditorProps) {
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    image: "",
    estimatedTime: 15,
    difficulty: "Facile",
    allergens: [] as string[],
    isActive: true,
  })

  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: "1", name: "", quantity: "", unit: "" }])

  const [steps, setSteps] = useState<RecipeStep[]>([
    { id: "1", index: 1, instruction: "", timeSec: undefined, image: "" },
  ])

  const [draggedStep, setDraggedStep] = useState<number | null>(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const allergenOptions = [
    "gluten",
    "lactose",
    "œufs",
    "poisson",
    "fruits de mer",
    "arachides",
    "fruits à coque",
    "soja",
    "céleri",
    "moutarde",
    "sésame",
    "sulfites",
  ]

  const difficultyOptions = ["Facile", "Moyen", "Difficile"]

  useEffect(() => {
    if (recipeId) {
      // Mock loading existing recipe - would come from API
      const mockRecipe = {
        name: "Poulet rôti express",
        description: "Poulet rôti avec légumes de saison",
        image: "/roasted-chicken-with-vegetables.jpg",
        estimatedTime: 15,
        difficulty: "Facile",
        allergens: ["gluten"],
        isActive: true,
      }

      const mockIngredients = [
        { id: "1", name: "Poulet", quantity: "180", unit: "g" },
        { id: "2", name: "Pommes de terre", quantity: "200", unit: "g" },
        { id: "3", name: "Carottes", quantity: "100", unit: "g" },
        { id: "4", name: "Huile d'olive", quantity: "2", unit: "c.à.s" },
        { id: "5", name: "Sel, poivre", quantity: "Au goût", unit: "" },
      ]

      const mockSteps = [
        {
          id: "1",
          index: 1,
          instruction: "Préchauffer le four à 200°C et assaisonner le poulet avec sel et poivre",
          timeSec: 120,
        },
        {
          id: "2",
          index: 2,
          instruction: "Couper les légumes en morceaux moyens et les disposer autour du poulet",
          timeSec: 180,
        },
        { id: "3", index: 3, instruction: "Arroser d'huile d'olive et enfourner", timeSec: 60 },
        { id: "4", index: 4, instruction: "Cuire pendant 12 minutes en surveillant la coloration", timeSec: 720 },
        {
          id: "5",
          index: 5,
          instruction: "Vérifier la cuisson et laisser reposer 2 minutes avant de servir",
          timeSec: 120,
        },
      ]

      setRecipe(mockRecipe)
      setIngredients(mockIngredients)
      setSteps(mockSteps)
    }
  }, [recipeId])

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: "",
      quantity: "",
      unit: "",
    }
    setIngredients([...ingredients, newIngredient])
  }

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id))
  }

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)))
  }

  const addStep = () => {
    const newStep: RecipeStep = {
      id: Date.now().toString(),
      index: steps.length + 1,
      instruction: "",
      timeSec: undefined,
      image: "",
    }
    setSteps([...steps, newStep])
  }

  const removeStep = (id: string) => {
    const newSteps = steps.filter((step) => step.id !== id)
    // Reindex steps
    const reindexedSteps = newSteps.map((step, index) => ({
      ...step,
      index: index + 1,
    }))
    setSteps(reindexedSteps)
  }

  const updateStep = (id: string, field: keyof RecipeStep, value: string | number) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, [field]: value } : step)))
  }

  const handleDragStart = (index: number) => {
    setDraggedStep(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedStep === null) return

    const newSteps = [...steps]
    const draggedItem = newSteps[draggedStep]
    newSteps.splice(draggedStep, 1)
    newSteps.splice(dropIndex, 0, draggedItem)

    // Reindex steps
    const reindexedSteps = newSteps.map((step, index) => ({
      ...step,
      index: index + 1,
    }))

    setSteps(reindexedSteps)
    setDraggedStep(null)
  }

  const toggleAllergen = (allergen: string) => {
    if (recipe.allergens.includes(allergen)) {
      setRecipe({
        ...recipe,
        allergens: recipe.allergens.filter((a) => a !== allergen),
      })
    } else {
      setRecipe({
        ...recipe,
        allergens: [...recipe.allergens, allergen],
      })
    }
  }

  const handleSave = () => {
    const recipeData = {
      ...recipe,
      ingredients: ingredients.filter((ing) => ing.name.trim()),
      steps: steps.filter((step) => step.instruction.trim()),
      updatedAt: new Date().toISOString(),
    }
    onSave(recipeData)
  }

  const formatTime = (seconds?: number) => {
    if (!seconds) return ""
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isPreviewMode) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setIsPreviewMode(false)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'édition
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>

          {/* Recipe Preview */}
          <Card>
            <div className="relative h-64">
              {recipe.image && (
                <Image
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              )}
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{recipe.name}</CardTitle>
                  <CardDescription>{recipe.description}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Badge variant="outline">{recipe.difficulty}</Badge>
                  <Badge variant="secondary">
                    <Timer className="h-3 w-3 mr-1" />
                    {recipe.estimatedTime} min
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Ingrédients</h3>
                  <ul className="space-y-2">
                    {ingredients
                      .filter((ing) => ing.name.trim())
                      .map((ingredient) => (
                        <li key={ingredient.id} className="flex justify-between text-sm">
                          <span>{ingredient.name}</span>
                          <span className="text-muted-foreground">
                            {ingredient.quantity} {ingredient.unit}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Allergènes</h3>
                  <div className="flex flex-wrap gap-1">
                    {recipe.allergens.map((allergen) => (
                      <Badge key={allergen} variant="outline" className="text-xs">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-3">Étapes</h3>
                <div className="space-y-4">
                  {steps
                    .filter((step) => step.instruction.trim())
                    .map((step) => (
                      <div key={step.id} className="flex space-x-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {step.index}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">{step.instruction}</p>
                          {step.timeSec && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              <Timer className="h-3 w-3 mr-1" />
                              {formatTime(step.timeSec)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{recipeId ? "Éditer la recette" : "Nouvelle recette"}</h2>
              <p className="text-muted-foreground">
                {recipeId ? "Modifiez les détails de la recette" : "Créez une nouvelle recette de formation"}
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsPreviewMode(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Aperçu
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la recette</Label>
                <Input
                  id="name"
                  value={recipe.name}
                  onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
                  placeholder="Ex: Poulet rôti express"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={recipe.description}
                  onChange={(e) => setRecipe({ ...recipe, description: e.target.value })}
                  placeholder="Description courte de la recette"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="estimatedTime">Temps estimé (minutes)</Label>
                  <Input
                    id="estimatedTime"
                    type="number"
                    value={recipe.estimatedTime}
                    onChange={(e) => setRecipe({ ...recipe, estimatedTime: Number.parseInt(e.target.value) || 0 })}
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulté</Label>
                  <select
                    id="difficulty"
                    value={recipe.difficulty}
                    onChange={(e) => setRecipe({ ...recipe, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    {difficultyOptions.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label>Image de la recette</Label>
                <div className="mt-2">
                  {recipe.image ? (
                    <div className="relative h-32 w-full border rounded-lg overflow-hidden">
                      <Image
                        src={recipe.image || "/placeholder.svg"}
                        alt="Recipe preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setRecipe({ ...recipe, image: "" })}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Glissez une image ou cliquez pour télécharger
                      </p>
                      <Button variant="outline" size="sm">
                        Choisir une image
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={recipe.isActive}
                  onCheckedChange={(checked) => setRecipe({ ...recipe, isActive: checked })}
                />
                <Label htmlFor="isActive">Recette active</Label>
              </div>
            </CardContent>
          </Card>

          {/* Allergens */}
          <Card>
            <CardHeader>
              <CardTitle>Allergènes</CardTitle>
              <CardDescription>Sélectionnez les allergènes présents dans cette recette</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {allergenOptions.map((allergen) => (
                  <div
                    key={allergen}
                    className={`p-2 border rounded-lg cursor-pointer transition-colors ${
                      recipe.allergens.includes(allergen)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => toggleAllergen(allergen)}
                  >
                    <div className="text-sm font-medium">{allergen}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ingrédients</CardTitle>
              <Button variant="outline" size="sm" onClick={addIngredient}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="flex items-center space-x-3">
                  <div className="flex-1">
                    <Input
                      placeholder="Nom de l'ingrédient"
                      value={ingredient.name}
                      onChange={(e) => updateIngredient(ingredient.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      placeholder="Quantité"
                      value={ingredient.quantity}
                      onChange={(e) => updateIngredient(ingredient.id, "quantity", e.target.value)}
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      placeholder="Unité"
                      value={ingredient.unit || ""}
                      onChange={(e) => updateIngredient(ingredient.id, "unit", e.target.value)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeIngredient(ingredient.id)}
                    disabled={ingredients.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Étapes de préparation</CardTitle>
              <Button variant="outline" size="sm" onClick={addStep}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter étape
              </Button>
            </div>
            <CardDescription>Glissez-déposez les étapes pour les réorganiser</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="border rounded-lg p-4"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center space-x-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                        {step.index}
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <Textarea
                        placeholder="Décrivez cette étape en détail..."
                        value={step.instruction}
                        onChange={(e) => updateStep(step.id, "instruction", e.target.value)}
                        rows={2}
                      />

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`timer-${step.id}`} className="text-sm">
                            Minuteur (secondes):
                          </Label>
                          <Input
                            id={`timer-${step.id}`}
                            type="number"
                            placeholder="120"
                            value={step.timeSec || ""}
                            onChange={(e) =>
                              updateStep(step.id, "timeSec", Number.parseInt(e.target.value) || undefined)
                            }
                            className="w-20"
                            min="0"
                          />
                          {step.timeSec && (
                            <span className="text-xs text-muted-foreground">({formatTime(step.timeSec)})</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" onClick={() => removeStep(step.id)} disabled={steps.length === 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
