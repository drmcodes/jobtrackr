import api from './api'

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: { id: string; name: string; email: string }
}

export const login = async (data: LoginInput): Promise<AuthResponse> => {
  const res = await api.post('/auth/login', data)
  return res.data
}

export const register = async (data: RegisterInput): Promise<{ userId: string }> => {
  const res = await api.post('/auth/register', data)
  return res.data
}

export const logout = async (refreshToken: string): Promise<void> => {
  await api.post('/auth/logout', { token: refreshToken })
}
