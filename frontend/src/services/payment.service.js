import { apiClient } from './apiClient'

export const paymentService = {
  createPaymentIntent: async (payload) => {
    const res = await apiClient.post('/api/payments', payload)
    return res?.data
  },
  list: async (params) => {
    const res = await apiClient.get('/api/payments', { params })
    return res?.data
  },
}

export default paymentService
