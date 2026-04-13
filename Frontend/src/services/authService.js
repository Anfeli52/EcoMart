const API_URL = "http://localhost:3000";

export const registerUser = async (data) => {
    const response = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Error en el registro");
    }

    return result;
};

export const loginUser = async (data) => {
    const response = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Error en el login");
    }

    return result;
};