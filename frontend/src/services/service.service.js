import { apiClient } from './apiClient'

export const serviceService = {
  list: async (params = {}) => {
    const res = await apiClient.get('/api/services', { params })
    return res?.data
  },
  get: async (slug) => {
    const res = await apiClient.get(`/api/services/${slug}`)
    return res?.data
  },
  featured: async () => {
    const res = await apiClient.get('/api/services/featured')
    return res?.data
  },
  stats: async () => {
    const res = await apiClient.get('/api/services/stats')
    return res?.data
  },
  create: async (payload) => {
    const res = await apiClient.post('/api/services', payload)
    return res?.data
  },
  update: async (id, payload) => {
    const res = await apiClient.patch(`/api/services/${id}`, payload)
    return res?.data
  },
  remove: async (id) => {
    const res = await apiClient.delete(`/api/services/${id}`)
    return res?.data
  },
}

export default serviceService
