import express from 'express'
import { userController } from '../container/userContainer.ts'

const router = express.Router()

// Crear nuevo usuario: /user/register
router.post('/register', (req, res) => userController.register(req, res))
router.post('/login', (req, res) => userController.login(req, res))

export default router