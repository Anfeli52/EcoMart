import { createContext, useState, type ReactNode } from "react";
import { loginUser } from "../services/auth/authService";
import type { User, LoginData, LoginResponse } from "../types/types";

interface AuthContextType {
    user: User | null;
    login: (data: LoginData) => Promise<LoginResponse>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (data: LoginData) => {
        const response = await loginUser(data);
        
        localStorage.setItem("token", response.token);
        setUser(response.user);

        return response;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};