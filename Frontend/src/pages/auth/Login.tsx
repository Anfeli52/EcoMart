import { useState, useContext, type ChangeEvent, type FormEvent } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import type { LoginData } from "../../types/types";

const Login = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    if (!auth) {
        throw new Error("AuthContext no disponible");
    }

    const { login } = auth;
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
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
            await login(form);
            navigate("/")
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrorMsg(error.message);
            } else {
                setErrorMsg("Error en el inicio de sesión");
            }
        }
    }

    return (
        <div className="auth-layout">

            <div className="auth-visual">
                <div className="overlay">
                    <h1>EcoMart</h1>
                    <p>Compra inteligente, sostenible y fácil</p>
                </div>
            </div>

            <div className="auth-form-container">
                <form className="auth-form" onSubmit={handleSubmit}>

                    <button
                        type="button"
                        className="icon-button"
                        onClick={() => navigate("/")}
                    >
                        ✕
                    </button>

                    <h2>Iniciar Sesión</h2>

                    {errorMsg && <p className="error">{errorMsg}</p>}

                    <input type="email" name="correo" placeholder="Correo" onChange={handleChange} required />
                    <div className="input-group">
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="Contraseña" onChange={handleChange} required />
                        <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                        </button>
                    </div>

                    <button type="submit">Iniciar Sesión</button>

                    <div className="link">
                        <Link to="/register">¿No tienes cuenta? Regístrate</Link>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default Login;