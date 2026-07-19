import { apiClient } from './apiClient'

const TOKEN_KEY = 'sy_digital_token'
const USER_KEY = 'sy_digital_user'

export const authService = {
  login: async (email, password) => {
    const res = await apiClient.post('/api/auth/login', { email, password })
    const payload = res?.data?.data
    if (payload?.token) {
      localStorage.setItem(TOKEN_KEY, payload.token)
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(payload.user))
      } catch (e) {}
    }
    return payload
  },
  register: async ({ firstName, lastName, email, password }) => {
    const res = await apiClient.post('/api/auth/register', { firstName, lastName, email, password })
    return res?.data
  },
  logout: async () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    return Promise.resolve()
  },
  fetchProfile: async () => {
    const res = await apiClient.get('/api/auth/profile')
    return res?.data?.data
  },
}

export default authService
