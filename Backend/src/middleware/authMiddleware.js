import jwt from 'jsonwebtoken'


// Esta funcion es aquella que decodea el token para todas las rutas protegidas
function authMiddleware(req, res, next) {
    
    //El token est en el header de la request
    const authHeader = req.headers.authorization

    //Caso token vacion
    if (!authHeader) {
        return res.status(401).json({ message: 'Sin token' })
    }

    const [scheme, token] = authHeader.split(' ')

    // caso token de un tipo invalido (Diferente a Bearer)
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Formato de token invalido' })
    }

    // funciones nativas de jwt para decodificar y verificar que es correcta
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token invalido' })
        }
        
        //devololver id de usuario decodificado 
        req.idUsuario = decoded.id
        next()
    })
}

export default authMiddleware