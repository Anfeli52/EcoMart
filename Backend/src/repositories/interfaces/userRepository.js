class UserRepository {
  async findByCorreo(_correo) {
    throw new Error('Method findByCorreo must be implemented')
  }

  async hasUsers() {
    throw new Error('Method hasUsers must be implemented')
  }

  async createUser(_userData) {
    throw new Error('Method createUser must be implemented')
  }
}

export default UserRepository