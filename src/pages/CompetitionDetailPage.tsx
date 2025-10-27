import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { getCompetitionById, getPartnerFinder } from '../services/competition.service'; 
import { ProgressCircle } from "@chakra-ui/react"
import {
    Container, Heading, Text, Box, Alert, 
    Button, // <-- 1. AÑADE ESTA IMPORTACIÓN
    Tag, Stack, List, ListItem, 
     
} from '@chakra-ui/react';
import { Icon } from "@chakra-ui/react"
import { Flex } from '@chakra-ui/react';
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
    // 1. Obtener el ID de la URL

    const { id } = useParams<{ id: string }>();
    const {currentUser}= useAuth();



    // 2. Estados para guardar datos, carga y error
    const [competition, setCompetition] = useState<Competition | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 3. useEffect para buscar los datos cuando la página carga (o si el 'id' cambia)
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
                const data = await getCompetitionById(id); // Llama al servicio con el ID de la URL
                setCompetition(data.competition); // Asumiendo que tu API devuelve { competition: {...} }
            } catch (err) {
                setError('Error al cargar la competencia.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadCompetition();
    }, [id]); // Se vuelve a ejecutar si el 'id' cambia

    // --- Renderizado Condicional ---
    if (loading) {
        return (
            <Container centerContent py={10}>   
            <ProgressCircle.Root value={null} size="sm" color="green.300" >
                <ProgressCircle.Circle>
                    <ProgressCircle.Track />
                     <ProgressCircle.Range />
                </ProgressCircle.Circle>
            </ProgressCircle.Root>
                <Text mt={4}>Cargando competencia...</Text>
            </Container>
        );
    }

    if (error) {
        return (
            <Container py={10}>
                <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Title> {error} </Alert.Title>
                     
                </Alert.Root>
            </Container>
        );
    }

    if (!competition) {
        return (
            <Container py={10}>
                <Alert.Root status="warning">
                    <Alert.Indicator />
                    <Alert.Title> No se encontró la competencia. </Alert.Title>
                </Alert.Root>
            </Container>
        );
    }


    const handleJoinPartnerFinder = async () => {
        if (!currentUser) {
            toast.error("Debes iniciar sesión");
            return;
        }
        
        if (!id) return;

        try {
            const token = await currentUser.getIdToken(); // Obtiene el token de Firebase
            const data = await getPartnerFinder(id, token); // Llama al servicio
            
            // Actualiza el estado local con la respuesta del backend
            setCompetition(data.competition); 
            
            toast.success("¡Te has unido! Ahora apareces en la lista.");

        } catch (err) {
            toast.error("Error: No se pudo unir a la lista.");
            console.error(err);
        }
        }
    
    // --- Renderizado de los Detalles ---
    return (
        <Container py={6}>
            <Stack>
                {/* Título Principal */}
                <Heading as="h1" size="2xl" textAlign="center" mb={4}>{competition.nombre}</Heading>

                {/* Fecha y Lugar */}
                <Box bg="gray.800" p={4} borderRadius="md">
                    <Text fontSize="lg"><strong>Fecha:</strong> {new Date(competition.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                    <Text fontSize="lg"><strong>Lugar:</strong> {competition.lugar}</Text>
                    <Text fontSize="md" color="gray.400" mt={2}>
                        {/* Muestra quién lo organiza */}
                        {competition.organizador ? `Organizado por: ${competition.organizador.nombre}` : (competition.creador ? `Evento de comunidad por: ${competition.creador.nombre}` : '')}
                    </Text>
                </Box>

                {/* Descripción */}
                <Box>
                    <Heading as="h2" size="lg" mb={2}>Descripción</Heading>
                    <Text>{competition.descripcion || "No hay descripción disponible."}</Text>
                </Box>

                {/* Categorías */}
                <Box>
                    <Heading as="h2" size="lg" mb={2}>Categorías</Heading>
                    <Flex wrap="wrap">
                        {competition.categorias.map((categoria) => (
                            <Tag.Root key={categoria} size="lg" colorScheme="green" mr={2} mb={2}>{categoria}</Tag.Root>
                        ))}
                    </Flex>
                </Box>

                {/* WODs */}
                <Box>
                    <Heading as="h2" size="lg" mb={2}>WODs</Heading>
                    <Box as={"ul"} listStyleType="circle">
                        {competition.wods.map((wod, index) => (
                            <ListItem key={index}>
                                <Icon size="lg" color="green.500">
                                      <Icon name="check-circle" size="md" />
                                </Icon>
                                {wod}
                            </ListItem>
                        ))}
                    </Box>
                </Box>
                <Box>
                    <Heading as="h2" size="lg" mb={4}>Partner Finder</Heading>
                     <Button onClick={handleJoinPartnerFinder} colorScheme="green" size="lg">
                        ¡Unirme a la búsqueda!
                    </Button>

                    {/* La lista que muestra los resultados */}
                    <Heading as="h3" size="md" mb={3}>Atletas Buscando Pareja:</Heading>
                    {(!competition.buscando_parejas || competition.buscando_parejas.length === 0) ? (
                        <Text>Nadie se ha unido a la búsqueda todavía. ¡Sé el primero!</Text>
                    ) : (
                    <List.Root>
                        {competition.buscando_parejas.map((atleta: partner) => (
                            <List.Item key={atleta._id} bg="gray.800" p={3} borderRadius="md">
                                <Text fontSize="lg" fontWeight="bold">{atleta.nombre}</Text>
                                {atleta.nivel && (
                                    <Text fontSize="sm" color="gray.300">Nivel: {atleta.nivel}</Text>
                                     )}
                                    </List.Item>
                                ))}
                                </List.Root>
                            )}
                </Box>
                
            </Stack>
        </Container>
    );
}

export default CompetitionDetailPage;

