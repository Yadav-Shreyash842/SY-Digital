import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function RoleRoute({ allowedRoles = [], redirectTo = '/unauthorized' }) {
  const { user } = useAuth() || {}
  if (!user) return <Navigate to="/login" replace />
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />
  }
  return <Outlet />
}
