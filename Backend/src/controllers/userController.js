class UserController {
  constructor(userService) {
    this.userService = userService
  }

  async register(req, res) {
    try {
      const user = await this.userService.register(req.body)
      return res.status(201).json({
        message: 'Usuario creado correctamente',
        user
      })
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor'
      })
    }
  }
}

export default UserController