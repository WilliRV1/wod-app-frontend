import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const createBox = async (boxData: any, token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/boxes`,
      boxData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("Box creado:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear box:', error);
    throw error;
  }
};

export const getBoxes = async (token: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/boxes`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener boxes:', error);
    throw error;
  }
};

export const getMyBoxes = async (token: string) => {
    try {
        // Cambia la URL a la nueva ruta protegida
        const response = await axios.get(`${API_URL}/api/boxes/my/boxes`, {
            headers: {
                'Authorization': `Bearer ${token}` // Envía el token para autenticación
            }
        });
        console.log("Respuesta de getMyBoxes:", response.data); // Para depuración
        return response.data; // Debería devolver { boxes: [...] }
    } catch (error) {
        console.error("Error al obtener mis boxes:", error);
        // Podrías manejar diferentes tipos de error aquí si es necesario
        throw error;
    }
};