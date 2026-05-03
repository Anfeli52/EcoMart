import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import ProductoController from './productoController.ts'

type MockResponse = {
	status: ReturnType<typeof jest.fn>
	json: ReturnType<typeof jest.fn>
}

type MockProductoService = {
	getProductos: ReturnType<typeof jest.fn>
	getProductosPorCategoria: ReturnType<typeof jest.fn>
	getProductosPorCategorias: ReturnType<typeof jest.fn>
	getProductosPorNombre: ReturnType<typeof jest.fn>
	getCategoriasDisponibles: ReturnType<typeof jest.fn>
	postProducto: ReturnType<typeof jest.fn>
}

function createMockResponse(): MockResponse {
	const response = {} as MockResponse
	response.status = jest.fn().mockReturnValue(response)
	response.json = jest.fn().mockReturnValue(response)
	return response
}

describe('ProductoController', () => {
	let productoService: MockProductoService
	let controller: ProductoController

	beforeEach(() => {
		productoService = {
			getProductos: jest.fn(),
			getProductosPorCategoria: jest.fn(),
			getProductosPorCategorias: jest.fn(),
			getProductosPorNombre: jest.fn(),
			getCategoriasDisponibles: jest.fn(),
			postProducto: jest.fn()
		}

		controller = new ProductoController(productoService)
	})

	it('getProductos filtra por nombre cuando viene query nombre', async () => {
		const req = { query: { nombre: 'camisa' } } as any
		const res = createMockResponse()
		const productos = [{ id: 1, nombre: 'Camisa verde' }]
		productoService.getProductosPorNombre.mockResolvedValue(productos)

		await controller.getProductos(req, res as any)

		expect(productoService.getProductosPorNombre).toHaveBeenCalledWith('camisa')
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Productos filtrados por nombre',
			total: 1,
			nombre: 'camisa',
			productos
		})
	})

	it('getProductos filtra por categorias cuando viene query categorias', async () => {
		const req = { query: { categorias: 'ROPA,HOGAR' } } as any
		const res = createMockResponse()
		const productos = [{ id: 2, nombre: 'Mesa' }]
		productoService.getProductosPorCategorias.mockResolvedValue(productos)

		await controller.getProductos(req, res as any)

		expect(productoService.getProductosPorCategorias).toHaveBeenCalledWith('ROPA,HOGAR')
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Productos filtrados por categorias',
			total: 1,
			categorias: 'ROPA,HOGAR',
			productos
		})
	})

	it('getProductos filtra por categoria cuando viene query categoria', async () => {
		const req = { query: { categoria: 'ROPA' } } as any
		const res = createMockResponse()
		const productos = [{ id: 3, nombre: 'Pantalon' }]
		productoService.getProductosPorCategoria.mockResolvedValue(productos)

		await controller.getProductos(req, res as any)

		expect(productoService.getProductosPorCategoria).toHaveBeenCalledWith('ROPA')
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Productos filtrados por categoria',
			total: 1,
			categoria: 'ROPA',
			productos
		})
	})

	it('getProductos retorna listado completo cuando no hay filtros', async () => {
		const req = { query: {} } as any
		const res = createMockResponse()
		const productos = [{ id: 4, nombre: 'Laptop' }, { id: 5, nombre: 'Zapato' }]
		productoService.getProductos.mockResolvedValue(productos)

		await controller.getProductos(req, res as any)

		expect(productoService.getProductos).toHaveBeenCalledTimes(1)
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Listado de productos',
			total: 2,
			productos
		})
	})

	it('getProductos retorna status del error del service', async () => {
		const req = { query: { nombre: 'x' } } as any
		const res = createMockResponse()
		const error = new Error('Debes enviar un nombre') as Error & { statusCode?: number }
		error.statusCode = 400
		productoService.getProductosPorNombre.mockRejectedValue(error)

		await controller.getProductos(req, res as any)

		expect(res.status).toHaveBeenCalledWith(400)
		expect(res.json).toHaveBeenCalledWith({ message: 'Debes enviar un nombre' })
	})

	it('getCategoriasDisponibles responde 200 con categorias', () => {
		const req = {} as any
		const res = createMockResponse()
		const categorias = ['ROPA', 'HOGAR']
		productoService.getCategoriasDisponibles.mockReturnValue(categorias)

		controller.getCategoriasDisponibles(req, res as any)

		expect(productoService.getCategoriasDisponibles).toHaveBeenCalledTimes(1)
		expect(res.status).toHaveBeenCalledWith(200)
		expect(res.json).toHaveBeenCalledWith({ categorias })
	})

	it('postProducto responde 201 cuando crea producto', async () => {
		const productoPayload = {
			nombre: 'Teclado',
			descripcion: 'Mecanico',
			precio: 100,
			stock: 10,
			categoria: 'ELECTRONICA',
			imagenUrl: 'img.jpg'
		}
		const productoCreado = { id: 10, ...productoPayload }
		const req = { body: productoPayload } as any
		const res = createMockResponse()
		productoService.postProducto.mockResolvedValue(productoCreado)

		await controller.postProducto(req, res as any)

		expect(productoService.postProducto).toHaveBeenCalledWith(productoPayload)
		expect(res.status).toHaveBeenCalledWith(201)
		expect(res.json).toHaveBeenCalledWith({
			message: 'Producto creado correctamente',
			producto: productoCreado
		})
	})

	it('postProducto maneja error 500 por defecto', async () => {
		const req = { body: {} } as any
		const res = createMockResponse()
		productoService.postProducto.mockRejectedValue(new Error('Fallo inesperado'))

		await controller.postProducto(req, res as any)

		expect(res.status).toHaveBeenCalledWith(500)
		expect(res.json).toHaveBeenCalledWith({ message: 'Fallo inesperado' })
	})
})
