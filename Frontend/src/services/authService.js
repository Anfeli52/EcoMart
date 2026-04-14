import api from "../api/axios";

export const registerUser = async (data) => {
    try {
        const response = await api.post("/user/register", data);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Error en el registro"
        );
    }
};

export const loginUser = async (data) => {
    try {
        const response = await api.post("/user/login", data);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message || "Error en el login"
        );
    }
};