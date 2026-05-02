import { Link, useNavigate } from "react-router-dom";
import carritoIcon from "../assets/shopCart.png"
import { useAuth } from "../hooks/useAuth";

export const Navbar = () => {
    const navigate = useNavigate();

    const verCarrito = () => navigate("/cart");
    const { token, user, logout } = useAuth();

    return (
        <>
            <header className="home-header">
                <Link to="/" className="home-brand">EcoMart</Link>
                <div className="home-search">
                    <input type="text" placeholder="Buscar" />
                </div>
                <div className="home-actions">
                    <button className="icon-button shopCart"
                    onClick={verCarrito}>
                        <img src={carritoIcon} alt="Carrito de compras"/>
                    </button>
                    <div className="home-navbar">
                        { token ? (
                            <div>
                                <span className="home-user">Hola, {user ?? "Usuario"}</span>
                                <button className="home-button logout" onClick={logout}>Cerrar Sesión</button>
                            </div>
                        ): (
                            <div>
                                <Link to="/login" className="home-button login">Iniciar sesión</Link>
                                <Link to="/register" className="home-button register">Registrarse</Link>
                            </div>
                        )}
                    </div> 
                </div>
            </header>
            
        </>
    )
}