import React from 'react';
import { Box, Heading, Text, Stack, Icon, Flex, Link, LinkBox } from '@chakra-ui/react';



// --- (Fix 1) ---
// Exporta la interfaz para que HomePage pueda importarla
export interface Competition {
  _id: string;
  nombre: string;
  fecha: string;
  lugar: string;
}

interface CompetitionCardProps {
  competition: Competition;
}

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition }) => {
  const formattedDate = new Date(competition.fecha).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <LinkBox 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      p={4} 
      mb={4} 
      bg="gray.700" 
      borderColor="gray.600"
    >

    <Link href= {`/competitions/${competition._id}`} variant="underline" colorPalette="teal" >
    
   
      <Stack wordSpacing={2} textAlign="left" > 
        <Heading size="md" >{competition.nombre}</Heading>
        
        <Flex alignItems="initial">
          <Icon as={CalendarIcon} mr={2} color="green.300" /> 
          <Text fontSize="sm" color="gray.300">{formattedDate}</Text>
        </Flex>
        
        <Flex alignItems="initial">
          <Icon as={LocationIcon} mr={2} color="green.300" />
          <Text fontSize="sm" color="gray.300">{competition.lugar}</Text>
        </Flex>
      </Stack>
    </Link>
    </LinkBox>
  );
}

// --- Iconos Simples (Definidos aquí mismo) ---
const CalendarIcon = (props: any) => (
  <svg fill="currentColor" width="1em" height="1em" viewBox="0 0 20 20" {...props}>
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const LocationIcon = (props: any) => (
  <svg fill="currentColor" width="1em" height="1em" viewBox="0 0 20 20" {...props}>
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

export default CompetitionCard;