import { apiClient } from './apiClient'

export const settingService = {
  get: async () => {
    const res = await apiClient.get('/api/settings')
    return res?.data?.data
  },
  update: async (data) => {
    const res = await apiClient.patch('/api/settings', data)
    return res?.data?.data
  },
}

export default settingService
