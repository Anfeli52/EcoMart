import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import UserController from './userController.ts'

type MockResponse = {
	status: ReturnType<typeof jest.fn>
	json: ReturnType<typeof jest.fn>
}

type MockUserService = {
	register: ReturnType<typeof jest.fn>
	login: ReturnType<typeof jest.fn>
}

function createMockResponse(): MockResponse {
	const response = {} as MockResponse
	response.status = jest.fn().mockReturnValue(response)
	response.json = jest.fn().mockReturnValue(response)
	return response
}

describe('UserController', () => {
	let userService: MockUserService
	let controller: UserController

	beforeEach(() => {
		userService = {
			register: jest.fn(),
			login: jest.fn()
		}
		controller = new UserController(userService)
	})

	describe('Happy Path - Operaciones válidas', () => {
		it('register responde 201 con usuario creado', async () => {
			const payload = {
				nombre: 'Ana',
				correo: 'ana@mail.com',
				password: '123456'
			}
			const createdUser = {
				id: 1,
				nombre: 'Ana',
				correo: 'ana@mail.com',
				role: 'admin',
				direccion_envio: ''
			}
			const req = { body: payload } as any
			const res = createMockResponse()
			userService.register.mockResolvedValue(createdUser)

			await controller.register(req, res as any)

			expect(userService.register).toHaveBeenCalledWith(payload)
			expect(res.status).toHaveBeenCalledWith(201)
			expect(res.json).toHaveBeenCalledWith({
				message: 'Usuario creado correctamente',
				user: createdUser
			})
		})

		it('login responde 200 con token y user', async () => {
			const payload = { correo: 'ana@mail.com', password: '123456' }
			const loginResult = {
				token: 'jwt-token',
				user: {
					id: 1,
					nombre: 'Ana',
					correo: 'ana@mail.com',
					role: 'admin',
					direccion_envio: ''
				}
			}
			const req = { body: payload } as any
			const res = createMockResponse()
			userService.login.mockResolvedValue(loginResult)

			await controller.login(req, res as any)

			expect(userService.login).toHaveBeenCalledWith(payload)
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith({
				message: 'Login correcto',
				...loginResult
			})
		})
	})

	describe('Negative Testing - Errores en el servicio', () => {
		it('register maneja error con statusCode del service', async () => {
			const req = { body: {} } as any
			const res = createMockResponse()
			const error = new Error('correo obligatorio') as Error & { statusCode?: number }
			error.statusCode = 400
			userService.register.mockRejectedValue(error)

			await controller.register(req, res as any)

			expect(res.status).toHaveBeenCalledWith(400)
			expect(res.json).toHaveBeenCalledWith({ message: 'correo obligatorio' })
		})

		it('login maneja error 500 por defecto', async () => {
			const req = { body: { correo: 'ana@mail.com', password: 'wrong' } } as any
			const res = createMockResponse()
			userService.login.mockRejectedValue(new Error('Credenciales invalidas'))

			await controller.login(req, res as any)

			expect(res.status).toHaveBeenCalledWith(500)
			expect(res.json).toHaveBeenCalledWith({ message: 'Credenciales invalidas' })
		})
	})
})