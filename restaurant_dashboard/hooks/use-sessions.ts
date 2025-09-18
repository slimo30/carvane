import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sessionApi } from "@/lib/api"
import type { Session } from "@/lib/types"

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: sessionApi.getAll,
  })
}

export function useSession(id: string) {
  return useQuery({
    queryKey: ["sessions", id],
    queryFn: () => sessionApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sessionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
    },
  })
}

export function useUpdateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, session }: { id: string; session: Partial<Session> }) => sessionApi.update(id, session),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      queryClient.invalidateQueries({ queryKey: ["sessions", id] })
    },
  })
}

export function useRequestValidation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: sessionApi.requestValidation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
    },
  })
}
