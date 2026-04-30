import type { Request, Response } from 'express'

interface ProductoService {
	getProductos(): Promise<any[]>
	getProductosPorCategoria(categoria: string): Promise<any[]>
	getProductosPorCategorias(categorias: string): Promise<any[]>
	getProductosPorNombre(nombre: string): Promise<any[]>
	getCategoriasDisponibles(): string[]
	postProducto(productoData: any): Promise<any>
}

class ProductoController {
	private productoService: ProductoService

	constructor(productoService: ProductoService) {
		this.productoService = productoService
	}

	async getProductos(req: Request, res: Response): Promise<Response> {
		try {
			const categoriasQuery = req.query.categorias as string | undefined
			const categoriaQuery = req.query.categoria as string | undefined
			const nombreQuery = req.query.nombre as string | undefined

			if (nombreQuery) {
				const productos = await this.productoService.getProductosPorNombre(nombreQuery)
				return res.status(200).json({
					message: 'Productos filtrados por nombre',
					total: productos.length,
					nombre: nombreQuery,
					productos
				})
			}

			if (categoriasQuery) {
				const productos = await this.productoService.getProductosPorCategorias(categoriasQuery)
				return res.status(200).json({
					message: 'Productos filtrados por categorias',
					total: productos.length,
					categorias: categoriasQuery,
					productos
				})
			}

			if (categoriaQuery) {
				const productos = await this.productoService.getProductosPorCategoria(categoriaQuery)
				return res.status(200).json({
					message: 'Productos filtrados por categoria',
					total: productos.length,
					categoria: categoriaQuery,
					productos
				})
			}

			const productos = await this.productoService.getProductos()
			return res.status(200).json({
				message: 'Listado de productos',
				total: productos.length,
				productos
			})
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({
				message: error.message || 'Error interno del servidor'
			})
		}
	}

	getCategoriasDisponibles(req: Request, res: Response): Response {
		const categorias = this.productoService.getCategoriasDisponibles()
		return res.status(200).json({ categorias })
	}

  async postProducto(req: Request, res: Response): Promise<Response> {
		try {
			const producto = await this.productoService.postProducto(req.body)
			return res.status(201).json({
				message: 'Producto creado correctamente',
				producto
			})
		} catch (error: any) {
			return res.status(error.statusCode || 500).json({
				message: error.message || 'Error interno del servidor'
			})
		}
	}

}

export default ProductoController
