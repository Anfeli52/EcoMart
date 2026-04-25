import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import PrismaProductoRepository from '../repositories/prisma/prismaProductoRepository.ts'
import ProductoService from '../services/productoService.ts'
import ProductoController from '../controllers/productoController.ts'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
	throw new Error('DATABASE_URL no esta definida en variables de entorno')
}

const adapter = new PrismaMariaDb(databaseUrl)
const prisma = new PrismaClient({ adapter })

const productoRepository = new PrismaProductoRepository(prisma)
const productoService = new ProductoService(productoRepository)
const productoController = new ProductoController(productoService)

export { productoController }
