import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getAllCompetitions = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/competencias`);
    console.log("Intentando llamar a:", response);
    return response.data;
  } catch (error) {
    console.error('Error al obtener competencias:', error);
    throw error;
  }
};

export const getCompetitionById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/competencias/${id}`);
    console.log("Intentando llamar a (detalle):", response);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener competencia con id ${id}`, error);
    throw error;
  }
};

export const getPartnerFinder = async (competitionId: string, token: string) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/competencias/${competitionId}/join-partner`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener la lista de partner finder', error);
    throw error;
  }
};

export const createCompetition = async (competitionData: any, token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/competencias`,
      competitionData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log("Competencia creada:", response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear competencia:', error);
    throw error;
  }
};