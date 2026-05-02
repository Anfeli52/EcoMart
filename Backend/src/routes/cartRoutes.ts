import express from 'express'
import { cartController } from '../container/cartContainer.ts'
import authMiddleware from '../middleware/authMiddleware.ts';

const router = express.Router();

// GET /cart -> obtener el carrito del usuario
router.get('/', authMiddleware, (req, res) => cartController.getCart(req, res));

// POST /cart -> agregar un producto al carrito
router.post('/', authMiddleware, (req, res) => cartController.addToCart(req, res));

// DELETE /cart/remove/:productId -> remover un producto del carrito
router.delete('/remove/:productId', authMiddleware, (req, res) => cartController.removeFromCart(req, res));

// PUT /cart/quantity -> cambiar la cantidad de un producto en el carrito
router.put('/quantity', authMiddleware, (req, res) => cartController.itemQuantity(req, res));

export default router;