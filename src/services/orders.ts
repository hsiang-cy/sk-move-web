import { apiClient } from './api'
import type { Order } from '@/types'

type CreateBody = {
  bento_order_ids: string[]
  vehicle_ids: string[]
  comment_for_account?: string
}

export const ordersService = {
  async getAll(): Promise<Order[]> {
    const { data } = await apiClient.get<Order[]>('/orders')
    return data.filter((o) => o.status !== 'deleted')
  },

  async getById(id: string): Promise<Order> {
    const { data } = await apiClient.get<Order>(`/orders/${id}`)
    return data
  },

  async create(body: CreateBody): Promise<Order> {
    const { data } = await apiClient.post<Order>('/orders', body)
    return data
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/orders/${id}`)
  },
}
