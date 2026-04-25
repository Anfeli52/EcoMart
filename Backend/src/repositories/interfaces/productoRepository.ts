import type { CategoriaProducto } from '@prisma/client'

abstract class ProductoRepository {
	abstract findAll(): Promise<any[]>
	abstract findByCategoria(categoria: CategoriaProducto): Promise<any[]>
	abstract findByCategorias(categorias: CategoriaProducto[]): Promise<any[]>
	abstract findByNombre(nombre: string): Promise<any[]>
}

export default ProductoRepository
