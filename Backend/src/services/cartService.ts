interface CartRepository {
    findCartByUserId(userId: number): Promise<any>;
    addItemToCart(userId: number, productId: number, quantity: number): Promise<any>;
    removeItemFromCart(userId: number, productId: number): Promise<any>;
    changeCartItemQuantity(userId: number, productId: number, quantity: number): Promise<any>;
}

class CartService {
    private cartRepository: CartRepository;

    constructor(cartRepository: CartRepository) {
        this.cartRepository = cartRepository;
    }

    async getCart(userId: number): Promise<any> {
        if(!userId) {
            throw new Error('userId es requerido');
        }
        return this.cartRepository.findCartByUserId(userId);
    }

    async addToCart(userId: number, productId: number, quantity: number): Promise<any> {
        if (quantity <= 0) {
            throw new Error('La cantidad debe ser mayor a cero');
        }
        return this.cartRepository.addItemToCart(userId, productId, quantity);
    }

    async itemQuantity(userId: number, productId: number, quantity: number): Promise<any> {
        if (quantity <= 0) {
            throw new Error('La cantidad debe ser mayor a cero');
        }
        return this.cartRepository.changeCartItemQuantity(userId, productId, quantity);
    }

    async removeFromCart(userId: number, productId: number): Promise<any> {
        if(!userId || !productId) {
            throw new Error('userId y productId son requeridos');
        }
        return this.cartRepository.removeItemFromCart(userId, productId);
    }

}

export default CartService;