import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        nombre: "",
        correo: "",
        password: "",
        direccion_envio: ""
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
            const response = await registerUser(form);
            alert(response.message || "Registro exitoso");
            navigate("/login");
        } catch (error) {
            alert(error.message || "Error en el registro");
        }
    }

    return (
        <div className="auth-container">            
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Registro de Usuario</h2>
                <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
                <input type="email" name="correo" placeholder="Correo" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required />
                <input type="text" name="direccion_envio" placeholder="Dirección de Envío" onChange={handleChange} required />
                <button type="submit">Registrarse</button>
            </form>
        </div>
    )
}

export default Register;