import api from '../../api/axios';

export const getProducts = async () => {
	const response = await api.get('/products');
	return response.data;
};