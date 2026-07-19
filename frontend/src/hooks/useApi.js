import { apiClient } from '../services/apiClient'

// Lightweight wrapper — callers should implement API calls when integrating
export default function useApi() {
  return apiClient
}
