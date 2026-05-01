import axios from 'axios';
import { loginUser, registerUser } from './authService';

jest.mock('../../api/axios', () => ({
	__esModule: true,
	default: {
		post: jest.fn()
	}
}));

jest.mock('axios', () => ({
	__esModule: true,
	default: {
		isAxiosError: jest.fn()
	}
}));

const { default: api } = jest.requireMock('../../api/axios') as {
	default: { post: jest.Mock };
};

const mockedAxios = axios as unknown as {
	isAxiosError: jest.Mock;
};

describe('authService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Happy Path - Autenticación exitosa', () => {
		it('registerUser retorna data cuando la peticion es exitosa', async () => {
			const payload = {
				nombre: 'Juan',
				correo: 'juan@mail.com',
				password: 'password123',
				direccion_envio: 'Calle 123'
			};
			const responseData = { message: 'Usuario registrado' };

			api.post.mockResolvedValue({ data: responseData });

			const result = await registerUser(payload);

			expect(api.post).toHaveBeenCalledWith('/user/register', payload);
			expect(result).toEqual(responseData);
		});

		it('loginUser retorna data cuando la peticion es exitosa', async () => {
			const payload = { correo: 'juan@mail.com', password: 'password123' };
			const responseData = {
				token: 'jwt-token',
				user: {
					id: 1,
					nombre: 'Juan',
					correo: 'juan@mail.com',
					role: 'user',
					direccion_envio: 'Calle 123'
				}
			};

			api.post.mockResolvedValue({ data: responseData });

			const result = await loginUser(payload);

			expect(api.post).toHaveBeenCalledWith('/user/login', payload);
			expect(result).toEqual(responseData);
		});
	});

	describe('Negative Testing - Errores en autenticación', () => {
		it('registerUser lanza mensaje de Axios cuando existe response.data.message', async () => {
			const payload = {
				nombre: 'Juan',
				correo: 'juan@mail.com',
				password: 'password123'
			};
			const axiosError = {
				response: {
					data: {
						message: 'Correo ya registrado'
					}
				}
			};

			api.post.mockRejectedValue(axiosError);
			mockedAxios.isAxiosError.mockReturnValue(true);

			await expect(registerUser(payload)).rejects.toThrow('Correo ya registrado');
		});

		it('loginUser usa mensaje por defecto si Axios no trae message', async () => {
			const payload = { correo: 'juan@mail.com', password: 'password123' };
			const axiosError = { response: { data: {} } };

			api.post.mockRejectedValue(axiosError);
			mockedAxios.isAxiosError.mockReturnValue(true);

			await expect(loginUser(payload)).rejects.toThrow('Error en el login');
		});

		it('registerUser usa mensaje por defecto para errores no Axios', async () => {
			const payload = {
				nombre: 'Juan',
				correo: 'juan@mail.com',
				password: 'password123'
			};

			api.post.mockRejectedValue(new Error('network down'));
			mockedAxios.isAxiosError.mockReturnValue(false);

			await expect(registerUser(payload)).rejects.toThrow('Error en el registro');
		});
	});

	describe('Boundary Testing - Casos límite en autenticación', () => {
		it('registerUser maneja email con caracteres especiales', async () => {
			const payload = {
				nombre: 'José María O\'Reilly-García',
				correo: 'juan+test@subdomain.mail.com',
				password: 'P@ssw0rd!#$%^&*()',
				direccion_envio: 'Calle 123'
			};
			const responseData = { message: 'Usuario registrado' };

			api.post.mockResolvedValue({ data: responseData });

			const result = await registerUser(payload);

			expect(api.post).toHaveBeenCalledWith('/user/register', payload);
			expect(result).toEqual(responseData);
		});

		it('loginUser responde con token válido para emails largos', async () => {
			const payload = {
				correo: 'firstname.lastname+alias@subdomain.example.co.uk',
				password: 'password123'
			};
			const responseData = {
				token: 'jwt-token-123456',
				user: {
					id: 999,
					nombre: 'Long Email User',
					correo: payload.correo,
					role: 'user',
					direccion_envio: ''
				}
			};

			api.post.mockResolvedValue({ data: responseData });

			const result = await loginUser(payload);

			expect(result.token).toBe('jwt-token-123456');
			expect(result.user.correo).toBe(payload.correo);
		});

		it('registerUser acepta contraseña con longitud máxima', async () => {
			const longPassword = 'A'.repeat(128) + '!@#$%^&*()';
			const payload = {
				nombre: 'User',
				correo: 'user@mail.com',
				password: longPassword
			};
			const responseData = { message: 'Usuario registrado' };

			api.post.mockResolvedValue({ data: responseData });

			const result = await registerUser(payload);

			expect(api.post).toHaveBeenCalledWith('/user/register', payload);
			expect(result).toEqual(responseData);
		});
	});
});