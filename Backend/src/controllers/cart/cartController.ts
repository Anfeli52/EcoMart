import type { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/authMiddleware';

interface CartService {
    getCart(userId: number): Promise<any>;
    addToCart(userId: number, productId: number, quantity: number): Promise<any>;
    removeFromCart(userId: number, productId: number): Promise<any>;
    itemQuantity(userId: number, productId: number, quantity: number): Promise<any>;
}

class CartController {
    private cartService: CartService;

    constructor(cartService: CartService) {
        this.cartService = cartService;
    }

    async getCart(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number((req as AuthRequest).idUsuario);
            if (!userId) {
                return res.status(401).json({
                    message: 'Usuario no autenticado'
                });
            }
            const cart = await this.cartService.getCart(userId);
            return res.status(200).json({
                message: 'Carrito obtenido exitosamente',
                total: cart.items?.length || 0,
                cart
            });
        } catch (error: any) {
            return res.status(500).json({
                message: 'Error al obtener el carrito',
                error: error.message
            });
        }
    }

    async addToCart(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number((req as AuthRequest).idUsuario);
            if (!userId) {
                return res.status(401).json({
                    message: 'Usuario no autenticado'
                });
            }
            const { productId, quantity } = req.body;
            const updatedCart = await this.cartService.addToCart(userId, productId, quantity);
            return res.status(200).json({
                message: 'Producto agregado al carrito exitosamente',
                cart: updatedCart
            });
        } catch (error: any) {
            return res.status(500).json({
                message: 'Error al agregar producto al carrito',
                error: error.message
            });
        }
    }
    
    async removeFromCart(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number((req as AuthRequest).idUsuario);
            if (!userId) {
                return res.status(401).json({
                    message: 'Usuario no autenticado'
                });
            }
            const productId = parseInt(req.params.productId as string);
            const updatedCart = await this.cartService.removeFromCart(userId, productId);
            return res.status(200).json({
                message: 'Producto removido del carrito exitosamente',
                cart: updatedCart
            });
        } catch (error: any) {
            return res.status(500).json({
                message: 'Error al remover producto del carrito',
                error: error.message
            });
        }
    }

    async itemQuantity(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number((req as AuthRequest).idUsuario);
            if (!userId) {
                return res.status(401).json({
                    message: 'Usuario no autenticado'
                });
            }
            const { productId, quantity } = req.body;
            const updatedCart = await this.cartService.itemQuantity(userId, productId, quantity);
            return res.status(200).json({
                message: 'Cantidad del producto actualizada exitosamente',
                cart: updatedCart
            });
        } catch (error: any) {
            return res.status(500).json({
                message: 'Error al actualizar la cantidad del producto en el carrito',
                error: error.message
            });
        }
    }

}

export default CartController;