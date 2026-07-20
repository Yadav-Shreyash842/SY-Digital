import { apiClient } from './apiClient'

export const projectRequestService = {
  list: async (params = {}) => {
    const res = await apiClient.get('/api/project-requests', { params })
    return res?.data
  },
  getById: async (id) => {
    const res = await apiClient.get(`/api/project-requests/${id}`)
    return res?.data
  },
  updateStatus: async (id, { status, adminNotes }) => {
    const res = await apiClient.patch(`/api/project-requests/${id}/status`, { status, adminNotes })
    return res?.data
  },
}

export default projectRequestService
