import { apiClient } from './apiClient'

export const messageService = {
  send: async (payload) => {
    const res = await apiClient.post('/api/messages', payload)
    return res?.data
  },
  list: async (params) => {
    const res = await apiClient.get('/api/messages', { params })
    return res?.data
  },
  get: async (id) => {
    const res = await apiClient.get(`/api/messages/${id}`)
    return res?.data
  },
  updateStatus: async (id, status) => {
    const res = await apiClient.patch(`/api/messages/${id}/status`, { status })
    return res?.data
  },
  remove: async (id) => {
    const res = await apiClient.delete(`/api/messages/${id}`)
    return res?.data
  },
  reply: async (id, adminReply) => {
    const res = await apiClient.patch(`/api/messages/${id}/reply`, { adminReply })
    return res?.data
  },
}

export default messageService
