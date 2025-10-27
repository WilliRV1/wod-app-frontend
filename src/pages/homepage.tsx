import React, { useState, useEffect } from 'react';
import { getAllCompetitions } from '../services/competition.service';

// --- (Fix 2) ---
// Importa el componente 'default' (CompetitionCard)
// y el tipo 'exportado' (Competition)
import CompetitionCard, { type Competition } from "../components/CompetitionCard";

// Importa los componentes de Chakra que necesitas para esta página
import { VStack, Spinner, Text, Heading } from '@chakra-ui/react';

function HomePage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  // Añade un estado de carga
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCompetitions = async () => {
      try {
        const data = await getAllCompetitions();
        
        // --- (Fix 3: El más importante) ---
        // Log para ver qué recibes REALMENTE
        console.log("Datos RECIBIDOS de la API:", data);

     
        if (data && Array.isArray(data.competitions)) {
          // Asignamos el array INTERNO (que tiene 2 elementos) al estado
          setCompetitions(data.competitions);
        } else {
          // Si 'data' es null o 'data.competitions' no existe
          console.warn("La API devolvió datos, pero no en el formato esperado.");
          setCompetitions([]); 
        }

      } catch (error) {
        console.error("Error al cargar las competiciones:", error);
        setCompetitions([]); // <-- Asegura que sea un array en caso de error
      } finally {
        // Quita la carga al terminar (con éxito o error)
        setIsLoading(false);
      }
    };

    loadCompetitions();
  }, []); // El array vacío [] asegura que se ejecute solo una vez

  // --- Lógica de Renderizado ---

  // 1. Muestra Spinner mientras carga
  if (isLoading) {
    return (
      <VStack justify="center" align="center" minHeight="80vh">
        <Spinner size="xl" />
        <Text>Cargando competiciones...</Text>
      </VStack>
    );
  }

  // 2. Muestra mensaje si, después de cargar, no hay nada
  if (competitions.length === 0) {
    return (
      <VStack justify="center" align="center" minHeight="80vh">
        <Heading size="md">No hay competiciones disponibles</Heading>
        <Text>Inténtalo de nuevo más tarde.</Text>
      </VStack>
    );
  }

  // 3. Muestra los datos si todo salió bien
  return (
    <VStack align="stretch" p={4}>
      {competitions.map((comp) => (
        <CompetitionCard 
          key={comp._id}
          competition={comp} // <-- ¡Pasando la prop!
        />
      ))}
    </VStack>
  );
}

export default HomePage;