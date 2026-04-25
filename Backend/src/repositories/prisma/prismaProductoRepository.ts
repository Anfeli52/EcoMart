import { PrismaClient, type CategoriaProducto } from '@prisma/client'
import ProductoRepository from '../interfaces/productoRepository.ts'

class PrismaProductoRepository extends ProductoRepository {
	private prisma: PrismaClient

	constructor(prismaClient: PrismaClient) {
		super()
		this.prisma = prismaClient
	}

	async findAll(): Promise<any[]> {
		return this.prisma.producto.findMany({
			orderBy: { id: 'asc' }
		})
	}

	async findByCategoria(categoria: CategoriaProducto): Promise<any[]> {
		return this.prisma.producto.findMany({
			where: { categoria },
			orderBy: { id: 'asc' }
		})
	}

	async findByCategorias(categorias: CategoriaProducto[]): Promise<any[]> {
		return this.prisma.producto.findMany({
			where: {
				categoria: {
					in: categorias
				}
			},
			orderBy: { id: 'asc' }
		})
	}

	async findByNombre(nombre: string): Promise<any[]> {
		return this.prisma.producto.findMany({
			where: {
				nombre: {
					contains: nombre.trim()
				}
			},
			orderBy: { id: 'asc' }
		})
	}
}

export default PrismaProductoRepository
