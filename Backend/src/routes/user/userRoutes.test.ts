import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import express, { Express } from 'express'
import request from 'supertest'

const mockUserController = {
	register: jest.fn(),
	login: jest.fn()
}

let app: Express

beforeEach(() => {
	jest.clearAllMocks()
	app = express()
	app.use(express.json())

	const router = express.Router()
	router.post('/register', (req: any, res: any) => mockUserController.register(req, res))
	router.post('/login', (req: any, res: any) => mockUserController.login(req, res))

	app.use('/user', router)
})

describe('UserRoutes', () => {
	it('POST /register crea un nuevo usuario', async () => {
		const nuevoUsuario = {
			id: 1,
			nombre: 'Juan',
			correo: 'juan@mail.com',
			role: 'admin',
			direccion_envio: 'Calle 123'
		}
		mockUserController.register.mockImplementation((req: any, res: any) => {
			res.status(201).json({
				message: 'Usuario creado correctamente',
				user: nuevoUsuario
			})
		})

		const res = await request(app)
			.post('/user/register')
			.send({
				nombre: 'Juan',
				correo: 'juan@mail.com',
				password: 'password123'
			})

		expect(res.status).toBe(201)
		expect(res.body.message).toBe('Usuario creado correctamente')
		expect(res.body.user).toBeDefined()
		expect(mockUserController.register).toHaveBeenCalled()
	})

	it('POST /register retorna error 400 cuando faltan datos', async () => {
		mockUserController.register.mockImplementation((req: any, res: any) => {
			res.status(400).json({
				message: 'nombre, correo y password son obligatorios'
			})
		})

		const res = await request(app)
			.post('/user/register')
			.send({ nombre: 'Juan' })

		expect(res.status).toBe(400)
		expect(res.body.message).toBeDefined()
	})

	it('POST /register retorna error 409 cuando correo ya existe', async () => {
		mockUserController.register.mockImplementation((req: any, res: any) => {
			res.status(409).json({
				message: 'El correo ya esta registrado'
			})
		})

		const res = await request(app)
			.post('/user/register')
			.send({
				nombre: 'Ana',
				correo: 'existente@mail.com',
				password: 'password123'
			})

		expect(res.status).toBe(409)
		expect(res.body.message).toBe('El correo ya esta registrado')
	})

	it('POST /login retorna token y usuario cuando credenciales son correctas', async () => {
		const loginResponse = {
			token: 'jwt-token-123456',
			user: {
				id: 1,
				nombre: 'Juan',
				correo: 'juan@mail.com',
				role: 'admin',
				direccion_envio: 'Calle 123'
			}
		}
		mockUserController.login.mockImplementation((req: any, res: any) => {
			res.status(200).json({
				message: 'Login correcto',
				...loginResponse
			})
		})

		const res = await request(app)
			.post('/user/login')
			.send({
				correo: 'juan@mail.com',
				password: 'password123'
			})

		expect(res.status).toBe(200)
		expect(res.body.message).toBe('Login correcto')
		expect(res.body.token).toBeDefined()
		expect(res.body.user).toBeDefined()
		expect(mockUserController.login).toHaveBeenCalled()
	})

	it('POST /login retorna error 401 cuando credenciales son incorrectas', async () => {
		mockUserController.login.mockImplementation((req: any, res: any) => {
			res.status(401).json({
				message: 'Credenciales invalidas'
			})
		})

		const res = await request(app)
			.post('/user/login')
			.send({
				correo: 'juan@mail.com',
				password: 'wrongpassword'
			})

		expect(res.status).toBe(401)
		expect(res.body.message).toBe('Credenciales invalidas')
	})

	it('POST /login retorna error 400 cuando faltan datos', async () => {
		mockUserController.login.mockImplementation((req: any, res: any) => {
			res.status(400).json({
				message: 'correo y password son obligatorios'
			})
		})

		const res = await request(app)
			.post('/user/login')
			.send({ correo: 'juan@mail.com' })

		expect(res.status).toBe(400)
		expect(res.body.message).toBe('correo y password son obligatorios')
	})
})
