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

export type { RegisterData, LoginData, LoginResponse, User };