import axios from 'axios'; // Asegúrate de importar axios

export const getAllCompetitions = async () => {
  try {
    // 1. Llama a axios.get() con la URL del endpoint
    const response = await axios.get('http://localhost:5000/api/competencias');

 
    return response.data;
  } catch (error) {
    console.error('Error al obtener competencias:', error);
    throw error
  }
}
