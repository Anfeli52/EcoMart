import { createContext, useState, type ReactNode } from "react";
import { loginUser } from "../services/auth/authService";
import type { LoginData, LoginResponse } from "../types/types";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    user: string | null;
    token: string | null;
    login: (data: LoginData) => Promise<LoginResponse>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

const getUserFromToken = (token: string): string | null => {
    if(!token) return null;

    try {
        const decoded: any = jwtDecode(token);
        return decoded.name || null;
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser] = useState<string | null>(getUserFromToken(localStorage.getItem("token") || ""));

    const login = async (data: LoginData) => {
        const response = await loginUser(data);
        // Decodificar el token de forma segura. Si falla, no interrumpimos el flujo de login
        localStorage.setItem("token", response.token);
        setToken(response.token);
        try {
            const decodedToken: any = jwtDecode(response.token);
            setUser(decodedToken?.name || null);
        } catch (error) {
            setUser(null);
        }

        return response;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};