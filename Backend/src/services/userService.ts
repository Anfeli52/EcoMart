import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface RegisterData {
  nombre: string
  correo: string
  password: string
  direccion_envio?: string
}

interface UserResponse {
  id: string | number
  nombre: string
  correo: string
  role: string
  direccion_envio: string
}

interface LoginData {
  correo: string
  password: string
}

interface LoginResponse {
  token: string
  user: UserResponse
}

interface UserRepository {
  findByCorreo(correo: string): Promise<any>
  hasUsers(): Promise<boolean>
  createUser(userData: RegisterData & { role: string }): Promise<any>
}

interface CustomError extends Error {
  statusCode?: number
}

class UserService {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async register(userData: RegisterData): Promise<UserResponse> {
    const { nombre, correo, password, direccion_envio } = userData

    if (!nombre || !correo || !password) {
      const error: CustomError = new Error('nombre, correo y password son obligatorios')
      error.statusCode = 400
      throw error
    }

    const existingUser = await this.userRepository.findByCorreo(correo)
    if (existingUser) {
      const error: CustomError = new Error('El correo ya esta registrado')
      error.statusCode = 409
      throw error
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const hasUsers = await this.userRepository.hasUsers()
    const role = hasUsers ? 'user' : 'admin'

    const createdUser = await this.userRepository.createUser({
      nombre,
      correo,
      password: hashedPassword,
      direccion_envio: direccion_envio || '',
      role
    })

    return {
      id: createdUser.id,
      nombre: createdUser.nombre,
      correo: createdUser.correo,
      role: createdUser.role,
      direccion_envio: createdUser.direccion_envio
    }
  }

  async login(loginData: LoginData): Promise<LoginResponse> {
    const { correo, password } = loginData

    if (!correo || !password) {
      const error: CustomError = new Error('correo y password son obligatorios')
      error.statusCode = 400
      throw error
    }

    const user = await this.userRepository.findByCorreo(correo)
    if (!user) {
      const error: CustomError = new Error('Credenciales invalidas')
      error.statusCode = 401
      throw error
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      const error: CustomError = new Error('Credenciales invalidas')
      error.statusCode = 401
      throw error
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      const error: CustomError = new Error('JWT_SECRET no configurada en variables de entorno')
      error.statusCode = 500
      throw error
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    )

    return {
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        role: user.role,
        direccion_envio: user.direccion_envio
      }
    }
  }
}

export default UserService