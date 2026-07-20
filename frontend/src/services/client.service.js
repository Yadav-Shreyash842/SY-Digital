import { apiClient } from './apiClient'

export const clientService = {
  dashboard: async () => {
    const res = await apiClient.get('/api/client/dashboard')
    return res?.data
  },
  meetings: async () => {
    const res = await apiClient.get('/api/client/meetings')
    return res?.data
  },
  messages: async () => {
    const res = await apiClient.get('/api/client/messages')
    return res?.data
  },
  payments: async () => {
    const res = await apiClient.get('/api/client/payments')
    return res?.data
  },
  projects: async () => {
    const res = await apiClient.get('/api/client/projects')
    return res?.data
  },
  replyToMessage: async (id, text) => {
    const res = await apiClient.patch(`/api/client/messages/${id}/reply`, { text })
    return res?.data
  },
  sendMessage: async (payload) => {
    const res = await apiClient.post('/api/client/messages', payload)
    return res?.data
  },
  requestProject: async (payload) => {
    const res = await apiClient.post('/api/client/project-requests', payload)
    return res?.data
  },
  projectRequests: async () => {
    const res = await apiClient.get('/api/client/project-requests')
    return res?.data
  },
}

export default clientService
