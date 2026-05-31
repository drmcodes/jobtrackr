import type { Request, Response } from 'express'
import * as userService from '../services/user.service'

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await userService.getUserById(req.userId!)
    res.json(user)
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, password } = req.body
    const user = await userService.updateUser(req.userId!, { name, password })
    res.json(user)
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message })
    } else {
      res.status(500).json({ message: 'Error interno del servidor' })
    }
  }
}
