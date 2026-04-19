import api from "../../api/axios";
import axios from "axios";
import type {RegisterData, LoginData, LoginResponse} from "../../types/types"

export const registerUser = async (data: RegisterData) => {
    try {
        const response = await api.post("/user/register", data);
        return response.data;
    } catch (error: unknown) {
        if(axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Error en el registro"
            );
        }
        throw new Error("Error en el registro");
    }
};

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
    try {
        const response = await api.post("/user/login", data);
        return response.data;
    } catch (error: unknown) {
        if(axios.isAxiosError(error)) {
            throw new Error(
                error.response?.data?.message || "Error en el login"
            );
        }
        throw new Error("Error en el login");
    }
};