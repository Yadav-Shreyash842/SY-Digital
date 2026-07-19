import { apiClient } from './apiClient'

export const blogService = {
  list: async (params) => {
    const res = await apiClient.get('/api/blogs', { params })
    return res?.data
  },
  get: async (id) => {
    const res = await apiClient.get(`/api/blogs/${id}`)
    return res?.data
  },
  create: async (payload) => {
    const res = await apiClient.post('/api/blogs', payload)
    return res?.data
  },
  update: async (id, payload) => {
    const res = await apiClient.patch(`/api/blogs/${id}`, payload)
    return res?.data
  },
  remove: async (id) => {
    const res = await apiClient.delete(`/api/blogs/${id}`)
    return res?.data
  },
}

export default blogService
