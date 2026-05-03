import { useContext } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthContext, AuthProvider } from './AuthContext';
import { loginUser } from '../services/auth/authService';
import { jwtDecode } from 'jwt-decode';

jest.mock('../services/auth/authService', () => ({
	loginUser: jest.fn()
}));

jest.mock('jwt-decode', () => ({
	jwtDecode: jest.fn((token: string) => (token ? { name: 'Juan' } : { name: null }))
}));

const mockedLoginUser = loginUser as jest.MockedFunction<typeof loginUser>;
const mockedJwtDecode = jwtDecode as jest.MockedFunction<typeof jwtDecode>;

const AuthConsumer = () => {
	const context = useContext(AuthContext);

	if (!context) {
		return null;
	}

	return (
		<>
			<span data-testid="user">{context.user ?? 'null'}</span>
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
			mockedJwtDecode.mockImplementation((token: string) =>
				token ? ({ name: 'Juan' } as any) : ({ name: null } as any)
			);

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
			mockedJwtDecode.mockImplementation((token: string) =>
				token ? ({ name: 'Juan' } as any) : ({ name: null } as any)
			);

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