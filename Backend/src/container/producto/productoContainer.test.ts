import { describe, expect, it } from '@jest/globals'
import { createProductoContainer } from './productoContainerFactory.ts'

class PrismaMariaDbMock {
	databaseUrl: string

	constructor(databaseUrl: string) {
		this.databaseUrl = databaseUrl
	}
}

class PrismaClientMock {
	config: { adapter: PrismaMariaDbMock }

	constructor(config: { adapter: PrismaMariaDbMock }) {
		this.config = config
	}
}

class ProductoRepositoryMock {
	prisma: PrismaClientMock

	constructor(prisma: PrismaClientMock) {
		this.prisma = prisma
	}
}

class ProductoServiceMock {
	productoRepository: ProductoRepositoryMock

	constructor(productoRepository: ProductoRepositoryMock) {
		this.productoRepository = productoRepository
	}
}

class ProductoControllerMock {
	productoService: ProductoServiceMock

	constructor(productoService: ProductoServiceMock) {
		this.productoService = productoService
	}
}

describe('productoContainerFactory', () => {
	describe('Happy Path - Construcción de dependencias', () => {
		it('construye las dependencias usando el databaseUrl recibido', () => {
		const databaseUrl = 'mariadb://localhost:3306/ecomart'

		const { productoController } = createProductoContainer({
			databaseUrl,
			prismaClientClass: PrismaClientMock,
			prismaMariaDbClass: PrismaMariaDbMock,
			productoRepositoryClass: ProductoRepositoryMock,
			productoServiceClass: ProductoServiceMock,
			productoControllerClass: ProductoControllerMock
		})

		expect(productoController).toBeInstanceOf(ProductoControllerMock)
		expect(productoController.productoService).toBeInstanceOf(ProductoServiceMock)
		expect(productoController.productoService.productoRepository).toBeInstanceOf(ProductoRepositoryMock)
		expect(productoController.productoService.productoRepository.prisma).toBeInstanceOf(PrismaClientMock)
		expect(productoController.productoService.productoRepository.prisma.config.adapter).toBeInstanceOf(PrismaMariaDbMock)
		expect(productoController.productoService.productoRepository.prisma.config.adapter.databaseUrl).toBe(databaseUrl)
		})
	})

	describe('Negative Testing - Configuración faltante', () => {
		it('lanza error si no recibe databaseUrl y no existe DATABASE_URL', async () => {
			const originalDatabaseUrl = process.env.DATABASE_URL
			delete process.env.DATABASE_URL

			try {
				expect(() => createProductoContainer()).toThrow(
					'DATABASE_URL no esta definida en variables de entorno'
				)
			} finally {
				if (originalDatabaseUrl === undefined) {
					delete process.env.DATABASE_URL
				} else {
					process.env.DATABASE_URL = originalDatabaseUrl
				}
			}
		})
	})
})