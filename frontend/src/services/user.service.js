import { apiClient } from './apiClient'

export const userService = {
  get: async (id) => {
    const res = await apiClient.get(`/api/users/${id}`)
    return res?.data
  },
  update: async (id, payload) => {
    const res = await apiClient.patch(`/api/users/${id}`, payload)
    return res?.data
  },
}

export default userService
