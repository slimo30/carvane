import ModernRecipeExecution from "@/components/worker/modern-recipe-execution"

interface RecipePageProps {
  params: {
    id: string
  }
}

export default function RecipePage({ params }: RecipePageProps) {
  return <ModernRecipeExecution recipeId={params.id} />
}
