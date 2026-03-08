import { apiClient } from './api'
import type { BentoOrder } from '@/types'

type CreateBody = {
  pickup_location_id: string
  delivery_location_id: string
  items: { sku: string; quantity: number }[]
  unserved_penalty?: number | null
  comment_for_account?: string
}

export const bentoOrdersService = {
  async getAll(): Promise<BentoOrder[]> {
    const { data } = await apiClient.get<BentoOrder[]>('/bento-orders')
    return data.filter((o) => o.status !== 'deleted')
  },

  async getById(id: string): Promise<BentoOrder> {
    const { data } = await apiClient.get<BentoOrder>(`/bento-orders/${id}`)
    return data
  },

  async create(body: CreateBody): Promise<BentoOrder> {
    const { data } = await apiClient.post<BentoOrder>('/bento-orders', body)
    return data
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/bento-orders/${id}`)
  },
}
