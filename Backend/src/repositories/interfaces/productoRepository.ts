import type { CategoriaProducto } from '@prisma/client'

interface CreateProductoData {
	nombre: string
	descripcion: string
	precio: number
	stock: number
	categoria: CategoriaProducto
	imagenUrl: string
}

abstract class ProductoRepository {
	abstract findAll(): Promise<any[]>
	abstract findByCategoria(categoria: CategoriaProducto): Promise<any[]>
	abstract findByCategorias(categorias: CategoriaProducto[]): Promise<any[]>
	abstract findByNombre(nombre: string): Promise<any[]>
	abstract createProducto(productoData: CreateProductoData): Promise<any>
}

export default ProductoRepository
