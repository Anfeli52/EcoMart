import { createContext, useState, type ReactNode } from "react";
import { loginUser } from "../services/auth/authService";
import type { User, LoginData, LoginResponse } from "../types/types";

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (data: LoginData) => Promise<LoginResponse>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    const login = async (data: LoginData) => {
        const response = await loginUser(data);
        
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        setToken(response.token);
        setUser(response.user);

        return response;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};