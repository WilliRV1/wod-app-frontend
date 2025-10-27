import React from 'react';
import { Heading, Text, Stack, Icon, Flex, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  
  const formattedDate = new Date(competition.fecha).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const handleClick = () => {
    navigate(`/competitions/${competition._id}`);
  };

  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      p={5} 
      mb={4} 
      bg="gray.800" 
      borderColor="gray.700"
      cursor="pointer"
      onClick={handleClick}
      transition="all 0.3s"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'xl',
        borderColor: 'green.500',
        bg: 'gray.750'
      }}
    >
      <Stack gap={3} textAlign="left"> 
        <Heading 
          size="lg"
          color="white"
          _hover={{ color: 'green.400' }}
          transition="color 0.2s"
        >
          {competition.nombre}
        </Heading>
        
        <Flex alignItems="center" gap={2}>
          <Icon as={CalendarIcon} color="green.400" boxSize={4} /> 
          <Text fontSize="md" color="gray.300" fontWeight="medium">
            {formattedDate}
          </Text>
        </Flex>
        
        <Flex alignItems="center" gap={2}>
          <Icon as={LocationIcon} color="green.400" boxSize={4} />
          <Text fontSize="md" color="gray.300" fontWeight="medium">
            {competition.lugar}
          </Text>
        </Flex>
      </Stack>
    </Box>
  );
}

// --- Iconos Simples ---
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