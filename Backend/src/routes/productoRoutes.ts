import express from 'express'
import { productoController } from '../container/productoContainer.ts'

const router = express.Router()

// GET /producto -> todos los productos
// GET /producto?nombre=camisa -> filtra por nombre
// GET /producto?categoria=ROPA -> filtra por una categoria
// GET /producto?categorias=ROPA,HOGAR -> filtra por varias categorias

// Endpoint de Productos, lo unico que cambia es la query que se mande en el front
// el controlador obtiene el query, y manda lo que se le pida
router.get('/', (req, res) => productoController.getProductos(req, res))

// POST /producto -> crear producto
router.post('/', (req, res) => productoController.postProducto(req, res))

// GET /producto/categorias define las categorias que existen, como para la checkbox en el front
router.get('/categorias', (req, res) => productoController.getCategoriasDisponibles(req, res))

export default router
