// src/services/user.service.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // La URL de tu backend

// Datos que esperamos recibir del componente de registro
interface UserProfileData {
    firebaseUid: string;
    email: string;
    nombre: string;
    apellidos: string;
    rol: 'atleta' | 'dueño_box'; // Aseguramos que el rol sea uno de los válidos
    nivel?: string; // Opcional
    box?: string; // Opcional
}

export const registerUserProfile = async (userData: UserProfileData) => {
    try {
        // Hacemos el POST a tu endpoint /api/users
        const response = await axios.post(`${API_URL}/api/users`, userData);
        return response.data; // Devuelve la respuesta del backend
    } catch (error) {
        console.error("Error al registrar perfil en backend:", error);
        throw error; // Propaga el error para que el componente lo maneje
    }
};