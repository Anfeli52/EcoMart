abstract class CartRepository {
    abstract findCartByUserId(userId: number): Promise<any>;
    abstract addItemToCart(userId: number, productId: number, quantity: number): Promise<any>;
    abstract removeItemFromCart(userId: number, productId: number): Promise<any>;
    abstract changeCartItemQuantity(userId: number, productId: number, quantity: number): Promise<any>;
}

export default CartRepository;