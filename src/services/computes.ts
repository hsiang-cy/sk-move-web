import { apiClient } from './api'
import type { Compute, ComputeWithRoutes } from '@/types'

type TriggerBody = {
  time_limit_seconds?: number
  comment_for_account?: string
}

export const computesService = {
  async getForOrder(orderId: string): Promise<Compute[]> {
    const { data } = await apiClient.get<Compute[]>(`/orders/${orderId}/computes`)
    return data
  },

  async getById(id: string): Promise<ComputeWithRoutes> {
    const { data } = await apiClient.get<ComputeWithRoutes>(`/computes/${id}`)
    return data
  },

  async trigger(orderId: string, body?: TriggerBody): Promise<Compute> {
    const { data } = await apiClient.post<Compute>(`/orders/${orderId}/compute`, body ?? {})
    return data
  },
}
