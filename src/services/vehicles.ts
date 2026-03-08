import { apiClient } from './api'
import type { Vehicle } from '@/types'

type CreateBody = { vehicle_number: string; vehicle_type: string; depot_id?: string; comment_for_account?: string }
type UpdateBody = { vehicle_number?: string; vehicle_type?: string; depot_id?: string | null; comment_for_account?: string }

export const vehiclesService = {
  async getAll(): Promise<Vehicle[]> {
    const { data } = await apiClient.get<Vehicle[]>('/vehicles')
    return data.filter((v) => v.status !== 'deleted')
  },

  async create(body: CreateBody): Promise<Vehicle> {
    const { data } = await apiClient.post<Vehicle>('/vehicles', body)
    return data
  },

  async update(id: string, body: UpdateBody): Promise<Vehicle> {
    const { data } = await apiClient.put<Vehicle>(`/vehicles/${id}`, body)
    return data
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/vehicles/${id}`)
  },
}
