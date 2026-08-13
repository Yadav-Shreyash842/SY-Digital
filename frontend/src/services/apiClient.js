import axios from 'axios'

const DEV_HOST = window.location.hostname || 'localhost'
const API_URL = import.meta.env.VITE_API_URL || `http://${DEV_HOST}:3000`
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || `http://${DEV_HOST}:3000`

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (attach token if present)
apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  const token = localStorage.getItem('sy_digital_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor (centralized error handling)
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sy_digital_token')
      localStorage.removeItem('sy_digital_user')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export { apiClient, API_URL, SOCKET_URL }
