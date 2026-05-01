import { PrismaClient } from '@prisma/client'
import PrismaUserRepository from '../../prisma/prismaUserRepository'

jest.mock('@prisma/client')

describe('PrismaUserRepository', () => {
	let mockPrismaClient: Partial<PrismaClient>
	let prismaUserRepository: PrismaUserRepository

	beforeEach(() => {
		mockPrismaClient = {
			user: {
				findUnique: jest.fn(),
				findFirst: jest.fn(),
				create: jest.fn()
			} as any
		}
		prismaUserRepository = new PrismaUserRepository(mockPrismaClient as PrismaClient)
	})

	describe('Happy Path - Operaciones válidas', () => {
		describe('findByCorreo', () => {
			it('retorna el usuario cuando existe', async () => {
			const user = {
				id: 1,
				nombre: 'Juan',
				correo: 'juan@mail.com',
				password: 'hashedPassword',
				role: 'user',
				direccion_envio: 'Calle 123'
			}
			;(mockPrismaClient.user!.findUnique as jest.Mock).mockResolvedValueOnce(user)

			const result = await prismaUserRepository.findByCorreo('juan@mail.com')

			expect(result).toEqual(user)
			expect(mockPrismaClient.user!.findUnique).toHaveBeenCalledWith({
				where: { correo: 'juan@mail.com' }
			})
			})
		})

		describe('hasUsers', () => {
			it('retorna true si existen usuarios', async () => {
				const user = { id: 1 }
				;(mockPrismaClient.user!.findFirst as jest.Mock).mockResolvedValueOnce(user)

				const result = await prismaUserRepository.hasUsers()

				expect(result).toBe(true)
				expect(mockPrismaClient.user!.findFirst).toHaveBeenCalledWith({
					select: { id: true }
				})
			})
		})

		describe('createUser', () => {
			it('crea un nuevo usuario correctamente', async () => {
				const userData = {
					nombre: 'Juan',
					correo: 'juan@mail.com',
					password: 'hashedPassword123',
					direccion_envio: 'Calle 123',
					role: 'user'
				}
				const createdUser = {
					id: 1,
					...userData
				}
				;(mockPrismaClient.user!.create as jest.Mock).mockResolvedValueOnce(createdUser)

				const result = await prismaUserRepository.createUser(userData)

				expect(result).toEqual(createdUser)
				expect(mockPrismaClient.user!.create).toHaveBeenCalledWith({
					data: userData
				})
			})
		})
	})

	describe('Negative Testing - Resultados vacíos o nulos', () => {
		describe('findByCorreo', () => {
			it('retorna null si usuario no existe', async () => {
			;(mockPrismaClient.user!.findUnique as jest.Mock).mockResolvedValueOnce(null)

			const result = await prismaUserRepository.findByCorreo('noexiste@mail.com')

			expect(result).toBeNull()
			expect(mockPrismaClient.user!.findUnique).toHaveBeenCalledWith({
				where: { correo: 'noexiste@mail.com' }
			})
			})
		})

		describe('hasUsers', () => {
			it('retorna false si no existen usuarios', async () => {
				;(mockPrismaClient.user!.findFirst as jest.Mock).mockResolvedValueOnce(null)

				const result = await prismaUserRepository.hasUsers()

				expect(result).toBe(false)
			})
		})
	})

	describe('Boundary Testing - Crear usuario con roles y datos exactos', () => {
		it('crea usuario con rol admin cuando hasUsers retorna false', async () => {
			const userData = {
				nombre: 'Admin User',
				correo: 'admin@mail.com',
				password: 'hashedPassword',
				direccion_envio: 'Calle Principal',
				role: 'admin'
			}
			const createdUser = {
				id: 1,
				...userData
			}
			;(mockPrismaClient.user!.create as jest.Mock).mockResolvedValueOnce(createdUser)

			const result = await prismaUserRepository.createUser(userData)

			expect(result.role).toBe('admin')
			expect(mockPrismaClient.user!.create).toHaveBeenCalledWith({
				data: expect.objectContaining({ role: 'admin' })
			})
		})

		it('crea usuario con rol admin cuando hasUsers retorna false', async () => {
			const userData = {
				nombre: 'Admin User',
				correo: 'admin@mail.com',
				password: 'hashedPassword',
				direccion_envio: 'Calle Principal',
				role: 'admin'
			}
			const createdUser = {
				id: 1,
				...userData
			}
			;(mockPrismaClient.user!.create as jest.Mock).mockResolvedValueOnce(createdUser)

			const result = await prismaUserRepository.createUser(userData)

			expect(result.role).toBe('admin')
			expect(mockPrismaClient.user!.create).toHaveBeenCalledWith({
				data: expect.objectContaining({ role: 'admin' })
			})
		})

		it('preserva datos exactos del usuario creado', async () => {
			const userData = {
				nombre: 'Carlos',
				correo: 'carlos@mail.com',
				password: 'hashedPassword456',
				direccion_envio: 'Avenida Principal 100',
				role: 'user'
			}
			const createdUser = {
				id: 5,
				...userData
			}
			;(mockPrismaClient.user!.create as jest.Mock).mockResolvedValueOnce(createdUser)

			const result = await prismaUserRepository.createUser(userData)

			expect(result.id).toBe(5)
			expect(result.nombre).toBe('Carlos')
			expect(result.correo).toBe('carlos@mail.com')
			expect(result.direccion_envio).toBe('Avenida Principal 100')
		})
	})
})
