import express from 'express'
import type { Express } from 'express'
import cors from 'cors'
import 'dotenv/config'
import userRoutes from './routes/userRoutes.ts'

const app: Express = express()
const PORT = process.env.PORT || 3000

//middleware
app.use(cors())
app.use(express.json())

//Aqui se montaran las rutas
app.use('/user', userRoutes)

//creamos el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})