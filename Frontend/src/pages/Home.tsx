import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../services/product/productService";
import type { Producto } from "../types/types";
import carritoIcon from "../assets/shopCart.png"
import "../Home.css";


const Home = () => {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    
    const [productos, setProductos] = useState<Producto[]>([]);
    
    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const data = await getProducts();
                setProductos(data);
            } catch (error) {
                console.error(error);
            }
        };
        cargarProductos();
    }, []);
    
    const agregarAlCarrito = (productID: number) => {
        console.log("Producto agregado al carrito:", productID);
        setCartCount((prev) => prev + 1);
        setModalVisible(true);
    };

const cerrarModal = () => setModalVisible(false);
const verCarrito = () => navigate("/cart");

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="home-brand">EcoMart</div>
                <div className="home-search">
                    <input type="text" placeholder="Buscar" />
                </div>
                <div className="home-actions">
                    <button className="icon-button shopCart">
                        <img src={carritoIcon} alt="Carrito de compras"/>
                    </button>
                    <Link to="/login" className="home-button login">Iniciar sesión</Link>
                    <Link to="/register" className="home-button register">Registrarse</Link>
                </div>
            </header>
            {modalVisible && (
                <div className="cart-modal-backdrop" onClick={cerrarModal}>
                    <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="cart-modal-icon">✓</div>
                        <h2>Añadido al carrito</h2>
                        <p>Tienes {cartCount} item{cartCount > 1 ? "s" : ""}</p>
                        <div className="cart-modal-actions">
                            <button className="cart-button close" type="button"
                            onClick={cerrarModal}>Continuar comprando</button>
                            <button className="cart-button view" type="button"
                            onClick={verCarrito}>Ver carrito</button>
                        </div>
                    </div>
                </div>
            )}
            <main className="product-list">
                {productos.map((p) => (
                <div key={p.id} className="product-card">
                    <img className="product-image" src={p.imagenUrl} alt={p.nombre}/>
                    <h3>{p.nombre}</h3>
                    <p>{p.precio.toLocaleString()} COP</p>
                    <div className="product-overlay">
                        <button className="product-button" type="button" 
                            onClick={() => agregarAlCarrito(p.id)}>Añadir al carrito
                        </button>
                    </div>
                    
                </div>
        ))}
        </main>
        </div>
    );
}
export default Home;