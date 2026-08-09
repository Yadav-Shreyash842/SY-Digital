import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const trackPageView = async (data) => {
  try {
    await axios.post(`${API_URL}/api/track/page-view`, data, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 3000,
    })
  } catch {
    // silent — tracking should never block the UI
  }
}
