import { PrismaClient } from "@prisma/client";
import CartRepository from "../interfaces/cart/cartRepository";

class PrismaCartRepository extends CartRepository {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        super();
        this.prisma = prismaClient;
    }

    async findCartByUserId(userId: number): Promise<any> {
        return this.prisma.carrito.findUnique({
            where: { id_usuario: userId },
            include: {
                items: {
                    include: {
                        producto: true
                    }
                }
            }
        });
    }

    async addItemToCart(userId: number, productId: number, quantity: number): Promise<any> {
        const cart = await this.prisma.carrito.findUnique({
            where: { id_usuario: userId }
        });

        if (!cart) {
            await this.prisma.carrito.create({
                data: {
                    id_usuario: userId,
                    items: {
                        create: {
                            id_producto: productId,
                            cantidad: quantity
                        }
                    }
                }
            });
            return;
        }

        const existingItem = await this.prisma.item_Carrito.findFirst({
            where: {
                id_carrito: cart.id,
                id_producto: productId
            }
        });

        if (existingItem) {
            await this.prisma.item_Carrito.update({
                where: { id: existingItem.id },
                data: { cantidad: existingItem.cantidad + quantity }
            });
        } else {
            await this.prisma.item_Carrito.create({
                data: {
                    id_carrito: cart.id,
                    id_producto: productId,
                    cantidad: quantity
                }
            });
        }
    }

    async removeItemFromCart(userId: number, productId: number): Promise<any> {
        const cart = await this.prisma.carrito.findUnique({
            where: { id_usuario: userId }
        });

        if (cart) {
            await this.prisma.item_Carrito.deleteMany({
                where: {
                    id_carrito: cart.id,
                    id_producto: productId
                }
            });
        }
    }

    async changeCartItemQuantity(userId: number, productId: number, quantity: number): Promise<any> {
        const cart = await this.prisma.carrito.findUnique({
            where: { id_usuario: userId }
        });

        if (cart) {
            const existingItem = await this.prisma.item_Carrito.findFirst({
                where: {
                    id_carrito: cart.id,
                    id_producto: productId
                }
            });

            if (existingItem) {
                await this.prisma.item_Carrito.update({
                    where: { id: existingItem.id },
                    data: { cantidad: quantity }
                });
            }
        }
    }
}

export default PrismaCartRepository;
