import { getProducts } from './productService';

jest.mock('../../api/axios', () => ({
	__esModule: true,
	default: {
		get: jest.fn()
	}
}));

const { default: api } = jest.requireMock('../../api/axios') as {
	default: { get: jest.Mock };
};

describe('productService', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Happy Path - Consulta de productos', () => {
		it('getProducts retorna la lista de productos', async () => {
			const products = [
				{
					id: 1,
					nombre: 'Arroz',
					precio: 12,
					imagenUrl: 'https://img.test/arroz.png'
				},
				{
					id: 2,
					nombre: 'Leche',
					precio: 8,
					imagenUrl: 'https://img.test/leche.png'
				}
			];

			api.get.mockResolvedValue({ data: products });

			const result = await getProducts();

			expect(api.get).toHaveBeenCalledWith('/products');
			expect(result).toEqual(products);
		});
	});

	describe('Negative Testing - Fallos de red/servicio', () => {
		it('getProducts propaga el error cuando falla la peticion', async () => {
			const error = new Error('fallo al obtener productos');
			api.get.mockRejectedValue(error);

			await expect(getProducts()).rejects.toThrow('fallo al obtener productos');
			expect(api.get).toHaveBeenCalledWith('/products');
		});
	});

	describe('Boundary Testing - Casos límite de respuesta', () => {
		it('getProducts retorna arreglo vacío cuando no hay productos', async () => {
			api.get.mockResolvedValue({ data: [] });

			const result = await getProducts();

			expect(result).toEqual([]);
		});
	});
});