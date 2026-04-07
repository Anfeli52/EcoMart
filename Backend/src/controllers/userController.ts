import type { Request, Response } from 'express'

interface UserService {
  register(userData: any): Promise<any>
}

interface CustomError extends Error {
  statusCode?: number
}

class UserController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.userService.register(req.body)
      return res.status(201).json({
        message: 'Usuario creado correctamente',
        user
      })
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor'
      })
    }
  }
}

export default UserController