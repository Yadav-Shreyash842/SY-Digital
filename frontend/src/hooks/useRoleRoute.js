import useAuth from './useAuth'

export default function useRoleRoute(requiredRoles = []) {
  const { user } = useAuth() || {}
  if (!user) return false
  if (!requiredRoles || requiredRoles.length === 0) return true
  return requiredRoles.includes(user.role)
}
