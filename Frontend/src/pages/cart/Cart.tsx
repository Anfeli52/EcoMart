import { useEffect, useState } from "react";
import { CartItem } from "../../components/CartItem";
import type { CartItemTypes } from "../../types/types";
import { Navbar } from "../../components/Navbar";
import "../../styles/cart/Cart.css";
import { getCart } from "../../services/cart/cartService";

export const Cart = () => {
    const [cartItems, setCartItems] = useState<CartItemTypes[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const getCartItems = async () => {
            try {
                const response = await getCart();
                setCartItems(response);
            }
            catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("Error al obtener el carrito:", error.message);
                } else {
                    console.error("Error desconocido al obtener el carrito");
                }
            }
        }
        getCartItems();
    }, []);

    useEffect(() => {
        let itemsTotal = 0;
        let priceTotal = 0;

        for (const item of cartItems) {
            itemsTotal += item.cantidad;
            priceTotal += item.cantidad * Number(item.producto.precio);
        }

        setTotalItems(itemsTotal);
        setTotalPrice(priceTotal);
    }, [cartItems]);
    
    const handleDeleteCartItem = (productId: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id_producto !== productId));
    }

    const handleQuantityChange = (productId: number, quantity: number) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id_producto === productId
                    ? { ...item, cantidad: quantity }
                    : item
            )
        );
    }

    return (
        <div className="cart-page">
            <Navbar />
            <div className="cart-page__content">
                <div className="cart-page__hero">
                    <p className="cart-page__eyebrow">Carrito de compras</p>
                    <h1>Revisá tus productos antes de pagar</h1>
                    <p>
                        Encontrá un resumen claro de tus productos, cantidades y total estimado.
                    </p>
                </div>

                {cartItems.length > 0 ? (
                    <div className="cart-layout">
                        <section className="cart-items-panel" aria-label="Productos en el carrito">
                            <div className="cart-items-panel__header">
                                <h2>Items del carrito</h2>
                                <span>{cartItems.length} productos</span>
                            </div>
                            <div className="cart-items-list">
                                {cartItems.map(item => (
                                    <CartItem key={item.id_producto} item={item} onDelete={handleDeleteCartItem} onQuantityChange={handleQuantityChange}
                                    />
                                ))}
                            </div>
                        </section>

                        <aside className="cart-summary" aria-label="Resumen de compra">
                            <p className="cart-summary__label">Resumen</p>
                            <h3>Total estimado</h3>
                            <div className="cart-summary__row">
                                <span>Productos</span>
                                <strong>{totalItems}</strong>
                            </div>
                            <div className="cart-summary__row">
                                <span>Importe</span>
                                <strong>${totalPrice.toFixed(2)}</strong>
                            </div>
                            <p className="cart-summary__note">
                                El valor puede cambiar según stock, promociones o envío al finalizar la compra.
                            </p>
                            <button className="cart-summary__checkout-button" type="button">
                                Continuar compra
                            </button>
                        </aside>
                    </div>
                ) : (
                    <div className="cart-empty-state">
                        <p className="cart-empty-state__label">Tu carrito está vacío</p>
                        <h2>No hay items en el carrito.</h2>
                        <p>
                            Agregá productos para verlos acá con su precio, cantidad y resumen de compra.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}