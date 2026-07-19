import { apiClient } from './apiClient'

export const reviewService = {
  list: async (params) => {
    const res = await apiClient.get('/api/reviews', { params })
    return res?.data
  },
  approve: async (id, payload) => {
    const res = await apiClient.patch(`/api/reviews/${id}`, payload)
    return res?.data
  },
}

export default reviewService
