import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import PrismaProductoRepository from '../../repositories/prisma/prismaProductoRepository.ts'
import ProductoService from '../../services/producto/productoService.ts'
import ProductoController from '../../controllers/producto/productoController.ts'

type ProductContainerClass<T = any> = new (...args: any[]) => T

interface ProductoContainerDependencies {
	databaseUrl?: string
	prismaClientClass?: ProductContainerClass
	prismaMariaDbClass?: ProductContainerClass
	productoRepositoryClass?: ProductContainerClass
	productoServiceClass?: ProductContainerClass
	productoControllerClass?: ProductContainerClass
}

function createProductoContainer(dependencies: ProductoContainerDependencies = {}) {
	const databaseUrl = dependencies.databaseUrl ?? process.env.DATABASE_URL
	if (!databaseUrl) {
		throw new Error('DATABASE_URL no esta definida en variables de entorno')
	}

	const PrismaClientClass = dependencies.prismaClientClass ?? PrismaClient
	const PrismaMariaDbClass = dependencies.prismaMariaDbClass ?? PrismaMariaDb
	const ProductoRepositoryClass = dependencies.productoRepositoryClass ?? PrismaProductoRepository
	const ProductoServiceClass = dependencies.productoServiceClass ?? ProductoService
	const ProductoControllerClass = dependencies.productoControllerClass ?? ProductoController

	const adapter = new PrismaMariaDbClass(databaseUrl)
	const prisma = new PrismaClientClass({ adapter })
	const productoRepository = new ProductoRepositoryClass(prisma)
	const productoService = new ProductoServiceClass(productoRepository)
	const productoController = new ProductoControllerClass(productoService)

	return { productoController }
}

export { createProductoContainer }