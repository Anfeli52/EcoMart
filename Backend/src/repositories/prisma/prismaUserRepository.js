import UserRepository from '../interfaces/userRepository.js'

class PrismaUserRepository extends UserRepository {
  constructor(prismaClient) {
    super()
    this.prisma = prismaClient
  }

  //Buscar usuario por correo
  async findByCorreo(correo) {
    return this.prisma.user.findUnique({
      where: { correo }
    })
  }

  //Revisar si es el primer usuario para darle el rol de admin
  async hasUsers() {
    const firstUser = await this.prisma.user.findFirst({
      select: { id: true }
    })

    return Boolean(firstUser)
  }

  async createUser(userData) {
    return this.prisma.user.create({
      data: userData
    })
  }
}

export default PrismaUserRepository