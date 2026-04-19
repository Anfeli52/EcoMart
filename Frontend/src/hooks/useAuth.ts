import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
 
//todavía no se usa, pero se puede usar para acceder al contexto de autenticación en cualquier componente
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
};