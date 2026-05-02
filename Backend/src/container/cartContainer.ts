import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import PrismaCartRepository from "../repositories/prisma/prismaCartRepository.ts";
import CartService from "../services/cartService.ts";
import CartController from "../controllers/cartController.ts";

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
    throw new Error('DATABASE_URL no esta definida en variables de entorno')
}

const adapter = new PrismaMariaDb(databaseUrl);
const primsa = new PrismaClient({ adapter });

const cartRepository = new PrismaCartRepository(primsa);
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);

export { cartController }