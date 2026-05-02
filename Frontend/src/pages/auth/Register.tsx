import { useState, type ChangeEvent, type FormEvent } from "react";
import { registerUser } from "../../services/auth/authService";
import type { RegisterData } from "../../types/types";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterData>({
        nombre: "",
        correo: "",
        password: "",
        direccion_envio: ""
    });
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === "confirmPassword") {
            setConfirmPassword(value)
        } else {
            setForm({
                ...form,
                [name]: value
            })
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (form.password !== confirmPassword) {
            setErrorMsg("Las contraseñas no coinciden")
            return
        }
        try {
            await registerUser(form);
            navigate("/login");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg("Error en el registro");
            }
        }
    }

    return (
        <div className="auth-layout">

            <div className="auth-visual">
                <div className="overlay">
                    <h1>EcoMart</h1>
                    <p>Únete y empieza a comprar sin límites</p>
                </div>
            </div>

            <div className="auth-form-container">
                <form className="auth-form" onSubmit={handleSubmit}>

                    <button type="button" className="icon-button" onClick={() => navigate("/")}>✕</button>

                    <h2>Crear Cuenta</h2>

                    {errorMsg && <p className="error">{errorMsg}</p>}


                    <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />

                    <input type="email" name="correo" placeholder="Correo" onChange={handleChange} required />

                    <div className="input-group">
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Contraseña" onChange={handleChange} required />
                        <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </button>
                    </div>

                    <div className="input-group">
                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirma tu contraseña" onChange={handleChange} required />
                        <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </button>
                    </div>
                    {form.password && confirmPassword && form.password !== confirmPassword && (
                        <p className="error">Las contraseñas no coinciden</p>
                    )}
                    <input type="text" name="direccion_envio" placeholder="Dirección de envío" onChange={handleChange} />

                    <button type="submit">Registrarse</button>

                    <div className="link">
                        <Link to="/login">
                            ¿Ya tienes cuenta? Inicia sesión
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;