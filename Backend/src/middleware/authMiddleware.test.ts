import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import authMiddleware from './authMiddleware.ts'

type MockResponse = {
	status: ReturnType<typeof jest.fn>
	json: ReturnType<typeof jest.fn>
}

type MockRequest = {
	headers: Record<string, string | undefined>
	idUsuario?: string | number
}

function createMockResponse(): MockResponse {
	const response = {} as MockResponse
	response.status = jest.fn().mockReturnValue(response)
	response.json = jest.fn().mockReturnValue(response)
	return response
}

describe('authMiddleware', () => {
	let req: MockRequest
	let res: MockResponse
	let next: ReturnType<typeof jest.fn>
	const originalJwtSecret = process.env.JWT_SECRET

	beforeEach(() => {
		req = { headers: {} }
		res = createMockResponse()
		next = jest.fn()
		process.env.JWT_SECRET = 'test-secret-key'
	})

	afterEach(() => {
		if (originalJwtSecret) {
			process.env.JWT_SECRET = originalJwtSecret
		} else {
			delete process.env.JWT_SECRET
		}
	})

	describe('Happy Path - Token válido', () => {
		it('permite pasar al siguiente middleware cuando el token es válido', (done) => {
			const jwt = require('jsonwebtoken')
			const validToken = jwt.sign({ id: 42 }, 'test-secret-key')
			req.headers.authorization = `Bearer ${validToken}`

			authMiddleware(req as any, res as any, next)

			process.nextTick(() => {
				expect(next).toHaveBeenCalledTimes(1)
				expect(req.idUsuario).toBe(42)
				expect(res.status).not.toHaveBeenCalled()
				done()
			})
		})
	})

	describe('Negative Testing - Token faltante o inválido', () => {
		it('retorna 401 cuando no hay header authorization', () => {
			authMiddleware(req as any, res as any, next)

			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.json).toHaveBeenCalledWith({ message: 'Sin token' })
			expect(next).not.toHaveBeenCalled()
		})

		it('retorna 401 cuando el scheme no es Bearer', () => {
			req.headers.authorization = 'Basic abc123'

			authMiddleware(req as any, res as any, next)

			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.json).toHaveBeenCalledWith({ message: 'Formato de token invalido' })
			expect(next).not.toHaveBeenCalled()
		})

		it('retorna 401 cuando no hay token después de Bearer', () => {
			req.headers.authorization = 'Bearer'

			authMiddleware(req as any, res as any, next)

			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.json).toHaveBeenCalledWith({ message: 'Formato de token invalido' })
			expect(next).not.toHaveBeenCalled()
		})

		it('retorna 401 cuando el token es inválido', () => {
			req.headers.authorization = 'Bearer invalid-token'

			authMiddleware(req as any, res as any, next)

			expect(res.status).toHaveBeenCalledWith(401)
			expect(res.json).toHaveBeenCalledWith({ message: 'Token invalido' })
			expect(next).not.toHaveBeenCalled()
		})
	})

	describe('Boundary Testing - Payload mínimo y claims extra', () => {
		it('extrae el id del usuario desde el token decodificado', (done) => {
			const jwt = require('jsonwebtoken')
			const validToken = jwt.sign({ id: 99, role: 'admin' }, 'test-secret-key')
			req.headers.authorization = `Bearer ${validToken}`

			authMiddleware(req as any, res as any, next)

			process.nextTick(() => {
				expect(req.idUsuario).toBe(99)
				expect(next).toHaveBeenCalled()
				done()
			})
		})
	})
})
