import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({
        correo: "",
        password: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(form);
            alert(response.message || "Inicio de sesión exitoso");
        } catch (error) {
            alert(error.message || "Error en el inicio de sesión");
        }
    }

    return (
        <div className="auth-container">            
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Iniciar Sesión</h2>
                <input type="email" name="correo" placeholder="Correo" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
                <button type="submit">Iniciar Sesión</button>
                <div className="link">
                    <a href="/register">¿No tienes cuenta? Regístrate</a>
                </div>
            </form>
        </div>
    )
}

export default Login;