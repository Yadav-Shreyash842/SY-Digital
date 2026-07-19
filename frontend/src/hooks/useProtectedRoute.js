import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from './useAuth'

export default function useProtectedRoute() {
  const { user } = useAuth() || {}
  const navigate = useNavigate()

  useEffect(() => {
    if (user === null) {
      // Not authenticated; navigate to login when integrating
      // Do not perform navigation during scaffolding
    }
  }, [user, navigate])
}
