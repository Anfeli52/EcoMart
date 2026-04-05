import bcrypt from 'bcrypt'

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async register(userData = {}) {
    const { nombre, correo, password, direccion_envio } = userData

    if (!nombre || !correo || !password) {
      const error = new Error('nombre, correo y password son obligatorios')
      error.statusCode = 400
      throw error
    }

    const existingUser = await this.userRepository.findByCorreo(correo)
    if (existingUser) {
      const error = new Error('El correo ya esta registrado')
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