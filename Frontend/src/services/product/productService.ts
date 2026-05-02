import api from "../../api/axios"; 
import type { Producto } from "../../types/types";

export const getProducts = async (): Promise<Producto[]> => {
    try {
        const response = await api.get("/producto/");
        return response.data.productos;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(error.message || "Error al obtener los productos");
        }
        throw new Error("Error al obtener los productos");
    }
}