import { Router } from 'express'
import { userController } from '../container/userContainer.js'

const router = Router()

// Crear nuevo usuario: /user/register
router.post('/register', (req, res) => userController.register(req, res))

export default router