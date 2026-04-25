import { type CategoriaProducto } from '@prisma/client'

interface ProductoRepository {
	findAll(): Promise<any[]>
	findByCategoria(categoria: CategoriaProducto): Promise<any[]>
	findByCategorias(categorias: CategoriaProducto[]): Promise<any[]>
	findByNombre(nombre: string): Promise<any[]>
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
