import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bentoOrdersService } from '@/services/bentoOrders'

export function useBentoOrders() {
  return useQuery({
    queryKey: ['bentoOrders'],
    queryFn: bentoOrdersService.getAll,
  })
}

export function useCreateBentoOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: {
      pickup_location_id: string
      delivery_location_id: string
      items: { sku: string; quantity: number }[]
      unserved_penalty?: number | null
      comment_for_account?: string
    }) => bentoOrdersService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bentoOrders'] }),
  })
}

export function useDeleteBentoOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => bentoOrdersService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bentoOrders'] }),
  })
}
