import { useContext } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthContext, AuthProvider } from './AuthContext';
import { loginUser } from '../services/auth/authService';

jest.mock('../services/auth/authService', () => ({
	loginUser: jest.fn()
}));

const mockedLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;

const AuthConsumer = () => {
	const context = useContext(AuthContext);

	if (!context) {
		return null;
	}

	return (
		<>
			<span data-testid="user">{context.user?.nombre ?? 'null'}</span>
			<button
				onClick={() =>
					context.login({ correo: 'juan@mail.com', password: 'password123' })
				}
			>
				Login
			</button>
			<button onClick={context.logout}>Logout</button>
		</>
	);
};

describe('AuthContext', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		localStorage.clear();
	});

	describe('Happy Path - Flujo de autenticación', () => {
		it('hace login y actualiza estado y localStorage', async () => {
			mockedLoginUser.mockResolvedValue({
				message: 'Inicio de sesión exitoso',
				token: 'new-token',
				user: {
					id: 1,
					nombre: 'Juan',
					correo: 'juan@mail.com',
					role: 'user',
					direccion_envio: 'Calle 123'
				}
			});

			render(
				<AuthProvider>
					<AuthConsumer />
				</AuthProvider>
			);

			fireEvent.click(screen.getByRole('button', { name: 'Login' }));

			await waitFor(() => {
				expect(screen.getByTestId('user')).toHaveTextContent('Juan');
			});

			expect(localStorage.getItem('token')).toBe('new-token');
			expect(mockedLoginUser).toHaveBeenCalledWith({
				correo: 'juan@mail.com',
				password: 'password123'
			});
		});

		it('hace logout y limpia estado y localStorage', async () => {
			render(
				<AuthProvider>
					<AuthConsumer />
				</AuthProvider>
			);

			fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

			await waitFor(() => {
				expect(screen.getByTestId('user')).toHaveTextContent('null');
			});

			expect(localStorage.getItem('token')).toBeNull();
		});
	});
});