import ProductoService from './productoService'
import { type CategoriaProducto } from '@prisma/client'

interface ProductoRepository {
	findAll(): Promise<any[]>
	findByCategoria(categoria: CategoriaProducto): Promise<any[]>
	findByCategorias(categorias: CategoriaProducto[]): Promise<any[]>
	findByNombre(nombre: string): Promise<any[]>
	createProducto(productoData: any): Promise<any>
}

describe('ProductoService', () => {
	let mockProductoRepository: ProductoRepository
	let productoService: ProductoService

	beforeEach(() => {
		mockProductoRepository = {
			findAll: jest.fn(),
			findByCategoria: jest.fn(),
			findByCategorias: jest.fn(),
			findByNombre: jest.fn(),
			createProducto: jest.fn()
		}
		productoService = new ProductoService(mockProductoRepository)
	})

	describe('getProductos', () => {
		it('retorna lista vacía cuando no hay productos', async () => {
			(mockProductoRepository.findAll as jest.Mock).mockResolvedValueOnce([])

			const result = await productoService.getProductos()

			expect(result).toEqual([])
			expect(mockProductoRepository.findAll).toHaveBeenCalledTimes(1)
		})

		it('retorna lista de productos', async () => {
			const productos = [
				{ id: 1, nombre: 'Laptop', precio: 1000, categoria: 'ELECTRONICA' },
				{ id: 2, nombre: 'Mouse', precio: 25, categoria: 'ELECTRONICA' }
			]
			;(mockProductoRepository.findAll as jest.Mock).mockResolvedValueOnce(productos)

			const result = await productoService.getProductos()

			expect(result).toEqual(productos)
			expect(mockProductoRepository.findAll).toHaveBeenCalledTimes(1)
		})
	})

	describe('getProductosPorCategoria', () => {
		it('retorna productos de una categoría específica', async () => {
			const productos = [
				{ id: 1, nombre: 'Laptop', precio: 1000, categoria: 'ELECTRONICA' },
				{ id: 2, nombre: 'Monitor', precio: 300, categoria: 'ELECTRONICA' }
			]
			;(mockProductoRepository.findByCategoria as jest.Mock).mockResolvedValueOnce(productos)

			const result = await productoService.getProductosPorCategoria('ELECTRONICA')

			expect(result).toEqual(productos)
			expect(mockProductoRepository.findByCategoria).toHaveBeenCalledWith('ELECTRONICA')
		})

		it('normaliza la categoría a mayúsculas', async () => {
			const productos = [{ id: 1, nombre: 'Camiseta', precio: 50, categoria: 'ROPA' }]
			;(mockProductoRepository.findByCategoria as jest.Mock).mockResolvedValueOnce(productos)

			const result = await productoService.getProductosPorCategoria('ropa')

			expect(result).toEqual(productos)
			expect(mockProductoRepository.findByCategoria).toHaveBeenCalledWith('ROPA')
		})

		it('lanza error si categoría es inválida', async () => {
			await expect(productoService.getProductosPorCategoria('INVALIDA')).rejects.toThrow(
				'Categoria invalida'
			)
		})
	})

	describe('getProductosPorCategorias', () => {
		it('retorna productos de múltiples categorías', async () => {
			const productos = [
				{ id: 1, nombre: 'Laptop', precio: 1000, categoria: 'ELECTRONICA' },
				{ id: 3, nombre: 'Camiseta', precio: 50, categoria: 'ROPA' }
			]
			;(mockProductoRepository.findByCategorias as jest.Mock).mockResolvedValueOnce(productos)

			const result = await productoService.getProductosPorCategorias('ELECTRONICA,ROPA')

			expect(result).toEqual(productos)
			expect(mockProductoRepository.findByCategorias).toHaveBeenCalledWith(['ELECTRONICA', 'ROPA'])
		})

		it('elimina categorías duplicadas', async () => {
			const productos = [
				{ id: 1, nombre: 'Laptop', precio: 1000, categoria: 'ELECTRONICA' }
			]
			;(mockProductoRepository.findByCategorias as jest.Mock).mockResolvedValueOnce(productos)

			const result = await productoService.getProductosPorCategorias('ELECTRONICA,ELECTRONICA')

			expect(result).toEqual(productos)
			expect(mockProductoRepository.findByCategorias).toHaveBeenCalledWith(['ELECTRONICA'])
		})

		it('lanza error 400 si no se envían categorías', async () => {
			try {
				await productoService.getProductosPorCategorias('')
				fail('Debería lanzar error')
			} catch (error: any) {
				expect(error.message).toContain('Debes enviar al menos una categoria')
				expect(error.statusCode).toBe(400)
			}
		})
	})

	describe('getProductosPorNombre', () => {
		it('retorna productos por nombre', async () => {
			const productos = [{ id: 1, nombre: 'Laptop', precio: 1000, categoria: 'ELECTRONICA' }]
			;(mockProductoRepository.findByNombre as jest.Mock).mockResolvedValueOnce(productos)

			const result = await productoService.getProductosPorNombre('Laptop')

			expect(result).toEqual(productos)
			expect(mockProductoRepository.findByNombre).toHaveBeenCalledWith('Laptop')
		})

		it('trimea el nombre antes de buscar', async () => {
			const productos = [{ id: 1, nombre: 'Laptop', precio: 1000, categoria: 'ELECTRONICA' }]
			;(mockProductoRepository.findByNombre as jest.Mock).mockResolvedValueOnce(productos)

			const result = await productoService.getProductosPorNombre('  Laptop  ')

			expect(result).toEqual(productos)
			expect(mockProductoRepository.findByNombre).toHaveBeenCalledWith('Laptop')
		})

		it('lanza error 400 si nombre está vacío', async () => {
			try {
				await productoService.getProductosPorNombre('')
				fail('Debería lanzar error')
			} catch (error: any) {
				expect(error.message).toContain('Debes enviar un nombre para buscar productos')
				expect(error.statusCode).toBe(400)
			}
		})
	})

	describe('postProducto', () => {
		it('crea un nuevo producto con datos válidos', async () => {
			const productoData = {
				nombre: 'Monitor',
				descripcion: '27 pulgadas',
				precio: 300,
				stock: 5,
				categoria: 'ELECTRONICA' as CategoriaProducto,
				imagenUrl: 'monitor.jpg'
			}
			const createdProducto = { id: 1, ...productoData }
			;(mockProductoRepository.createProducto as jest.Mock).mockResolvedValueOnce(createdProducto)

			const result = await productoService.postProducto(productoData)

			expect(result).toEqual(createdProducto)
			expect(mockProductoRepository.createProducto).toHaveBeenCalledWith({
				nombre: 'Monitor',
				descripcion: '27 pulgadas',
				precio: 300,
				stock: 5,
				categoria: 'ELECTRONICA',
				imagenUrl: 'monitor.jpg'
			})
		})

		it('lanza error 400 si faltan campos obligatorios', async () => {
			const productoData = {
				nombre: 'Monitor',
				descripcion: '27 pulgadas',
				precio: 300,
				stock: 5,
				categoria: 'ELECTRONICA' as CategoriaProducto
				// falta imagenUrl
			}

			try {
				await productoService.postProducto(productoData as any)
				fail('Debería lanzar error')
			} catch (error: any) {
				expect(error.statusCode).toBe(400)
				expect(error.message).toContain('obligatorios')
			}
		})

		it('lanza error 400 si precio es <= 0', async () => {
			const productoData = {
				nombre: 'Monitor',
				descripcion: '27 pulgadas',
				precio: 0,
				stock: 5,
				categoria: 'ELECTRONICA' as CategoriaProducto,
				imagenUrl: 'monitor.jpg'
			}

			try {
				await productoService.postProducto(productoData)
				fail('Debería lanzar error')
			} catch (error: any) {
				expect(error.statusCode).toBe(400)
				expect(error.message).toContain('precio debe ser mayor que 0')
			}
		})

		it('lanza error 400 si stock es negativo', async () => {
			const productoData = {
				nombre: 'Monitor',
				descripcion: '27 pulgadas',
				precio: 300,
				stock: -1,
				categoria: 'ELECTRONICA' as CategoriaProducto,
				imagenUrl: 'monitor.jpg'
			}

			try {
				await productoService.postProducto(productoData)
				fail('Debería lanzar error')
			} catch (error: any) {
				expect(error.statusCode).toBe(400)
				expect(error.message).toContain('stock debe ser un entero mayor o igual a 0')
			}
		})

		it('lanza error 400 si stock no es entero', async () => {
			const productoData = {
				nombre: 'Monitor',
				descripcion: '27 pulgadas',
				precio: 300,
				stock: 5.5,
				categoria: 'ELECTRONICA' as CategoriaProducto,
				imagenUrl: 'monitor.jpg'
			}

			try {
				await productoService.postProducto(productoData)
				fail('Debería lanzar error')
			} catch (error: any) {
				expect(error.statusCode).toBe(400)
				expect(error.message).toContain('stock debe ser un entero')
			}
		})

		it('trimea strings y normaliza categoría', async () => {
			const productoData = {
				nombre: '  Monitor  ',
				descripcion: '  27 pulgadas  ',
				precio: 300,
				stock: 5,
				categoria: '  electronica  ' as CategoriaProducto,
				imagenUrl: '  monitor.jpg  '
			}
			const createdProducto = { id: 1, ...productoData }
			;(mockProductoRepository.createProducto as jest.Mock).mockResolvedValueOnce(createdProducto)

			await productoService.postProducto(productoData)

			expect(mockProductoRepository.createProducto).toHaveBeenCalledWith({
				nombre: 'Monitor',
				descripcion: '27 pulgadas',
				precio: 300,
				stock: 5,
				categoria: 'ELECTRONICA',
				imagenUrl: 'monitor.jpg'
			})
		})
	})

	describe('getCategoriasDisponibles', () => {
		it('retorna lista de categorías disponibles', () => {
			const categorias = productoService.getCategoriasDisponibles()

			expect(categorias).toContain('ELECTRONICA')
			expect(categorias).toContain('ROPA')
			expect(categorias).toContain('HOGAR')
			expect(categorias).toContain('DEPORTES')
			expect(categorias).toContain('OTROS')
			expect(categorias).toHaveLength(5)
		})
	})
})
