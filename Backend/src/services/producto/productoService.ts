import { type CategoriaProducto } from '@prisma/client'

interface ProductoRepository {
	findAll(): Promise<any[]>
	findByCategoria(categoria: CategoriaProducto): Promise<any[]>
	findByCategorias(categorias: CategoriaProducto[]): Promise<any[]>
	findByNombre(nombre: string): Promise<any[]>
	createProducto(productoData: CreateProductoData): Promise<any>
}

interface CreateProductoData {
	nombre: string
	descripcion: string
	precio: number
	stock: number
	categoria: CategoriaProducto
	imagenUrl: string
}

interface CustomError extends Error {
	statusCode?: number
}

const categoriasValidas: CategoriaProducto[] = [
	'ELECTRONICA',
	'ROPA',
	'HOGAR',
	'DEPORTES',
	'OTROS'
]

class ProductoService {
	private productoRepository: ProductoRepository

	constructor(productoRepository: ProductoRepository) {
		this.productoRepository = productoRepository
	}

	async getProductos(): Promise<any[]> {
		return this.productoRepository.findAll()
	}

	async getProductosPorCategoria(categoriaRaw: string): Promise<any[]> {
		const categoria = this.parseCategoria(categoriaRaw)
		return this.productoRepository.findByCategoria(categoria)
	}

	async getProductosPorCategorias(categoriasRaw: string): Promise<any[]> {
		if (!categoriasRaw) {
			const error: CustomError = new Error('Debes enviar al menos una categoria')
			error.statusCode = 400
			throw error
		}

		const categorias = categoriasRaw
			.split(',')
			.map((categoria) => this.parseCategoria(categoria))

		const categoriasUnicas = Array.from(new Set(categorias))
		return this.productoRepository.findByCategorias(categoriasUnicas)
	}

	async getProductosPorNombre(nombreRaw: string): Promise<any[]> {
		const nombre = nombreRaw?.trim()

		if (!nombre) {
			const error: CustomError = new Error('Debes enviar un nombre para buscar productos')
			error.statusCode = 400
			throw error
		}

		return this.productoRepository.findByNombre(nombre)
	}

	async postProducto(productoData: CreateProductoData): Promise<any> {
		const { nombre, descripcion, precio, stock, categoria, imagenUrl } = productoData

		if (!nombre || !descripcion || precio === undefined || stock === undefined || !categoria || !imagenUrl) {
			const error: CustomError = new Error('nombre, descripcion, precio, stock, categoria e imagenUrl son obligatorios')
			error.statusCode = 400
			throw error
		}

		if (Number(precio) <= 0) {
			const error: CustomError = new Error('precio debe ser mayor que 0')
			error.statusCode = 400
			throw error
		}

		if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
			const error: CustomError = new Error('stock debe ser un entero mayor o igual a 0')
			error.statusCode = 400
			throw error
		}

		const categoriaValida = this.parseCategoria(categoria)

		return this.productoRepository.createProducto({
			nombre: nombre.trim(),
			descripcion: descripcion.trim(),
			precio: Number(precio),
			stock: Number(stock),
			categoria: categoriaValida,
			imagenUrl: imagenUrl.trim()
		})
	}

	getCategoriasDisponibles(): CategoriaProducto[] {
		return categoriasValidas
	}

	private parseCategoria(categoriaRaw: string): CategoriaProducto {
		const categoriaNormalizada = categoriaRaw?.trim().toUpperCase()
		const categoria = categoriasValidas.find((cat) => cat === categoriaNormalizada)

		if (!categoria) {
			const error: CustomError = new Error(
				`Categoria invalida: ${categoriaRaw}. Valores permitidos: ${categoriasValidas.join(', ')}`
			)
			error.statusCode = 400
			throw error
		}

		return categoria
	}
}

export default ProductoService
