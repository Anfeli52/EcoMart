import { PrismaClient } from '@prisma/client'
import UserRepository from '../interfaces/userRepository.ts'

interface RegisterData {
  nombre: string
  correo: string
  password: string
  direccion_envio: string
  role: string
}

class PrismaUserRepository extends UserRepository {
  private prisma: PrismaClient

  constructor(prismaClient: PrismaClient) {
    super()
    this.prisma = prismaClient
  }

  //Buscar usuario por correo
  async findByCorreo(correo: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { correo }
    })
  }

  //Revisar si es el primer usuario para darle el rol de admin
  async hasUsers(): Promise<boolean> {
    const firstUser = await this.prisma.user.findFirst({
      select: { id: true }
    })

    return Boolean(firstUser)
  }

  async createUser(userData: RegisterData): Promise<any> {
    return this.prisma.user.create({
      data: userData
    })
  }
}

export default PrismaUserRepository