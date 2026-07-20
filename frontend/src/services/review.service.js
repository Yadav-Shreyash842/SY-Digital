import { apiClient } from './apiClient'

export const reviewService = {
  list: async (params = {}) => {
    const res = await apiClient.get('/api/reviews', { params })
    return res?.data
  },
  featured: async () => {
    const res = await apiClient.get('/api/reviews/featured')
    return res?.data
  },
  getById: async (id) => {
    const res = await apiClient.get(`/api/reviews/${id}`)
    return res?.data
  },
  create: async (payload) => {
    const res = await apiClient.post('/api/reviews', payload)
    return res?.data
  },
  update: async (id, payload) => {
    const res = await apiClient.patch(`/api/reviews/${id}`, payload)
    return res?.data
  },
  remove: async (id) => {
    const res = await apiClient.delete(`/api/reviews/${id}`)
    return res?.data
  },
  stats: async () => {
    const res = await apiClient.get('/api/reviews/dashboard/stats')
    return res?.data
  },
  ratingAnalytics: async () => {
    const res = await apiClient.get('/api/reviews/dashboard/rating-analytics')
    return res?.data
  },
}

export default reviewService
