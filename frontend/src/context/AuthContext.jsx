import React, { createContext, useEffect, useState } from 'react'
import authService from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('sy_digital_user')
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Placeholder: when integrating, sync profile from backend
  }, [])

const login = async (email, password) => {
  try {
    setLoading(true)

    const payload = await authService.login(email, password)

    if (payload?.user) {
      localStorage.setItem(
        'sy_digital_user',
        JSON.stringify(payload.user)
      )

      setUser(payload.user)
    }

    return payload
  } finally {
    setLoading(false)
  }
}

  const register = async (payload) => {
    const res = await authService.register(payload)
    return res
  }

  const logout = () => {
    localStorage.removeItem('sy_digital_token')
    localStorage.removeItem('sy_digital_user')
    setUser(null)
    return authService.logout()
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, loading, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
