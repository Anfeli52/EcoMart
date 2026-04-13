import { createContext, useState } from "react";
import { loginUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (data) => {
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