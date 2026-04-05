interface RegisterData {
  nombre: string
  correo: string
  password: string
  direccion_envio: string
  role: string
}

abstract class UserRepository {
  abstract findByCorreo(correo: string): Promise<any>
  abstract hasUsers(): Promise<boolean>
  abstract createUser(userData: RegisterData): Promise<any>
}

export default UserRepository