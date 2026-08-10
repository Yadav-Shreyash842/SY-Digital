import { apiClient } from './apiClient'

export const roleService = {
  getAll: async () => {
    const res = await apiClient.get('/api/roles')
    return res?.data?.data
  },
}

export default roleService
