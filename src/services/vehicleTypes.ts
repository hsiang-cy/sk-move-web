import { apiClient } from './api'
import type { VehicleType } from '@/types'

type CreateBody = { name: string; capacity?: number; comment_for_account?: string }
type UpdateBody = { name?: string; capacity?: number; comment_for_account?: string }

export const vehicleTypesService = {
  async getAll(): Promise<VehicleType[]> {
    const { data } = await apiClient.get<VehicleType[]>('/vehicle-types')
    return data.filter((t) => t.status !== 'deleted')
  },

  async create(body: CreateBody): Promise<VehicleType> {
    const { data } = await apiClient.post<VehicleType>('/vehicle-types', body)
    return data
  },

  async update(id: string, body: UpdateBody): Promise<VehicleType> {
    const { data } = await apiClient.put<VehicleType>(`/vehicle-types/${id}`, body)
    return data
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/vehicle-types/${id}`)
  },
}
