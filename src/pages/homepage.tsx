import { useState, useEffect } from 'react';
import { getAllCompetitions } from '../services/competition.service';
import CompetitionCard, { type Competition } from "../components/CompetitionCard";
import { VStack, Spinner, Text, Heading, Box } from '@chakra-ui/react'; // Import Box

function HomePage() {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const loadCompetitions = async () => {
      setIsLoading(true); // Ensure loading is true at the start
      setError(null); // Clear previous errors
      try {
        const data = await getAllCompetitions();
        console.log("Datos RECIBIDOS de la API:", data);

        if (data && Array.isArray(data.competitions)) {
          setCompetitions(data.competitions);
        } else {
          console.warn("La API devolvió datos, pero no en el formato esperado.");
          setCompetitions([]);
          setError("No se encontraron competiciones."); // Set error if format is wrong
        }

      } catch (err) {
        console.error("Error al cargar las competiciones:", err);
        setCompetitions([]);
        setError("Error al cargar las competiciones. Inténtalo más tarde."); // Set specific error message
      } finally {
        setIsLoading(false);
      }
    };

    loadCompetitions();
  }, []);

  // --- Renderizado Condicional ---

  if (isLoading) {
    return (
      <VStack justify="center" align="center" minHeight="80vh">
        {/* Correct Spinner usage */}
        <Spinner
          size="xl"
          color="green.400"
          // Removed thickness prop
        />
        <Text mt={4} color="gray.400">Cargando competiciones...</Text>
      </VStack>
    );
  }

  if (error) { // Display error message if loading failed
       return (
           <VStack justify="center" align="center" minHeight="80vh">
               <Heading size="md" color="red.400">Error</Heading>
               <Text color="gray.400">{error}</Text>
           </VStack>
       );
  }

  if (competitions.length === 0) { // Message if no competitions found (but no error)
    return (
      <VStack justify="center" align="center" minHeight="80vh">
        <Heading size="md" color="gray.400">No hay competiciones disponibles</Heading>
        <Text color="gray.500">Vuelve a revisar más tarde.</Text>
      </VStack>
    );
  }

  // Display competitions
  return (
    // Use Box for background and padding, VStack for stacking cards
    <Box w="100%" py={6}>
        {/* Corrected: Use 'gap' prop instead of 'spacing' */}
        <VStack align="stretch" gap={4}> 
          {competitions.map((comp) => (
            <CompetitionCard
              key={comp._id}
              competition={comp}
            />
          ))}
        </VStack>
    </Box>
  );
}

export default HomePage;
