import { apiClient } from './apiClient'

export const userService = {
  list: async (params = {}) => {
    const res = await apiClient.get('/api/users', { params })
    return res?.data
  },
  get: async (id) => {
    const res = await apiClient.get(`/api/users/${id}`)
    return res?.data
  },
  create: async (payload) => {
    const res = await apiClient.post('/api/auth/register', payload)
    return res?.data
  },
  update: async (id, payload) => {
    const res = await apiClient.patch(`/api/users/${id}`, payload)
    return res?.data
  },
  remove: async (id) => {
    const res = await apiClient.delete(`/api/users/${id}`)
    return res?.data
  },
}

export default userService
