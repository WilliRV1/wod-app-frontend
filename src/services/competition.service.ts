import axios from 'axios'; // Asegúrate de importar axios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getAllCompetitions = async () => {
  try {
    // 1. Llama a axios.get() con la URL del endpoint
    const response = await axios.get(`${API_URL}/competencias`);
    console.log("Intentando llamar a:", url);

 
    return response.data;
  } catch (error) {
    console.error('Error al obtener competencias:', error);
    throw error
  }
}

export const getCompetitionById = async ( id: string ) => {
  try{
    const response = await axios.get(`${API_URL}/competencias/${id}`)

    return response.data

  }catch (error){
    console.error (`Error al obtener competencia con id ${id}`, error)
    throw error
  }
}

export const getPartnerFinder = async (competitionId: string, token: string) => {
  try{
    const response = await axios.put(`${API_URL}/competencias/${competitionId}/join-partner`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    
    }
  );
    return response.data

  }catch (error){
    console.error ('Error al obtener la lista de partner finder')
  }
}
