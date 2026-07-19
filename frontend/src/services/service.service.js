import { apiClient } from './apiClient'

export const serviceService = {
  list: async (params) => {
    const res = await apiClient.get('/api/services', { params })
    return res?.data
  },
  get: async (id) => {
    const res = await apiClient.get(`/api/services/${id}`)
    return res?.data
  },
}

export default serviceService
