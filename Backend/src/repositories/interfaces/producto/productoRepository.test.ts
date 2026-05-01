import { PrismaClient, type CategoriaProducto } from '@prisma/client'
import PrismaProductoRepository from '../../prisma/prismaProductoRepository'

jest.mock('@prisma/client')

describe('PrismaProductoRepository', () => {
	let mockPrismaClient: Partial<PrismaClient>
	let prismaProductoRepository: PrismaProductoRepository

	beforeEach(() => {
		mockPrismaClient = {
			producto: {
				findMany: jest.fn(),
				create: jest.fn()
			} as any
		}
		prismaProductoRepository = new PrismaProductoRepository(mockPrismaClient as PrismaClient)
	})

	describe('Happy Path - Operaciones válidas', () => {
		describe('findAll', () => {
			it('retorna lista de productos ordenada por ID', async () => {
				const productos = [
					{ id: 1, nombre: 'Laptop', precio: 1000, categoria: 'ELECTRONICA' as CategoriaProducto },
					{ id: 2, nombre: 'Mouse', precio: 25, categoria: 'ELECTRONICA' as CategoriaProducto }
				]
				;(mockPrismaClient.producto!.findMany as jest.Mock).mockResolvedValueOnce(productos)

				const result = await prismaProductoRepository.findAll()

				expect(result).toEqual(productos)
				expect(mockPrismaClient.producto!.findMany).toHaveBeenCalledWith({
					orderBy: { id: 'asc' }
				})
			})
		})

		describe('findByCategoria', () => {
			it('retorna productos de una categoría específica', async () => {
				const productos = [
					{ id: 1, nombre: 'Laptop', precio: 1000, categoria: 'ELECTRONICA' as CategoriaProducto },
					{ id: 2, nombre: 'Monitor', precio: 300, categoria: 'ELECTRONICA' as CategoriaProducto }
				]
				;(mockPrismaClient.producto!.findMany as jest.Mock).mockResolvedValueOnce(productos)

				const result = await prismaProductoRepository.findByCategoria('ELECTRONICA' as CategoriaProducto)

				expect(result).toEqual(productos)
				expect(mockPrismaClient.producto!.findMany).toHaveBeenCalledWith({
					where: { categoria: 'ELECTRONICA' },
					orderBy: { id: 'asc' }
				})
			})
		})

		describe('findByCategorias', () => {
			it('retorna productos de múltiples categorías', async () => {
				const productos = [
					{ id: 1, nombre: 'Laptop', precio: 1000, categoria: 'ELECTRONICA' as CategoriaProducto },
					{ id: 3, nombre: 'Camiseta', precio: 50, categoria: 'ROPA' as CategoriaProducto }
				]
				;(mockPrismaClient.producto!.findMany as jest.Mock).mockResolvedValueOnce(productos)

				const result = await prismaProductoRepository.findByCategorias([
					'ELECTRONICA' as CategoriaProducto,
					'ROPA' as CategoriaProducto
				])

				expect(result).toEqual(productos)
				expect(mockPrismaClient.producto!.findMany).toHaveBeenCalledWith({
					where: {
						categoria: {
							in: ['ELECTRONICA', 'ROPA']
						}
					},
					orderBy: { id: 'asc' }
				})
			})
		})

		describe('findByNombre', () => {
			it('busca productos por nombre contiene', async () => {
				const productos = [
					{ id: 1, nombre: 'Laptop Dell', precio: 1000, categoria: 'ELECTRONICA' as CategoriaProducto }
				]
				;(mockPrismaClient.producto!.findMany as jest.Mock).mockResolvedValueOnce(productos)

				const result = await prismaProductoRepository.findByNombre('Laptop')

				expect(result).toEqual(productos)
				expect(mockPrismaClient.producto!.findMany).toHaveBeenCalledWith({
					where: {
						nombre: {
							contains: 'Laptop'
						}
					},
					orderBy: { id: 'asc' }
				})
			})
		})

		describe('createProducto', () => {
			it('crea un nuevo producto', async () => {
				const productoData = {
					nombre: 'Monitor',
					descripcion: '27 pulgadas',
					precio: 300,
					stock: 5,
					categoria: 'ELECTRONICA' as CategoriaProducto,
					imagenUrl: 'monitor.jpg'
				}
				const createdProducto = { id: 1, ...productoData }
				;(mockPrismaClient.producto!.create as jest.Mock).mockResolvedValueOnce(createdProducto)

				const result = await prismaProductoRepository.createProducto(productoData)

				expect(result).toEqual(createdProducto)
				expect(mockPrismaClient.producto!.create).toHaveBeenCalledWith({
					data: productoData
				})
			})
		})
	})

	describe('Negative Testing - Resultados vacíos', () => {
		describe('findAll', () => {
			it('retorna lista vacía cuando no hay productos', async () => {
				;(mockPrismaClient.producto!.findMany as jest.Mock).mockResolvedValueOnce([])

				const result = await prismaProductoRepository.findAll()

				expect(result).toEqual([])
				expect(mockPrismaClient.producto!.findMany).toHaveBeenCalledWith({
					orderBy: { id: 'asc' }
				})
			})
		})

		describe('findByCategoria', () => {
			it('retorna lista vacía si no hay productos en esa categoría', async () => {
				;(mockPrismaClient.producto!.findMany as jest.Mock).mockResolvedValueOnce([])

				const result = await prismaProductoRepository.findByCategoria('ROPA' as CategoriaProducto)

				expect(result).toEqual([])
			})
		})

		describe('findByCategorias', () => {
			it('retorna lista vacía si no hay productos en esas categorías', async () => {
				;(mockPrismaClient.producto!.findMany as jest.Mock).mockResolvedValueOnce([])

				const result = await prismaProductoRepository.findByCategorias([
					'DEPORTES' as CategoriaProducto
				])

				expect(result).toEqual([])
			})
		})

		describe('findByNombre', () => {
			it('retorna lista vacía si no hay coincidencias', async () => {
				;(mockPrismaClient.producto!.findMany as jest.Mock).mockResolvedValueOnce([])

				const result = await prismaProductoRepository.findByNombre('NoExiste')

				expect(result).toEqual([])
			})
		})

		describe('createProducto', () => {
			it('preserva los datos exactos del producto creado', async () => {
				const productoData = {
					nombre: 'Mouse Gaming',
					descripcion: 'RGB 16000 DPI',
					precio: 80.5,
					stock: 20,
					categoria: 'ELECTRONICA' as CategoriaProducto,
					imagenUrl: 'mouse.jpg'
				}
				const createdProducto = { id: 5, ...productoData }
				;(mockPrismaClient.producto!.create as jest.Mock).mockResolvedValueOnce(createdProducto)

				const result = await prismaProductoRepository.createProducto(productoData)

				expect(result.id).toBe(5)
				expect(result.nombre).toBe('Mouse Gaming')
				expect(result.precio).toBe(80.5)
				expect(result.stock).toBe(20)
			})
		})
	})

	describe('Boundary Testing - Búsquedas y colecciones', () => {
		describe('findAll', () => {
			it('retorna lista vacía cuando no hay productos', async () => {
				;(mockPrismaClient.producto!.findMany as jest.Mock).mockResolvedValueOnce([])

				const result = await prismaProductoRepository.findAll()

				expect(result).toEqual([])
				expect(mockPrismaClient.producto!.findMany).toHaveBeenCalledWith({
					orderBy: { id: 'asc' }
				})
			})
		})

		describe('findByCategoria', () => {
			it('retorna productos de una categoría específica', async () => {
				const productos = [
					{ id: 1, nombre: 'Laptop', precio: 1000, categoria: 'ELECTRONICA' as CategoriaProducto },
					{ id: 2, nombre: 'Monitor', precio: 300, categoria: 'ELECTRONICA' as CategoriaProducto }
				]
				;(mockPrismaClient.producto!.findMany as jest.Mock).mockResolvedValueOnce(productos)

				const result = await prismaProductoRepository.findByCategoria('ELECTRONICA' as CategoriaProducto)

				expect(result).toEqual(productos)
				expect(mockPrismaClient.producto!.findMany).toHaveBeenCalledWith({
					where: { categoria: 'ELECTRONICA' },
					orderBy: { id: 'asc' }
				})
			})
		})

		describe('findByCategorias', () => {
			it('retorna productos de múltiples categorías', async () => {
				const productos = [
					{ id: 1, nombre: 'Laptop', precio: 1000, categoria: 'ELECTRONICA' as CategoriaProducto },
					{ id: 3, nombre: 'Camiseta', precio: 50, categoria: 'ROPA' as CategoriaProducto }
				]
				;(mockPrismaClient.producto!.findMany as jest.Mock).mockResolvedValueOnce(productos)

				const result = await prismaProductoRepository.findByCategorias([
					'ELECTRONICA' as CategoriaProducto,
					'ROPA' as CategoriaProducto
				])

				expect(result).toEqual(productos)
				expect(mockPrismaClient.producto!.findMany).toHaveBeenCalledWith({
					where: {
						categoria: {
							in: ['ELECTRONICA', 'ROPA']
						}
					},
					orderBy: { id: 'asc' }
				})
			})
		})

		describe('findByNombre', () => {
			it('busca productos por nombre contiene', async () => {
				const productos = [
					{ id: 1, nombre: 'Laptop Dell', precio: 1000, categoria: 'ELECTRONICA' as CategoriaProducto }
				]
				;(mockPrismaClient.producto!.findMany as jest.Mock).mockResolvedValueOnce(productos)

				const result = await prismaProductoRepository.findByNombre('Laptop')

				expect(result).toEqual(productos)
				expect(mockPrismaClient.producto!.findMany).toHaveBeenCalledWith({
					where: {
						nombre: {
							contains: 'Laptop'
						}
					},
					orderBy: { id: 'asc' }
				})
			})

			it('trimea el nombre antes de buscar', async () => {
				const productos = [
					{ id: 1, nombre: 'Laptop Dell', precio: 1000, categoria: 'ELECTRONICA' as CategoriaProducto }
				]
				;(mockPrismaClient.producto!.findMany as jest.Mock).mockResolvedValueOnce(productos)

				await prismaProductoRepository.findByNombre('  Laptop  ')

				expect(mockPrismaClient.producto!.findMany).toHaveBeenCalledWith({
					where: {
						nombre: {
							contains: 'Laptop'
						}
					},
					orderBy: { id: 'asc' }
				})
			})
		})

		describe('createProducto', () => {
			it('crea un nuevo producto', async () => {
				const productoData = {
					nombre: 'Monitor',
					descripcion: '27 pulgadas',
					precio: 300,
					stock: 5,
					categoria: 'ELECTRONICA' as CategoriaProducto,
					imagenUrl: 'monitor.jpg'
				}
				const createdProducto = { id: 1, ...productoData }
				;(mockPrismaClient.producto!.create as jest.Mock).mockResolvedValueOnce(createdProducto)

				const result = await prismaProductoRepository.createProducto(productoData)

				expect(result).toEqual(createdProducto)
				expect(mockPrismaClient.producto!.create).toHaveBeenCalledWith({
					data: productoData
				})
			})
		})
	})
})
