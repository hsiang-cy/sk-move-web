import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersService } from '@/services/orders'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getAll,
    staleTime: 30000,
  })
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersService.getById(orderId),
    enabled: !!orderId,
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { bento_order_ids: string[]; vehicle_ids: string[]; comment_for_account?: string }) =>
      ordersService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}

export function useDeleteOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => ordersService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })
}
