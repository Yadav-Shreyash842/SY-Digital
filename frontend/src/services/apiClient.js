import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (attach token if present)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('sy_digital_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor (centralized error handling placeholder)
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // Leave error handling to callers; this is a placeholder hook
    return Promise.reject(err)
  }
)

export { apiClient, API_URL, SOCKET_URL }
