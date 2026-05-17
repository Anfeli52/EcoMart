import type { CartItem } from "../components/CartItem";

interface RegisterData {
    nombre: string;
    correo: string;
    password: string;
    direccion_envio?: string;
}

interface User{
    id: number | string;
    nombre: string;
    correo: string;
    role: string;
    direccion_envio: string;
}

interface LoginData {
    correo: string;
    password: string;
}

interface LoginResponse {
    message?: string;
    token: string;
    user: User;
}

interface Producto {
    id: number,
    nombre: string,
    precio: number,
    imagenUrl: string
    stock: number;
}interface ProductoDetalle extends Producto {
    descripcion: string;
    categoria: string;
}

interface CartItemTypes {
    id_producto: number;
    producto: Producto;
    cantidad: number;
}

export type { RegisterData, LoginData, LoginResponse, User, Producto, CartItemTypes, ProductoDetalle };