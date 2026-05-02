import UserService from './userService'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface UserRepository {
	findByCorreo(correo: string): Promise<any>
	hasUsers(): Promise<boolean>
	createUser(userData: any): Promise<any>
}

jest.mock('bcrypt')
jest.mock('jsonwebtoken')

describe('UserService', () => {
	let mockUserRepository: UserRepository
	let userService: UserService

	beforeEach(() => {
		mockUserRepository = {
			findByCorreo: jest.fn(),
			hasUsers: jest.fn(),
			createUser: jest.fn()
		}
		userService = new UserService(mockUserRepository)
		jest.clearAllMocks()
		process.env.JWT_SECRET = 'test-secret'
	})

	describe('Happy Path - Operaciones válidas', () => {
		describe('register', () => {
			it('crea un nuevo usuario correctamente', async () => {
			const userData = {
				nombre: 'Juan',
				correo: 'juan@mail.com',
				password: 'password123',
				direccion_envio: 'Calle 123'
			}
			;(mockUserRepository.findByCorreo as jest.Mock).mockResolvedValueOnce(null)
			;(mockUserRepository.hasUsers as jest.Mock).mockResolvedValueOnce(true)
			;(bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword123')
			const createdUser = {
				id: 1,
				nombre: 'Juan',
				correo: 'juan@mail.com',
				password: 'hashedPassword123',
				direccion_envio: 'Calle 123',
				role: 'user'
			}
			;(mockUserRepository.createUser as jest.Mock).mockResolvedValueOnce(createdUser)

			const result = await userService.register(userData)

			expect(result).toEqual({
				id: 1,
				nombre: 'Juan',
				correo: 'juan@mail.com',
				role: 'user',
				direccion_envio: 'Calle 123'
			})
			expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
			expect(mockUserRepository.createUser).toHaveBeenCalled()
			})

			it('asigna rol admin al primer usuario', async () => {
			const userData = {
				nombre: 'Juan',
				correo: 'juan@mail.com',
				password: 'password123'
			}
			;(mockUserRepository.findByCorreo as jest.Mock).mockResolvedValueOnce(null)
			;(mockUserRepository.hasUsers as jest.Mock).mockResolvedValueOnce(false)
			;(bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword123')
			const createdUser = {
				id: 1,
				nombre: 'Juan',
				correo: 'juan@mail.com',
				password: 'hashedPassword123',
				direccion_envio: '',
				role: 'admin'
			}
			;(mockUserRepository.createUser as jest.Mock).mockResolvedValueOnce(createdUser)

			const result = await userService.register(userData)

			expect(result.role).toBe('admin')
			expect(mockUserRepository.createUser).toHaveBeenCalledWith(
				expect.objectContaining({ role: 'admin' })
			)
			})
		})

		describe('login', () => {
			it('retorna token y usuario cuando credenciales son válidas', async () => {
				const loginData = {
					correo: 'juan@mail.com',
					password: 'password123'
				}
				const user = {
					id: 1,
					nombre: 'Juan',
					correo: 'juan@mail.com',
					password: 'hashedPassword123',
					role: 'user',
					direccion_envio: 'Calle 123'
				}
				;(mockUserRepository.findByCorreo as jest.Mock).mockResolvedValueOnce(user)
				;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true)
				;(jwt.sign as jest.Mock).mockReturnValueOnce('jwt-token-123')

				const result = await userService.login(loginData)

				expect(result.token).toBe('jwt-token-123')
				expect(result.user).toEqual({
					id: 1,
					nombre: 'Juan',
					correo: 'juan@mail.com',
					role: 'user',
					direccion_envio: 'Calle 123'
				})
				expect(jwt.sign).toHaveBeenCalledWith(
					expect.objectContaining({ id: 1, role: 'user' }),
					'test-secret',
					{ expiresIn: '12h' }
				)
			})
		})
	})

	describe('Negative Testing - Errores de validación y autenticación', () => {
		describe('register', () => {
			it('lanza error 400 si faltan campos obligatorios', async () => {
				const userData = {
					nombre: 'Juan',
					correo: 'juan@mail.com'
					// falta password
				}

				try {
					await userService.register(userData as any)
					fail('Debería lanzar error')
				} catch (error: any) {
					expect(error.statusCode).toBe(400)
					expect(error.message).toContain('nombre, correo y password son obligatorios')
				}
			})

			it('lanza error 409 si el correo ya existe', async () => {
				const userData = {
					nombre: 'Juan',
					correo: 'juan@mail.com',
					password: 'password123'
				}
				const existingUser = {
					id: 1,
					nombre: 'Juan',
					correo: 'juan@mail.com',
					password: 'hashedPassword'
				}
				;(mockUserRepository.findByCorreo as jest.Mock).mockResolvedValueOnce(existingUser)

				try {
					await userService.register(userData)
					fail('Debería lanzar error')
				} catch (error: any) {
					expect(error.statusCode).toBe(409)
					expect(error.message).toContain('El correo ya esta registrado')
				}
			})
		})

		describe('login', () => {
			it('lanza error 400 si faltan campos obligatorios', async () => {
				const loginData = {
					correo: 'juan@mail.com'
					// falta password
				}

				try {
					await userService.login(loginData as any)
					fail('Debería lanzar error')
				} catch (error: any) {
					expect(error.statusCode).toBe(400)
					expect(error.message).toContain('correo y password son obligatorios')
				}
			})

			it('lanza error 401 si usuario no existe', async () => {
				const loginData = {
					correo: 'noexiste@mail.com',
					password: 'password123'
				}
				;(mockUserRepository.findByCorreo as jest.Mock).mockResolvedValueOnce(null)

				try {
					await userService.login(loginData)
					fail('Debería lanzar error')
				} catch (error: any) {
					expect(error.statusCode).toBe(401)
					expect(error.message).toContain('Credenciales invalidas')
				}
			})

			it('lanza error 401 si contraseña es incorrecta', async () => {
				const loginData = {
					correo: 'juan@mail.com',
					password: 'wrongPassword'
				}
				const user = {
					id: 1,
					nombre: 'Juan',
					correo: 'juan@mail.com',
					password: 'hashedPassword123',
					role: 'user',
					direccion_envio: 'Calle 123'
				}
				;(mockUserRepository.findByCorreo as jest.Mock).mockResolvedValueOnce(user)
				;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(false)

				try {
					await userService.login(loginData)
					fail('Debería lanzar error')
				} catch (error: any) {
					expect(error.statusCode).toBe(401)
					expect(error.message).toContain('Credenciales invalidas')
				}
			})
		})
	})

	describe('Boundary Testing - Casos límite de autenticación', () => {
		describe('register', () => {
			it('proporciona direccion_envio vacía si no se proporciona', async () => {
				const userData = {
					nombre: 'Juan',
					correo: 'juan@mail.com',
					password: 'password123'
					// sin direccion_envio
				}
				;(mockUserRepository.findByCorreo as jest.Mock).mockResolvedValueOnce(null)
				;(mockUserRepository.hasUsers as jest.Mock).mockResolvedValueOnce(true)
				;(bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword123')
				const createdUser = {
					id: 1,
					nombre: 'Juan',
					correo: 'juan@mail.com',
					password: 'hashedPassword123',
					direccion_envio: '',
					role: 'user'
				}
				;(mockUserRepository.createUser as jest.Mock).mockResolvedValueOnce(createdUser)

				await userService.register(userData)

				expect(mockUserRepository.createUser).toHaveBeenCalledWith(
					expect.objectContaining({ direccion_envio: '' })
				)
			})
		})

		describe('login', () => {
			it('lanza error 500 si JWT_SECRET no está configurada', async () => {
				delete process.env.JWT_SECRET
				const loginData = {
					correo: 'juan@mail.com',
					password: 'password123'
				}
				const user = {
					id: 1,
					nombre: 'Juan',
					correo: 'juan@mail.com',
					password: 'hashedPassword123',
					role: 'user',
					direccion_envio: 'Calle 123'
				}
				;(mockUserRepository.findByCorreo as jest.Mock).mockResolvedValueOnce(user)
				;(bcrypt.compare as jest.Mock).mockResolvedValueOnce(true)

				try {
					await userService.login(loginData as any)
					fail('Debería lanzar error')
				} catch (error: any) {
					expect(error.statusCode).toBe(500)
					expect(error.message).toContain('JWT_SECRET no configurada')
				}
			})
		})
	})
})
