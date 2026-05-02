import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

jest.mock('react-router-dom', () => {
	const actual = jest.requireActual('react-router-dom');
	return {
		...actual,
		Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
			<a href={to}>{children}</a>
		)
	};
});

jest.mock('../../context/AuthContext', () => {
	const React = jest.requireActual('react') as typeof import('react');
	return {
		AuthContext: React.createContext(null)
	};
});

const { AuthContext } = jest.requireMock('../../context/AuthContext') as {
	AuthContext: React.Context<any>;
};

describe('Login Page', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		jest.spyOn(window, 'alert').mockImplementation(() => undefined);
	});

	afterEach(() => {
		(window.alert as jest.Mock).mockRestore();
	});

	describe('Happy Path - Login exitoso', () => {
		it('envia credenciales y navega al home cuando login es exitoso', async () => {
			const loginMock = jest.fn().mockResolvedValue({
				message: 'Inicio de sesión exitoso',
				token: 'token-123',
				user: {
					id: 1,
					nombre: 'Juan',
					correo: 'juan@mail.com',
					role: 'user',
					direccion_envio: 'Calle 123'
				}
			});

			render(
				<MemoryRouter>
					<AuthContext.Provider
						value={{ user: null, token: null, login: loginMock, logout: jest.fn() }}
					>
						<Login />
					</AuthContext.Provider>
				</MemoryRouter>
			);

			fireEvent.change(screen.getByPlaceholderText('Correo'), {
				target: { name: 'correo', value: 'juan@mail.com' }
			});
			fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
				target: { name: 'password', value: 'password123' }
			});
			fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

			await waitFor(() => {
				expect(loginMock).toHaveBeenCalledWith({
					correo: 'juan@mail.com',
					password: 'password123'
				});
				expect(window.alert).toHaveBeenCalledWith('Inicio de sesión exitoso');
			});
		});
	});

	describe('Negative Testing - Errores en login', () => {
		it('muestra alert con mensaje de error cuando login falla', async () => {
			const loginMock = jest.fn().mockRejectedValue(new Error('Credenciales invalidas'));

			render(
				<MemoryRouter>
					<AuthContext.Provider
						value={{ user: null, token: null, login: loginMock, logout: jest.fn() }}
					>
						<Login />
					</AuthContext.Provider>
				</MemoryRouter>
			);

			fireEvent.change(screen.getByPlaceholderText('Correo'), {
				target: { name: 'correo', value: 'juan@mail.com' }
			});
			fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
				target: { name: 'password', value: 'wrong' }
			});
			fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

			await waitFor(() => {
				expect(window.alert).toHaveBeenCalledWith('Credenciales invalidas');
			});
		});

		it('muestra error genérico cuando login lanza error inesperado', async () => {
			const loginMock = jest.fn().mockRejectedValue(new Error('Network error'));

			render(
				<MemoryRouter>
					<AuthContext.Provider
						value={{ user: null, token: null, login: loginMock, logout: jest.fn() }}
					>
						<Login />
					</AuthContext.Provider>
				</MemoryRouter>
			);

			fireEvent.change(screen.getByPlaceholderText('Correo'), {
				target: { name: 'correo', value: 'juan@mail.com' }
			});
			fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
				target: { name: 'password', value: 'password123' }
			});
			fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

			await waitFor(() => {
				expect(window.alert).toHaveBeenCalledWith('Network error');
			});
		});
	});

	describe('Boundary Testing - Casos límite en login', () => {
		it('acepta correo con caracteres especiales válidos', async () => {
			const loginMock = jest.fn().mockResolvedValue({ token: 'token-123' });

			render(
				<MemoryRouter>
					<AuthContext.Provider
						value={{ user: null, token: null, login: loginMock, logout: jest.fn() }}
					>
						<Login />
					</AuthContext.Provider>
				</MemoryRouter>
			);

			fireEvent.change(screen.getByPlaceholderText('Correo'), {
				target: { name: 'correo', value: 'user+test@subdomain.mail.com' }
			});
			fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
				target: { name: 'password', value: 'P@ssw0rd!#$%' }
			});
			fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

			await waitFor(() => {
				expect(loginMock).toHaveBeenCalledWith({
					correo: 'user+test@subdomain.mail.com',
					password: 'P@ssw0rd!#$%'
				});
			});
		});

		it('acepta contraseña muy larga', async () => {
			const loginMock = jest.fn().mockResolvedValue({ token: 'token-123' });
			const longPassword = 'A'.repeat(100) + '!@#$%^&*()';

			render(
				<MemoryRouter>
					<AuthContext.Provider
						value={{ user: null, token: null, login: loginMock, logout: jest.fn() }}
					>
						<Login />
					</AuthContext.Provider>
				</MemoryRouter>
			);

			fireEvent.change(screen.getByPlaceholderText('Correo'), {
				target: { name: 'correo', value: 'juan@mail.com' }
			});
			fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
				target: { name: 'password', value: longPassword }
			});
			fireEvent.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

			await waitFor(() => {
				expect(loginMock).toHaveBeenCalledWith({
					correo: 'juan@mail.com',
					password: longPassword
				});
			});
		});
	});
});