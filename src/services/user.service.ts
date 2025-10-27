import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface UserProfileData {
    firebaseUid: string;
    email: string;
    nombre: string;
    apellidos: string;
    rol: 'atleta' | 'dueño_box';
    nivel?: string;
    box?: string;
}

export const registerUserProfile = async (userData: UserProfileData) => {
    try {
        const response = await axios.post(`${API_URL}/api/users`, userData);
        return response.data;
    } catch (error) {
        console.error("Error al registrar perfil en backend:", error);
        throw error;
    }
};

export const getUserProfile = async (token: string) => {
    try {
        const response = await axios.get(`${API_URL}/api/users/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        throw error;
    }
};