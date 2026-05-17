import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../services/product/productService";
import type { ProductoDetalle } from "../types/types";
import "../AdminHome.css";
import api from "../api/axios";

type ModalMode = "create" | "edit";

const categorias = [
    "ELECTRONICA",
    "ROPA",
    "HOGAR",
    "DEPORTES",
    "OTROS"
];

type Categoria = (typeof categorias)[number];

const inicialFormulario = {
    nombre: "",
    descripcion: "",
    precio: 0,
    categoria: "ELECTRONICA" as Categoria,
    stock: 0,
    imagenUrl: "",
};

const AdminHome = () => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState<ProductoDetalle[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>("create");
    const [form, setForm] = useState<typeof inicialFormulario>(inicialFormulario);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<ProductoDetalle | null>(null);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const data = await getProducts() as ProductoDetalle[];
                setProductos(data);
            } catch (error) {
                console.error(error);
            }
        };
        cargarProductos();
    }, []);

    const abrirCrear = () => {
        setModalMode("create");
        setForm(inicialFormulario);
        setEditingId(null);
        setModalOpen(true);
    };

    const abrirEditar = (producto: ProductoDetalle) => {
        setModalMode("edit");
        setEditingId(producto.id);
        setForm({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            categoria: producto.categoria ?? "ELECTRONICA",
            stock: producto.stock,
            imagenUrl: producto.imagenUrl,
        });
        setModalOpen(true);
    };

    const cerrarModal = () => {
        setModalOpen(false);
        setEditingId(null);
    };

    const cerrarDeleteModal = () => {
        setDeleteModalOpen(false);
        setProductToDelete(null);
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]:
            name === "precio" || name === "stock" ? Number(value): value,
        }));
    };

    const guardarProducto = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

    try {
        if (modalMode === "create") {
            const response = await api.post("/producto", form);
            if (response.status === 201) {
                const data = await getProducts() as ProductoDetalle[];
                setProductos(data);
                cerrarModal();
            }

        } else if (modalMode === "edit" && editingId !== null) {
            const response = await api.put(`/producto/${editingId}`, form);
            if (response.status === 200) {
                const data = await getProducts() as ProductoDetalle[];
                setProductos(data);
                cerrarModal();
            }
        }
    } catch (error) {
        console.error("Error guardando producto:", error);
        alert("Error guardando producto");
    }
    };

    const abrirConfirmarEliminar = (producto: ProductoDetalle) => {
        setProductToDelete(producto);
        setDeleteModalOpen(true);
    };

    const eliminarProducto = async () => {
        if (!productToDelete) return;

        try {
            const response = await api.delete(`/producto/${productToDelete.id}`);
            if (response.status === 200 || response.status === 204) {
                const data = await getProducts() as ProductoDetalle[];
                setProductos(data);
                cerrarDeleteModal();
            }
        } catch (error) {
            console.error("Error eliminando producto:", error);
            alert("Error eliminando producto");
        }
    };

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="home-brand">Admin EcoMart</div>
                <div className="home-search">
                    <input type="text" placeholder="Buscar" />
                </div>
                <div className="home-actions">
                    <button type="button" className="home-button register" onClick={abrirCrear}>
                        Crear producto
                    </button>
                    <button type="button" className="home-button login" onClick={() => navigate("/Login")}>
                        Cerrar sesion
                    </button>
                </div>
            </header>
        <main className="product-list">
            {productos.map((producto) => (
                <div key={producto.id} className="product-card admin-product-card">
                    <img className="product-image"
                        src={producto.imagenUrl}
                        alt={producto.nombre}/>
                    <h3>{producto.nombre}</h3>
                    <p className="product-description">{producto.descripcion}</p>
                    <p className="product-meta">Precio: {producto.precio?.toLocaleString()} COP</p>
                    <p className="product-meta">Stock: {producto.stock}</p>
                    <p className="product-meta">Categoría: {producto.categoria}</p>
                    <div className="admin-card-actions">
                        <button type="button" className="secondary-button"
                            onClick={() => abrirEditar(producto)}>
                            Editar
                        </button>
                        <button type="button" className="danger-button"
                            onClick={() => abrirConfirmarEliminar(producto)}>
                            Eliminar
                        </button>
                    </div>
                </div>
            ))}
        </main>
        {modalOpen && (
            <div className="modal-backdrop" onClick={cerrarModal}>
                <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>{modalMode === "create" ? "Crear producto" : "Editar producto"}</h2>
                        <button type="button" className="icon-button" onClick={cerrarModal}>×</button>
                    </div>
                    <form className="admin-form" onSubmit={guardarProducto}>
                        <label>Nombre<input
                            name="nombre"
                            value={form.nombre}
                            onChange={handleChange}
                            required/>
                        </label>
                        <label>Descripción<textarea
                            name="descripcion"
                            value={form.descripcion}
                            onChange={handleChange}
                            rows={4}
                            required/>
                        </label>
                        <label>Precio<input
                            type="number"
                            name="precio"
                            value={form.precio}
                            onChange={handleChange}
                            min={0}
                            required/>
                        </label>
                        <label>Categoría<select
                            name="categoria"
                            value={form.categoria}
                            onChange={handleChange}
                            required>
                            {categorias.map((categoria) => (
                                <option key={categoria} value={categoria}>{categoria}</option>
                            ))}</select>
                        </label>
                        <label>Stock<input
                            type="number"
                            name="stock"
                            value={form.stock}
                            onChange={handleChange}
                            min={0}
                            required/>
                        </label>
                        <label>Imagen URL<input
                            name="imagenUrl"
                            value={form.imagenUrl}
                            onChange={handleChange}
                            required/>
                        </label>
                        <div className="modal-footer">
                            <button type="button" className="secondary-button" onClick={cerrarModal}>
                                Cancelar
                            </button>
                            <button type="submit" className="home-button register">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        {deleteModalOpen && (
            <div className="modal-backdrop" onClick={cerrarDeleteModal}>
                <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Eliminar producto</h2>
                    </div>
                    <p className="delete-text">
                        ¿Estás seguro de que deseas eliminar{" "}
                        <strong>{productToDelete?.nombre}</strong>?
                    </p>
                    <div className="modal-footer">
                        <button type="button" className="secondary-button" onClick={cerrarDeleteModal}>
                            Cancelar
                        </button>
                        <button type="button" className="danger-button" onClick={eliminarProducto}>
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
};

export default AdminHome;