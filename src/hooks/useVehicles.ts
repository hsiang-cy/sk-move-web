import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vehiclesService } from '@/services/vehicles'

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: vehiclesService.getAll,
  })
}

export function useCreateVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { vehicle_number: string; vehicle_type: string; depot_id?: string; comment_for_account?: string }) =>
      vehiclesService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  })
}

export function useUpdateVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { vehicle_number?: string; vehicle_type?: string; depot_id?: string | null; comment_for_account?: string } }) =>
      vehiclesService.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  })
}

export function useDeleteVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => vehiclesService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['vehicles'] }),
  })
}
