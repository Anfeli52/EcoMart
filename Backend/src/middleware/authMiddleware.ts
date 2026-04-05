import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthRequest extends Request {
  idUsuario?: string | number
}

// Esta funcion es aquella que decodea el token para todas las rutas protegidas
function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): any {
    
    //El token está en el header de la request
    const authHeader = req.headers.authorization

    //Caso token vacio
    if (!authHeader) {
        return res.status(401).json({ message: 'Sin token' })
    }

    const [scheme, token] = authHeader.split(' ')

    // caso token de un tipo invalido (Diferente a Bearer)
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Formato de token invalido' })
    }

    // funciones nativas de jwt para decodificar y verificar que es correcta
    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, decoded: any) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalido' })
        }
        
        //devoliver id de usuario decodificado 
        req.idUsuario = decoded.id
        next()
    })
}

export default authMiddleware