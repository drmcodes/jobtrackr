import api from './api'

export interface UserProfile {
  _id: string
  name: string
  email: string
  createdAt: string
}

export const getProfile = async (): Promise<UserProfile> => {
  const res = await api.get('/users/me')
  return res.data
}

export const updateProfile = async (data: { name?: string; password?: string }): Promise<{ id: string; name: string; email: string }> => {
  const res = await api.put('/users/me', data)
  return res.data
}
