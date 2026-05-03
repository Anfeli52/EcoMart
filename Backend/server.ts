import express from 'express'
import type { Express } from 'express'
import cors from 'cors'
import 'dotenv/config'
import userRoutes from './src/routes/user/userRoutes.ts'
import productoRoutes from './src/routes/producto/productoRoutes.ts'
import cartRoutes from './src/routes/cart/cartRoutes.ts'

const app: Express = express()
const PORT = process.env.PORT || 3000

//middleware
app.use(cors())
app.use(express.json())

//Aqui se montaran las rutas
app.use('/user', userRoutes)
app.use('/producto', productoRoutes)
app.use('/cart', cartRoutes)

//creamos el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})