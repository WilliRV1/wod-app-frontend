import React, { useState, useEffect } from 'react'; // <-- Importa useState y useEffect
import { getAllCompetitions } from '../services/competition.service'; // <-- Importa tu servicio

// Definimos un tipo para saber cómo se ve una competencia 
interface Competition {
  _id: string;
  nombre: string;
  fecha: string; 
  lugar: string;
 
}

function HomePage() {
  // 1. Estado para guardar las competencias
  const [competitions, setCompetitions] = useState<Competition[]>([]); // Empieza como un array vacío
  // Estado para saber si estamos cargando
  const [loading, setLoading] = useState<boolean>(true); 
  // Estado para manejar errores
  const [error, setError] = useState<string | null>(null); 

  // 2. Efecto secundario para llamar a la API cuando el componente se monta
  useEffect(() => {
    // Definimos una función async dentro del efecto
    const loadCompetitions = async () => {
      try {
        setLoading(true); // Empezamos a cargar
        setError(null); // Reseteamos errores
        const data = await getAllCompetitions(); // Llamamos al servicio
        setCompetitions(data.competitions); // Guardamos la lista en el estado
      } catch (err) {
        setError('Error al cargar las competencias.'); // Guardamos el error
        console.error(err); 
      } finally {
        setLoading(false); // Terminamos de cargar (con éxito o error)
      }
    };

    loadCompetitions(); // Ejecutamos la función
  }, []); // El array vacío [] significa: "ejecuta esto solo una vez al montar"

  // 3. Renderizado condicional basado en el estado
  if (loading) {
    return <div>Cargando competencias... ⏳</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error} 😥</div>;
  }

  return (
    <div>
      <h2>Próximas Competencias 🏋️‍♀️</h2>
      {competitions.length === 0 ? (
        <p>No hay competencias disponibles por ahora.</p>
      ) : (
        <ul>
          {/* Mapeamos el array de competencias para mostrar cada una */}
          {competitions.map((comp) => (
            <li key={comp._id}>
              <strong>{comp.nombre}</strong> - {new Date(comp.fecha).toLocaleDateString()} en {comp.lugar}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;