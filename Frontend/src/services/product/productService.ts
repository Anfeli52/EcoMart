import api from "../../api/axios"; 
import type { Producto } from "../../types/types";

export const getProducts = async (): Promise<Producto[]> => {
    const response = await api.get("/products");
    return response.data;
}