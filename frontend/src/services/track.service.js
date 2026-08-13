import axios from 'axios'

const DEV_HOST = window.location.hostname || 'localhost'
const API_URL = import.meta.env.VITE_API_URL || `http://${DEV_HOST}:3000`

let lastFailure = 0
const BACKOFF_MS = 60 * 1000

export const trackPageView = async (data) => {
  try {
    if (Date.now() - lastFailure < BACKOFF_MS) return
    await axios.post(`${API_URL}/api/track/page-view`, data, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 3000,
    })
  } catch {
    lastFailure = Date.now()
  }
}
