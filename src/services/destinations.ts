import { apiClient } from './api'
import type { Destination } from '@/types'

type CreateBody = { name: string; address: string; lat: string; lng: string; comment_for_account?: string }
type UpdateBody = { name?: string; address?: string; lat?: string; lng?: string; comment_for_account?: string }

export const destinationsService = {
  async getAll(): Promise<Destination[]> {
    const { data } = await apiClient.get<Destination[]>('/destinations')
    return data.filter((d) => d.status !== 'deleted')
  },

  async create(body: CreateBody): Promise<Destination> {
    const { data } = await apiClient.post<Destination>('/destinations', body)
    return data
  },

  async update(id: string, body: UpdateBody): Promise<Destination> {
    const { data } = await apiClient.put<Destination>(`/destinations/${id}`, body)
    return data
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/destinations/${id}`)
  },
}
