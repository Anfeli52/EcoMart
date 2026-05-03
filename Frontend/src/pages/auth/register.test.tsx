import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import { registerUser } from '../../services/auth/authService';

const mockNavigate = jest.fn();

jest.mock('../../services/auth/authService', () => ({
	registerUser: jest.fn()
}));

jest.mock('react-router-dom', () => {
	const actual = jest.requireActual('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate
	};
});

const mockedRegisterUser = registerUser as jest.MockedFunction<typeof registerUser>;

describe('Register Page', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Happy Path - Registro exitoso', () => {
		it('envia formulario y navega a login cuando es exitoso', async () => {
			mockedRegisterUser.mockResolvedValue({ message: 'Registro exitoso' });

			render(
				<MemoryRouter>
					<Register />
				</MemoryRouter>
			);

			fireEvent.change(screen.getByPlaceholderText('Nombre'), {
				target: { name: 'nombre', value: 'Juan' }
			});
			fireEvent.change(screen.getByPlaceholderText('Correo'), {
				target: { name: 'correo', value: 'juan@mail.com' }
			});
			fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
				target: { name: 'password', value: 'password123' }
			});
			fireEvent.change(screen.getByPlaceholderText('Confirma tu contraseña'), {
				target: { name: 'confirmPassword', value: 'password123' }
			});
			fireEvent.change(screen.getByPlaceholderText('Dirección de envío'), {
				target: { name: 'direccion_envio', value: 'Calle 123' }
			});

			fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

			await waitFor(() => {
				expect(mockedRegisterUser).toHaveBeenCalledWith({
					nombre: 'Juan',
					correo: 'juan@mail.com',
					password: 'password123',
					direccion_envio: 'Calle 123'
				});
				expect(mockNavigate).toHaveBeenCalledWith('/login');
			});
		});
	});

	describe('Negative Testing - Errores en registro', () => {
		it('muestra mensaje de error cuando registerUser falla', async () => {
			mockedRegisterUser.mockRejectedValue(new Error('Error en el registro'));

			render(
				<MemoryRouter>
					<Register />
				</MemoryRouter>
			);

			fireEvent.change(screen.getByPlaceholderText('Nombre'), {
				target: { name: 'nombre', value: 'Juan' }
			});
			fireEvent.change(screen.getByPlaceholderText('Correo'), {
				target: { name: 'correo', value: 'juan@mail.com' }
			});
			fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
				target: { name: 'password', value: 'password123' }
			});
			fireEvent.change(screen.getByPlaceholderText('Confirma tu contraseña'), {
				target: { name: 'confirmPassword', value: 'password123' }
			});
			fireEvent.change(screen.getByPlaceholderText('Dirección de envío'), {
				target: { name: 'direccion_envio', value: 'Calle 123' }
			});

			fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

			await waitFor(() => {
				expect(screen.getByText('Error en el registro')).toBeInTheDocument();
			});
		});
	});

	describe('Boundary Testing - Casos límite en registro', () => {
		it('acepta campos de texto largos y mantiene el flujo exitoso', async () => {
			mockedRegisterUser.mockResolvedValue({ message: 'Registro exitoso' });
			const longNombre = 'A'.repeat(80);
			const longDireccion = 'Calle '.concat('X'.repeat(120));

			render(
				<MemoryRouter>
					<Register />
				</MemoryRouter>
			);

			fireEvent.change(screen.getByPlaceholderText('Nombre'), {
				target: { name: 'nombre', value: longNombre }
			});
			fireEvent.change(screen.getByPlaceholderText('Correo'), {
				target: { name: 'correo', value: 'user+test@subdomain.mail.com' }
			});
			fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
				target: { name: 'password', value: 'A'.repeat(64) }
			});
			fireEvent.change(screen.getByPlaceholderText('Confirma tu contraseña'), {
				target: { name: 'confirmPassword', value: 'A'.repeat(64) }
			});
			fireEvent.change(screen.getByPlaceholderText('Dirección de envío'), {
				target: { name: 'direccion_envio', value: longDireccion }
			});

			fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

			await waitFor(() => {
				expect(mockedRegisterUser).toHaveBeenCalledWith({
					nombre: longNombre,
					correo: 'user+test@subdomain.mail.com',
					password: 'A'.repeat(64),
					direccion_envio: longDireccion
				});
			});
		});
	});
});