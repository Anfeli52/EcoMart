import { describe, expect, it } from '@jest/globals'
import { createUserContainer } from './userContainerFactory.ts'

class PrismaMariaDbMock {
	databaseUrl: string

	constructor(databaseUrl: string) {
		this.databaseUrl = databaseUrl
	}
}

class PrismaClientMock {
	config: { adapter: PrismaMariaDbMock }

	constructor(config: { adapter: PrismaMariaDbMock }) {
		this.config = config
	}
}

class UserRepositoryMock {
	prisma: PrismaClientMock

	constructor(prisma: PrismaClientMock) {
		this.prisma = prisma
	}
}

class UserServiceMock {
	userRepository: UserRepositoryMock

	constructor(userRepository: UserRepositoryMock) {
		this.userRepository = userRepository
	}
}

class UserControllerMock {
	userService: UserServiceMock

	constructor(userService: UserServiceMock) {
		this.userService = userService
	}
}

describe('userContainerFactory', () => {
	describe('Happy Path - Construcción de dependencias', () => {
		it('construye las dependencias usando el databaseUrl recibido', () => {
		const databaseUrl = 'mariadb://localhost:3306/ecomart'

		const { userController } = createUserContainer({
			databaseUrl,
			prismaClientClass: PrismaClientMock,
			prismaMariaDbClass: PrismaMariaDbMock,
			userRepositoryClass: UserRepositoryMock,
			userServiceClass: UserServiceMock,
			userControllerClass: UserControllerMock
		})

		expect(userController).toBeInstanceOf(UserControllerMock)
		expect(userController.userService).toBeInstanceOf(UserServiceMock)
		expect(userController.userService.userRepository).toBeInstanceOf(UserRepositoryMock)
		expect(userController.userService.userRepository.prisma).toBeInstanceOf(PrismaClientMock)
		expect(userController.userService.userRepository.prisma.config.adapter).toBeInstanceOf(PrismaMariaDbMock)
		expect(userController.userService.userRepository.prisma.config.adapter.databaseUrl).toBe(databaseUrl)
		})
	})

	describe('Negative Testing - Configuración faltante', () => {
		it('lanza error si no recibe databaseUrl y no existe DATABASE_URL', () => {
			const originalDatabaseUrl = process.env.DATABASE_URL
			delete process.env.DATABASE_URL

			try {
				expect(() => createUserContainer()).toThrow(
					'DATABASE_URL no esta definida en variables de entorno'
				)
			} finally {
				if (originalDatabaseUrl === undefined) {
					delete process.env.DATABASE_URL
				} else {
					process.env.DATABASE_URL = originalDatabaseUrl
				}
			}
		})
	})
})
