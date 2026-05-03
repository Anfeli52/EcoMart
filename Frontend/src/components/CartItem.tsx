import type { CartItemTypes } from "../types/types";
import "../styles/cart/CartItem.css";
import { useEffect, useState } from "react";
import { changeCartItemQuantity, removeFromCart } from "../services/cart/cartService";

interface CartItemProps {
    item: CartItemTypes;
    onDelete: (productId: number) => void;
    onQuantityChange: (productId: number, quantity: number) => void;
}

export const CartItem = ({ item, onDelete, onQuantityChange }: CartItemProps) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const itemStock = item.producto.stock;
    const [quantity, setQuantity] = useState(item.cantidad);

    useEffect(() => {
        if (itemStock <= 0) {
            setIsDisabled(true);
        }
    }, [itemStock]);

    const handleDeleteCartItem = async () => {
        setIsDeleting(true);
        try {
            await removeFromCart(item.id_producto);
            onDelete(item.id_producto); 
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error al eliminar el item del carrito:", error.message);
            } else {
                console.error("Error desconocido al eliminar el item del carrito");
            }
        } finally {
            setIsDeleting(false);
        }
    }

    const handleIncreaseQuantity = async () => {
        if(quantity < itemStock) {
            const nextQuantity = quantity + 1;
            try {
                await changeCartItemQuantity(item.id_producto, nextQuantity);
                setQuantity(nextQuantity);
                onQuantityChange(item.id_producto, nextQuantity);
            } catch (error: unknown) {            
                if (error instanceof Error) {
                    console.error("Error al aumentar la cantidad del item:", error.message);
                } else {
                    console.error("Error desconocido al aumentar la cantidad del item");
                }
            }
        }
    }

    const handleDecreaseQuantity = async () => {
        if(quantity > 1) {
            const nextQuantity = quantity - 1;
            try {
                await changeCartItemQuantity(item.id_producto, nextQuantity);
                setQuantity(nextQuantity);
                onQuantityChange(item.id_producto, nextQuantity);
            } catch (error: unknown) {            
                if (error instanceof Error) {
                    console.error("Error al disminuir la cantidad del item:", error.message);
                } else {
                    console.error("Error desconocido al disminuir la cantidad del item");
                }
            }
        }
    }

    return (
        <article className={`cart-item-card ${itemStock <= 0 ? "cart-item-card--out-of-stock" : ""}`}>
            {itemStock <= 0 ? (
                <>
                    <div className="cart-item-card__media">
                        <img className="cart-item-card__image cart-item-card__image--muted" src={item.producto.imagenUrl} alt={item.producto.nombre} />
                        <span className="cart-item-card__badge">Sin stock</span>
                    </div>
                    <div className="cart-item-card__content">
                        <div className="cart-item-card__header">
                            <h3>{item.producto.nombre}</h3>
                            <p className="cart-item-card__price">${item.producto.precio}</p>
                        </div>
                        <p className="cart-item-card__stock-message">Este producto no tiene stock disponible.</p>
                    </div>
                </>
            ) : (
                <>
                    <div className="cart-item-card__media">
                        <img className="cart-item-card__image" src={item.producto.imagenUrl} alt={item.producto.nombre} />
                    </div>
                    <div className="cart-item-card__content">
                        <div className="cart-item-card__header">
                            <h3>{item.producto.nombre}</h3>
                            <p className="cart-item-card__price">${item.producto.precio}</p>
                        </div>

                        <div className="cart-item-card__controls">
                            <div className="input-stepper-container">
                                <button disabled={isDisabled || quantity <= 1} onClick={handleDecreaseQuantity}>
                                    -
                                </button>
                                <input type="number" value={quantity} readOnly />
                                <button disabled={isDisabled || quantity >= itemStock} onClick={handleIncreaseQuantity}>
                                    +
                                </button>
                            </div>

                            <button className="cart-item-card__remove-button" onClick={handleDeleteCartItem} disabled={isDeleting}>
                                {isDeleting ? "Eliminando..." : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </article>
    )
}