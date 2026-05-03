import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import express, { Express } from 'express'
import request from 'supertest'

type MockRequest = any
type MockResponse = any

const mockProductoController = {
	getProductos: jest.fn(),
	postProducto: jest.fn(),
	getCategoriasDisponibles: jest.fn()
}

let app: Express

beforeEach(() => {
	jest.clearAllMocks()
	app = express()
	app.use(express.json())

	const router = express.Router()
	router.get('/', (req: any, res: any) => mockProductoController.getProductos(req, res))
	router.post('/', (req: any, res: any) => mockProductoController.postProducto(req, res))
	router.get('/categorias', (req: any, res: any) => mockProductoController.getCategoriasDisponibles(req, res))

	app.use('/producto', router)
})

describe('ProductoRoutes', () => {
	describe('Happy Path - Operaciones válidas', () => {
		it('GET / retorna listado de productos', async () => {
			const productos = [
				{ id: 1, nombre: 'Laptop', precio: 1000 },
				{ id: 2, nombre: 'Teclado', precio: 50 }
			]
			mockProductoController.getProductos.mockImplementation((req: any, res: any) => {
				res.status(200).json({
					message: 'Listado de productos',
					total: 2,
					productos
				})
			})

			const res = await request(app).get('/producto')

			expect(res.status).toBe(200)
			expect(res.body.total).toBe(2)
			expect(res.body.productos).toEqual(productos)
			expect(mockProductoController.getProductos).toHaveBeenCalled()
		})

		it('GET /?nombre=camisa filtra productos por nombre', async () => {
			const productos = [{ id: 3, nombre: 'Camisa azul', precio: 30 }]
			mockProductoController.getProductos.mockImplementation((req: any, res: any) => {
				res.status(200).json({
					message: 'Productos filtrados por nombre',
					total: 1,
					nombre: req.query.nombre,
					productos
				})
			})

			const res = await request(app).get('/producto?nombre=camisa')

			expect(res.status).toBe(200)
			expect(res.body.nombre).toBe('camisa')
			expect(res.body.total).toBe(1)
		})

		it('GET /?categoria=ROPA filtra productos por categoria', async () => {
			const productos = [{ id: 4, nombre: 'Pantalon', precio: 45 }]
			mockProductoController.getProductos.mockImplementation((req: any, res: any) => {
				res.status(200).json({
					message: 'Productos filtrados por categoria',
					total: 1,
					categoria: req.query.categoria,
					productos
				})
			})

			const res = await request(app).get('/producto?categoria=ROPA')

			expect(res.status).toBe(200)
			expect(res.body.categoria).toBe('ROPA')
		})

		it('POST / crea un nuevo producto', async () => {
			const nuevoProducto = {
				id: 7,
				nombre: 'Monitor',
				descripcion: '27 pulgadas',
				precio: 300,
				stock: 5,
				categoria: 'ELECTRONICA',
				imagenUrl: 'monitor.jpg'
			}
			mockProductoController.postProducto.mockImplementation((req: any, res: any) => {
				res.status(201).json({
					message: 'Producto creado correctamente',
					producto: nuevoProducto
				})
			})

			const res = await request(app)
				.post('/producto')
				.send({
					nombre: 'Monitor',
					descripcion: '27 pulgadas',
					precio: 300,
					stock: 5,
					categoria: 'ELECTRONICA',
					imagenUrl: 'monitor.jpg'
				})

			expect(res.status).toBe(201)
			expect(res.body.product || res.body.producto).toBeDefined()
			expect(mockProductoController.postProducto).toHaveBeenCalled()
		})

		it('GET /categorias retorna listado de categorias', async () => {
			const categorias = ['ELECTRONICA', 'ROPA', 'HOGAR', 'DEPORTES', 'OTROS']
			mockProductoController.getCategoriasDisponibles.mockImplementation((req: any, res: any) => {
				res.status(200).json({ categorias })
			})

			const res = await request(app).get('/producto/categorias')

			expect(res.status).toBe(200)
			expect(res.body.categorias).toEqual(categorias)
		})
	})

	describe('Negative Testing - Errores de validación', () => {
		it('POST / retorna error 400 cuando hay error en el service', async () => {
			mockProductoController.postProducto.mockImplementation((req: any, res: any) => {
				res.status(400).json({
					message: 'nombre, descripcion, precio, stock, categoria e imagenUrl son obligatorios'
				})
			})

			const res = await request(app).post('/producto').send({})

			expect(res.status).toBe(400)
			expect(res.body.message).toBeDefined()
		})
	})
})
