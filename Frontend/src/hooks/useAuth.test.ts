import { render, screen } from '@testing-library/react';
import React from 'react';
import { useAuth } from './useAuth';

jest.mock('../context/AuthContext', () => {
	const React = jest.requireActual('react') as typeof import('react');
	return {
		AuthContext: React.createContext(null)
	};
});

const { AuthContext } = jest.requireMock('../context/AuthContext') as {
	AuthContext: React.Context<any>;
};

const HookConsumer = () => {
	const { user } = useAuth();

	return React.createElement(
		React.Fragment,
		null,
		React.createElement('span', { 'data-testid': 'user' }, user ?? 'null')
	);
};

describe('useAuth', () => {
	describe('Happy Path - Hook disponible', () => {
		it('retorna el contexto de autenticacion dentro de AuthProvider', () => {
			const value = {
				user: "Juan",
				login: jest.fn(),
				logout: jest.fn()
			};

			render(
				React.createElement(
					AuthContext.Provider,
					{ value },
					React.createElement(HookConsumer)
				)
			);

			expect(screen.getByTestId('user')).toHaveTextContent('Juan');
		});
	});

	describe('Negative Testing - Hook fuera del provider', () => {
		it('lanza error si se usa fuera de AuthProvider', () => {
			expect(() => render(React.createElement(HookConsumer))).toThrow(
				'useAuth must be used within AuthProvider'
			);
		});
	});

	describe('Boundary Testing - Contexto con valores nulos', () => {
		it('retorna valores nulos cuando AuthContext no tiene datos', () => {
			const valueNull = {
				user: null,
				login: jest.fn(),
				logout: jest.fn()
			};

			render(
				React.createElement(
					AuthContext.Provider,
					{ value: valueNull },
					React.createElement(HookConsumer)
				)
			);

			expect(screen.getByTestId('user')).toHaveTextContent('null');
		});
	});
});