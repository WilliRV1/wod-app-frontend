import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { getCompetitionById, getPartnerFinder } from '../services/competition.service'; 
import { ProgressCircle } from "@chakra-ui/react"
import {
    Container, Heading, Text, Box, Alert, 
    Button, Tag, Stack, List, Card, Badge, Flex
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface Competition {
    buscando_parejas: partner[];
    _id: string;
    nombre: string;
    fecha: string;
    lugar: string;
    descripcion: string;
    categorias: string[];
    wods: string[];
    costo?: string;
    organizador?: { nombre: string }; 
    creador?: { nombre: string }; 
}

interface partner {
    _id: string;
    nombre: string;
    nivel: string;
}

function CompetitionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { currentUser } = useAuth();

    const [competition, setCompetition] = useState<Competition | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joiningPartner, setJoiningPartner] = useState(false);

    useEffect(() => {
        if (!id) {
            setError("No se proporcionó un ID de competencia.");
            setLoading(false);
            return;
        }

        const loadCompetition = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getCompetitionById(id);
                setCompetition(data.competition);
            } catch (err) {
                setError('Error al cargar la competencia.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadCompetition();
    }, [id]);

    const handleJoinPartnerFinder = async () => {
        if (!currentUser) {
            toast.error("Debes iniciar sesión");
            return;
        }
        
        if (!id) return;

        try {
            setJoiningPartner(true);
            const token = await currentUser.getIdToken();
            const data = await getPartnerFinder(id, token);
            
            setCompetition(data.competition); 
            toast.success("¡Te has unido! Ahora apareces en la lista.");

        } catch (err) {
            toast.error("Error: No se pudo unir a la lista.");
            console.error(err);
        } finally {
            setJoiningPartner(false);
        }
    }

    // Loading State
    if (loading) {
        return (
            <Container centerContent py={20}>   
                <ProgressCircle.Root value={null} size="lg" colorPalette="green">
                    <ProgressCircle.Circle>
                        <ProgressCircle.Track />
                        <ProgressCircle.Range />
                    </ProgressCircle.Circle>
                </ProgressCircle.Root>
                <Text mt={4} color="gray.400" fontSize="lg">Cargando competencia...</Text>
            </Container>
        );
    }

    // Error State
    if (error) {
        return (
            <Container py={10}>
                <Alert.Root status="error" bg="red.900" borderColor="red.600" borderWidth="1px">
                    <Alert.Indicator />
                    <Alert.Title color="white">{error}</Alert.Title>
                </Alert.Root>
            </Container>
        );
    }

    // Not Found State
    if (!competition) {
        return (
            <Container py={10}>
                <Alert.Root status="warning" bg="yellow.900" borderColor="yellow.600" borderWidth="1px">
                    <Alert.Indicator />
                    <Alert.Title color="white">No se encontró la competencia.</Alert.Title>
                </Alert.Root>
            </Container>
        );
    }

    // Main Content
    return (
        <Container maxW="4xl" py={8}>
            <Stack gap={6}>
                {/* Hero Section */}
                <Box 
                    bg="gray.800" 
                    p={8} 
                    borderRadius="xl" 
                    borderWidth="1px" 
                    borderColor="gray.600"
                    bgGradient="linear(to-br, gray.800, gray.900)"
                >
                    <Heading 
                        as="h1" 
                        size="3xl" 
                        mb={4}
                        color="white"
                        textAlign="center"
                    >
                        {competition.nombre}
                    </Heading>

                    <Flex 
                        justify="center" 
                        align="center" 
                        gap={4} 
                        flexWrap="wrap"
                        color="gray.300"
                        fontSize="lg"
                    >
                        <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                            📅 {new Date(competition.fecha).toLocaleDateString('es-CO', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </Badge>
                        <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                            📍 {competition.lugar}
                        </Badge>
                    </Flex>

                    {(competition.organizador || competition.creador) && (
                        <Text 
                            fontSize="sm" 
                            color="gray.400" 
                            mt={4}
                            textAlign="center"
                        >
                            {competition.organizador 
                                ? `Organizado por: ${competition.organizador.nombre}` 
                                : `Evento de comunidad por: ${competition.creador?.nombre}`
                            }
                        </Text>
                    )}
                </Box>

                {/* Description */}
                <Card.Root bg="gray.800" borderColor="gray.600">
                    <Card.Header>
                        <Heading size="xl" color="green.400">📝 Descripción</Heading>
                    </Card.Header>
                    <Card.Body>
                        <Text color="gray.300" fontSize="md" lineHeight="1.8">
                            {competition.descripcion || "No hay descripción disponible."}
                        </Text>
                    </Card.Body>
                </Card.Root>

                {/* Categories */}
                <Card.Root bg="gray.800" borderColor="gray.600">
                    <Card.Header>
                        <Heading size="xl" color="green.400">🏆 Categorías</Heading>
                    </Card.Header>
                    <Card.Body>
                        <Flex wrap="wrap" gap={3}>
                            {competition.categorias.map((categoria) => (
                                <Tag.Root 
                                    key={categoria} 
                                    size="lg" 
                                    colorScheme="green"
                                >
                                    {categoria}
                                </Tag.Root>
                            ))}
                        </Flex>
                    </Card.Body>
                </Card.Root>

                {/* WODs */}
                <Card.Root bg="gray.800" borderColor="gray.600">
                    <Card.Header>
                        <Heading size="xl" color="green.400">💪 WODs</Heading>
                    </Card.Header>
                    <Card.Body>
                        <List.Root gap={3}>
                            {competition.wods.map((wod, index) => (
                                <List.Item 
                                    key={index}
                                    color="gray.300"
                                    fontSize="md"
                                    bg="gray.700"
                                    p={3}
                                    borderRadius="md"
                                >
                                    <Text>
                                        <Text as="span" color="green.400" fontWeight="bold">
                                            WOD {index + 1}:
                                        </Text>{' '}
                                        {wod}
                                    </Text>
                                </List.Item>
                            ))}
                        </List.Root>
                    </Card.Body>
                </Card.Root>

                {/* Partner Finder */}
                <Card.Root bg="gray.800" borderColor="gray.600">
                    <Card.Header>
                        <Heading size="xl" color="green.400">🤝 Partner Finder</Heading>
                    </Card.Header>
                    <Card.Body>
                        <Stack gap={4}>
                            <Text color="gray.300" fontSize="md">
                                ¿Buscas pareja para competir? ¡Únete a la lista y conecta con otros atletas!
                            </Text>

                            <Button 
                                onClick={handleJoinPartnerFinder} 
                                colorScheme="green" 
                                size="lg"
                                width={{ base: 'full', md: 'auto' }}
                                loading={joiningPartner}
                            >
                                🔥 ¡Unirme a la búsqueda!
                            </Button>

                            <Box mt={4}>
                                <Heading as="h3" size="lg" mb={3} color="gray.200">
                                    Atletas Buscando Pareja:
                                </Heading>
                                
                                {(!competition.buscando_parejas || competition.buscando_parejas.length === 0) ? (
                                    <Box 
                                        bg="gray.700" 
                                        p={6} 
                                        borderRadius="md" 
                                        textAlign="center"
                                        borderWidth="2px"
                                        borderStyle="dashed"
                                        borderColor="gray.600"
                                    >
                                        <Text color="gray.400" fontSize="md">
                                            Nadie se ha unido todavía. ¡Sé el primero! 🚀
                                        </Text>
                                    </Box>
                                ) : (
                                    <Stack gap={3}>
                                        {competition.buscando_parejas.map((atleta: partner) => (
                                            <Box 
                                                key={atleta._id} 
                                                bg="gray.700" 
                                                p={4} 
                                                borderRadius="md"
                                                borderWidth="1px"
                                                borderColor="gray.600"
                                                _hover={{ 
                                                    borderColor: 'green.400',
                                                    transform: 'translateX(4px)',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <Flex justify="space-between" align="center">
                                                    <Box>
                                                        <Text fontSize="lg" fontWeight="bold" color="white">
                                                            {atleta.nombre}
                                                        </Text>
                                                        {atleta.nivel && (
                                                            <Badge colorScheme="blue" mt={1}>
                                                                Nivel: {atleta.nivel}
                                                            </Badge>
                                                        )}
                                                    </Box>
                                                </Flex>
                                            </Box>
                                        ))}
                                    </Stack>
                                )}
                            </Box>
                        </Stack>
                    </Card.Body>
                </Card.Root>
            </Stack>
        </Container>
    );
}

export default CompetitionDetailPage;