import { Router } from 'express'
import { authenticate } from '../middleware/auth.middleware'
import * as userController from '../controllers/user.controller'

const router = Router()

router.get('/me', authenticate, userController.getProfile)
router.put('/me', authenticate, userController.updateProfile)

export default router
