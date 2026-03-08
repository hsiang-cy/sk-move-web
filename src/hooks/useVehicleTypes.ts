import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vehicleTypesService } from '@/services/vehicleTypes'

export function useVehicleTypes() {
  return useQuery({
    queryKey: ['vehicleTypes'],
    queryFn: vehicleTypesService.getAll,
  })
}

export function useCreateVehicleType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; capacity?: number; comment_for_account?: string }) =>
      vehicleTypesService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicleTypes'] }),
  })
}

export function useUpdateVehicleType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; capacity?: number; comment_for_account?: string } }) =>
      vehicleTypesService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicleTypes'] }),
  })
}

export function useDeleteVehicleType() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vehicleTypesService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicleTypes'] }),
  })
}
