import { apiClient } from './apiClient'

export const analyticsService = {
  visitorStats: async (range = '30d') => {
    const res = await apiClient.get(`/api/admin/analytics/visitor-stats?range=${range}`)
    return res?.data
  },
  traffic: async (range = '30d') => {
    const res = await apiClient.get(`/api/admin/analytics/traffic?range=${range}`)
    return res?.data
  },
}

export default analyticsService
