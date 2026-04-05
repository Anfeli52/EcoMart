import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import PrismaUserRepository from '../repositories/prisma/prismaUserRepository.js'
import UserService from '../services/userService.js'
import UserController from '../controllers/userController.js'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
	throw new Error('DATABASE_URL no esta definida en variables de entorno')
}

const adapter = new PrismaMariaDb(databaseUrl)
const prisma = new PrismaClient({ adapter })

// Inyeccion de dependencias de endpoints de usuarios
const userRepository = new PrismaUserRepository(prisma)
const userService = new UserService(userRepository)
const userController = new UserController(userService)

export { userController }