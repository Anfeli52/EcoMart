import bcrypt from 'bcrypt'

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
}

export default UserService