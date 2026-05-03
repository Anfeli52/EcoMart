import type { Request, Response } from 'express'

interface IUserService {
  register(payload: any): Promise<any>
  login(payload: any): Promise<any>
}

class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
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

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const loginResult = await this.userService.login(req.body)
      return res.status(200).json({
        message: 'Login correcto',
        ...loginResult
      })
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        message: error.message || 'Error interno del servidor'
      })
    }
  }
}

export default UserController