import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ===== INTERFACES =====
interface QuickRegisterData {
    firebaseUid: string;
    email: string;
    nombre: string;
}

interface CompleteProfileData {
    apellidos?: string;
    nivel?: 'Novato' | 'Intermedio' | 'RX';
    boxAfiliado?: string;
    nacionalidad?: string;
    ciudad?: string;
    onboardingStep?: number;
}

// ===== REGISTRO RÁPIDO (Solo 3 campos) =====
export const registerUserProfile = async (userData: QuickRegisterData) => {
    try {
        const response = await axios.post(`${API_URL}/api/users`, userData);
        return response.data;
    } catch (error) {
        console.error("Error al registrar perfil:", error);
        throw error;
    }
};

// ===== COMPLETAR PERFIL (Progresivo) =====
export const completeUserProfile = async (
    profileData: CompleteProfileData, 
    token: string
) => {
    try {
        const response = await axios.patch(
            `${API_URL}/api/users/complete-profile`,
            profileData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al completar perfil:", error);
        throw error;
    }
};

// ===== OBTENER MI PERFIL =====
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

// ===== ACTUALIZAR PERFIL COMPLETO =====
export const updateUserProfile = async (
    userId: string,
    userData: any,
    token: string
) => {
    try {
        const response = await axios.put(
            `${API_URL}/api/users/${userId}`,
            userData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        throw error;
    }
};