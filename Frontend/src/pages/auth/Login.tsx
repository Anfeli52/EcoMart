import { useState, useContext, type ChangeEvent, type FormEvent } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import type { LoginData } from "../../types/types";

const Login = () => {
    const auth  = useContext(AuthContext);
    
    if(!auth){
        throw new Error("AuthContext no disponible");
    }

    const { login } = auth;
    const [form, setForm] = useState<LoginData>({
        correo: "",
        password: ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await login(form);
            alert(response.message || "Inicio de sesión exitoso");
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("Error en el inicio de sesión");
            }
        }
    }

    return (
        <div className="auth-container">            
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                <input type="email" name="correo" placeholder="Correo" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
                <button type="submit">Iniciar Sesión</button>
                <button type="button" className="back-button" onClick={() => navigate("/")}>Cancelar</button>
                <div className="link">
                    <Link to="/register">¿No tienes cuenta? Regístrate</Link>
                </div>
            </form>
        </div>
    )
}

export default Login;