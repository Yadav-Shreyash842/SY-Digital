import { apiClient } from './apiClient'

export const dashboardService = {
  stats: async () => {
    const res = await apiClient.get('/api/admin/dashboard/stats')
    return res?.data
  },
  recentMeetings: async () => {
    const res = await apiClient.get('/api/admin/dashboard/recent-meetings')
    return res?.data
  },
  monthlyAnalytics: async () => {
    const res = await apiClient.get('/api/admin/dashboard/monthly-analytics')
    return res?.data
  },
  meetingStatusAnalytics: async () => {
    const res = await apiClient.get('/api/admin/dashboard/meeting-status')
    return res?.data
  },
  upcomingMeetings: async () => {
    const res = await apiClient.get('/api/admin/dashboard/upcoming-meetings')
    return res?.data
  },
  recentActivities: async () => {
    const res = await apiClient.get('/api/admin/dashboard/recent-activities')
    return res?.data
  },
}

export default dashboardService
