import api from "../../api/axios"

export const addToCart = async (productId: number, quantity: number) => {
    try {
        const response = await api.post("/cart", {
            productId,
            quantity
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Error al agregar al carrito");
        }
        throw new Error("Error al agregar al carrito");
    }
}

export const getCart = async () => {
    try {
        const response = await api.get("/cart");
        return response.data.cart.items;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Error al obtener el carrito");
        }
        throw new Error("Error al obtener el carrito");
    }
}

export const removeFromCart = async (productId: number) => {
    try {
        const response = await api.delete(`/cart/remove/${productId}`);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Error al remover del carrito");
        }
        throw new Error("Error al remover del carrito");
    }
}

export const changeCartItemQuantity = async (productId: number, quantity: number) => {
    try {
        const response = await api.put("/cart/quantity", {
            productId,
            quantity
        });
        return response.data;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Error al cambiar la cantidad del item en el carrito");
        }
        throw new Error("Error al cambiar la cantidad del item en el carrito");
    }
}