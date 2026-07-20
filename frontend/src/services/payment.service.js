import { apiClient } from './apiClient'

export const paymentService = {
  create: async (payload) => {
    const res = await apiClient.post('/api/payments', payload)
    return res?.data
  },
  list: async (params) => {
    const res = await apiClient.get('/api/payments', { params })
    return res?.data
  },
  getById: async (id) => {
    const res = await apiClient.get(`/api/payments/${id}`)
    return res?.data
  },
  updateStatus: async (id, paymentStatus) => {
    const res = await apiClient.patch(`/api/payments/${id}/status`, { paymentStatus })
    return res?.data
  },
  stats: async () => {
    const res = await apiClient.get('/api/payments/dashboard/stats')
    return res?.data
  },
  monthlyAnalytics: async () => {
    const res = await apiClient.get('/api/payments/dashboard/monthly-analytics')
    return res?.data
  },
}

export default paymentService
