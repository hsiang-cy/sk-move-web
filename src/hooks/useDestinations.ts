import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { destinationsService } from '@/services/destinations'

export function useDestinations() {
  return useQuery({
    queryKey: ['destinations'],
    queryFn: destinationsService.getAll,
  })
}

export function useCreateDestination() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { name: string; address: string; lat: string; lng: string; comment_for_account?: string }) =>
      destinationsService.create(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['destinations'] }),
  })
}

export function useUpdateDestination() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; address?: string; lat?: string; lng?: string; comment_for_account?: string } }) =>
      destinationsService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['destinations'] }),
  })
}

export function useDeleteDestination() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => destinationsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['destinations'] }),
  })
}
