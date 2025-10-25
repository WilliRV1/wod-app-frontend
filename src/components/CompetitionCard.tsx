// src/components/CompetitionCard.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'; // Para espaciado y layout
import EventIcon from '@mui/icons-material/Event'; // Icono de calendario
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Icono de lugar

// Definimos el tipo para los datos de la competencia que esperamos recibir
// Asegúrate de que coincida con los datos que envía tu API
interface Competition {
  _id: string;
  nombre: string;
  fecha: string; // La recibimos como string desde la API
  lugar: string;
  // organizador?: { _id: string, nombre: string }; // Descomenta si tu API lo incluye
  // creador?: { _id: string, nombre: string }; // Descomenta si tu API lo incluye
}

// Definimos las props que recibirá nuestro componente
interface CompetitionCardProps {
  competition: Competition;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  // Formateamos la fecha para mostrarla mejor
  const formattedDate = new Date(competition.fecha).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric', //weekday: 'long'
  });

  return (
    // Usamos sx prop para estilos rápidos basados en el tema
    <Card sx={{ 
        mb: 2, // Margen inferior (marginBottom)
        bgcolor: 'background.paper', // Color de fondo del tema
        borderRadius: 2 // Bordes redondeados
    }}>
      <CardContent>
        {/* Nombre de la competencia */}
        <Typography variant="h5" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
          {competition.nombre}
        </Typography>

        {/* Fecha */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <EventIcon sx={{ mr: 1, color: 'primary.main' }} /> {/* Icono con color primario */}
          <Typography variant="body1" color="text.secondary">
            {formattedDate}
          </Typography>
        </Box>

        {/* Lugar */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} /> {/* Icono */}
            <Typography variant="body2" color="text.secondary">
             {competition.lugar}
            </Typography>
        </Box>

        {/* Podrías añadir más info aquí: descripción, categorías, organizador */}
        {/* {competition.organizador && (
            <Typography variant="caption" display="block" mt={1}>
                Organizado por: {competition.organizador.nombre}
            </Typography>
        )}
         {competition.creador && (
            <Typography variant="caption" display="block" mt={1}>
                Creado por: {competition.creador.nombre}
            </Typography>
        )} */}
      </CardContent>
      {/* Aquí podríamos añadir CardActions con botones (ej. "Ver Detalles", "Inscribirme") */}
    </Card>
  );
}

export default CompetitionCard;
