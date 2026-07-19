import { apiClient } from './apiClient'

export const meetingService = {
  list: async (params) => {
    const res = await apiClient.get('/api/meetings', { params })
    return res?.data
  },
  create: async (payload) => {
    const res = await apiClient.post('/api/meetings', payload)
    return res?.data
  },
  update: async (id, payload) => {
    const res = await apiClient.patch(`/api/meetings/${id}`, payload)
    return res?.data
  },
  cancel: async (id) => {
    const res = await apiClient.delete(`/api/meetings/${id}`)
    return res?.data
  },
}

export default meetingService
