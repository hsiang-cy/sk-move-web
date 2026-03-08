import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { computesService } from '@/services/computes'

export function useComputes(orderId?: string) {
  return useQuery({
    queryKey: ['computes', { orderId }],
    queryFn: () => computesService.getForOrder(orderId!),
    enabled: !!orderId,
    staleTime: 0,
  })
}

export function useCompute(computeId: string) {
  return useQuery({
    queryKey: ['compute', computeId],
    queryFn: () => computesService.getById(computeId),
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return false
      const status = data.compute_status
      return (status === 'pending' || status === 'computing') ? 3000 : false
    },
  })
}

export function useTriggerCompute() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, body }: { orderId: string; body?: { time_limit_seconds?: number; comment_for_account?: string } }) =>
      computesService.trigger(orderId, body),
    onSuccess: (_data, { orderId }) => {
      qc.invalidateQueries({ queryKey: ['computes', { orderId }] })
    },
  })
}

export function useComputeWithRoutes(computeId: string, computeStatus?: string) {
  return useQuery({
    queryKey: ['compute', computeId],
    queryFn: () => computesService.getById(computeId),
    staleTime: 300000,
    enabled: computeStatus === 'completed',
  })
}
