import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { recipeApi } from "@/lib/api"
import type { Recipe } from "@/lib/types"

export function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: recipeApi.getAll,
  })
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: ["recipes", id],
    queryFn: () => recipeApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: recipeApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] })
    },
  })
}

export function useUpdateRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, recipe }: { id: string; recipe: Partial<Recipe> }) => recipeApi.update(id, recipe),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] })
      queryClient.invalidateQueries({ queryKey: ["recipes", id] })
    },
  })
}

export function useDeleteRecipe() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: recipeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] })
    },
  })
}
