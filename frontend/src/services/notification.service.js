import { apiClient } from './apiClient'

export const notificationService = {
  list: async (params) => {
    const res = await apiClient.get('/api/notifications', { params })
    return res?.data
  },
  get: async (id) => {
    const res = await apiClient.get(`/api/notifications/${id}`)
    return res?.data
  },
  markRead: async (id) => {
    const res = await apiClient.patch(`/api/notifications/${id}/read`)
    return res?.data
  },
  markAllRead: async () => {
    const res = await apiClient.patch('/api/notifications/read-all')
    return res?.data
  },
  remove: async (id) => {
    const res = await apiClient.delete(`/api/notifications/${id}`)
    return res?.data
  },
}

export default notificationService
