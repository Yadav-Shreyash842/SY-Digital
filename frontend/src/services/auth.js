import authService from './auth.service'

export const login = (email, password) => authService.login(email, password)
export const register = (payload) => authService.register(payload)
export const fetchProfile = () => authService.fetchProfile()

export default authService
