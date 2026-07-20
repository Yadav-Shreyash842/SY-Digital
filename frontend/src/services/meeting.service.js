import { apiClient } from './apiClient'

export const meetingService = {
  list: async (params) => {
    const res = await apiClient.get('/api/meetings', { params })
    return res?.data
  },
  getById: async (id) => {
    const res = await apiClient.get(`/api/meetings/${id}`)
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
  remove: async (id) => {
    const res = await apiClient.delete(`/api/meetings/${id}`)
    return res?.data
  },
  updateStatus: async (id, { status, adminNotes, meetingLink }) => {
    const res = await apiClient.patch(`/api/meetings/${id}/status`, { status, adminNotes, meetingLink })
    return res?.data
  },
  reschedule: async (id, { meetingDate, meetingTime }) => {
    const res = await apiClient.patch(`/api/meetings/${id}/reschedule`, { meetingDate, meetingTime })
    return res?.data
  },
  cancel: async (id, reason) => {
    const res = await apiClient.patch(`/api/meetings/${id}/cancel`, { reason })
    return res?.data
  },
  history: async (id) => {
    const res = await apiClient.get(`/api/meetings/${id}/history`)
    return res?.data
  },
}

export default meetingService
