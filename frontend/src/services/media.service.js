import { apiClient } from './apiClient'

export const mediaService = {
  getAll: async (params = {}) => {
    const res = await apiClient.get('/api/media', { params })
    return res?.data?.data
  },
  remove: async (id) => {
    const res = await apiClient.delete(`/api/media/${id}`)
    return res?.data
  },
}

export default mediaService
