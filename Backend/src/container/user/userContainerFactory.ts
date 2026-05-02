import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import PrismaUserRepository from '../../repositories/prisma/prismaUserRepository.ts'
import UserService from '../../services/user/userService.ts'
import UserController from '../../controllers/user/userController.ts'

type UserContainerClass<T = any> = new (...args: any[]) => T

interface UserContainerDependencies {
	databaseUrl?: string
	prismaClientClass?: UserContainerClass
	prismaMariaDbClass?: UserContainerClass
	userRepositoryClass?: UserContainerClass
	userServiceClass?: UserContainerClass
	userControllerClass?: UserContainerClass
}

function createUserContainer(dependencies: UserContainerDependencies = {}) {
	const databaseUrl = dependencies.databaseUrl ?? process.env.DATABASE_URL
	if (!databaseUrl) {
		throw new Error('DATABASE_URL no esta definida en variables de entorno')
	}

	const PrismaClientClass = dependencies.prismaClientClass ?? PrismaClient
	const PrismaMariaDbClass = dependencies.prismaMariaDbClass ?? PrismaMariaDb
	const UserRepositoryClass = dependencies.userRepositoryClass ?? PrismaUserRepository
	const UserServiceClass = dependencies.userServiceClass ?? UserService
	const UserControllerClass = dependencies.userControllerClass ?? UserController

	const adapter = new PrismaMariaDbClass(databaseUrl)
	const prisma = new PrismaClientClass({ adapter })
	const userRepository = new UserRepositoryClass(prisma)
	const userService = new UserServiceClass(userRepository)
	const userController = new UserControllerClass(userService)

	return { userController }
}

export { createUserContainer }