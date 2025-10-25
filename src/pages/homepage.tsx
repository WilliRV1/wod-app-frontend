import React, { useState, useEffect } from 'react'; // <-- Importa useState y useEffect
import { getAllCompetitions } from '../services/competition.service'; // <-- Importa tu servicio
import CompetitionCard from "../components/CompetitionCard";

import { Container, Box, } from '@mui/material'
import  Typography  from '@mui/material/Typography'

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
    return <Container sx={{ py: 4 }}><Typography>Cargando competencias... ⏳</Typography></Container>;
  }

  if (error) {
    return <Container sx={{ py: 4 }}><Typography color="error">{error} 😥</Typography></Container>;
  }

  return (
    // Container centra el contenido y añade padding
    <Container sx={{ py: 4 }}> {/* py es padding vertical */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
        Próximas Competencias 🏋️‍♀️
      </Typography>

      {competitions.length === 0 ? (
        <Typography sx={{ textAlign: 'center' }}>No hay competencias disponibles por ahora.</Typography>
      ) : (
        // Box actúa como un div, podemos usar flexbox para layout si quisiéramos
        <Box> 
          {competitions.map((comp) => (
            // Renderiza una tarjeta por cada competencia
            <CompetitionCard key={comp._id} competition={comp} /> 
          ))}
        </Box>
      )}
    </Container>
  );
}

export default HomePage;