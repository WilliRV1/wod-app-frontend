import { useState, useEffect } from 'react';
import { getAllCompetitions } from '../services/competition.service';
import CompetitionCard, { type Competition } from "../components/CompetitionCard";
import { 
    VStack, 
    Spinner, 
    Text, 
    Heading, 
    Box, 
    Container,
    Stack,
    Badge
} from '@chakra-ui/react';

function HomePage() {
    const [competitions, setCompetitions] = useState<Competition[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCompetitions = async () => {
            try {
                const data = await getAllCompetitions();
                console.log("Datos RECIBIDOS de la API:", data);

                if (data && Array.isArray(data.competitions)) {
                    setCompetitions(data.competitions);
                } else {
                    console.warn("La API devolvió datos en formato inesperado.");
                    setCompetitions([]);
                }
            } catch (error) {
                console.error("Error al cargar las competiciones:", error);
                setCompetitions([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadCompetitions();
    }, []);

    // Loading State
    if (isLoading) {
        return (
            <Container centerContent minHeight="80vh" display="flex" alignItems="center">
                <VStack gap={4}>
                    <Spinner 
                        size="xl" 
                        color="green.400" 
                        thickness="4px"
                    />
                    <Text color="gray.400" fontSize="lg">
                        Cargando competiciones...
                    </Text>
                </VStack>
            </Container>
        );
    }

    // Empty State
    if (competitions.length === 0) {
        return (
            <Container centerContent minHeight="80vh" display="flex" alignItems="center">
                <VStack gap={4} textAlign="center">
                    <Box fontSize="6xl">📅</Box>
                    <Heading size="xl" color="white">
                        No hay competiciones disponibles
                    </Heading>
                    <Text color="gray.400" fontSize="lg">
                        Las próximas competiciones aparecerán aquí pronto.
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                        Inténtalo de nuevo más tarde.
                    </Text>
                </VStack>
            </Container>
        );
    }

    // Main Content
    return (
        <Container maxW="4xl" py={8}>
            <Stack gap={6}>
                {/* Header Section */}
                <Box textAlign="center" mb={4}>
                    <Heading 
                        as="h1" 
                        size="3xl" 
                        color="white" 
                        mb={3}
                    >
                        Próximas Competiciones 🏆
                    </Heading>
                    <Text color="gray.400" fontSize="lg">
                        Encuentra y únete a las mejores competiciones de CrossFit
                    </Text>
                    <Badge 
                        colorScheme="green" 
                        fontSize="md" 
                        px={3} 
                        py={1} 
                        mt={3}
                        borderRadius="full"
                    >
                        {competitions.length} {competitions.length === 1 ? 'Competición' : 'Competiciones'} Disponibles
                    </Badge>
                </Box>

                {/* Competitions List */}
                <VStack align="stretch" gap={4}>
                    {competitions.map((comp) => (
                        <CompetitionCard 
                            key={comp._id}
                            competition={comp}
                        />
                    ))}
                </VStack>
            </Stack>
        </Container>
    );
}

export default HomePage;