import bcrypt from 'bcryptjs'
import User from '../models/User'

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select('-password -refreshTokens')
  if (!user) throw new Error('Usuario no encontrado')
  return user
}

export const updateUser = async (userId: string, data: { name?: string; password?: string }) => {
  const user = await User.findById(userId)
  if (!user) throw new Error('Usuario no encontrado')

  if (data.name) user.name = data.name
  if (data.password) user.password = await bcrypt.hash(data.password, 10)

  await user.save()
  return { id: user._id, name: user.name, email: user.email }
}
