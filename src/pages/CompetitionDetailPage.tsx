// src/pages/CompetitionDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <-- ¡Este es el hook clave!
import { getCompetitionById } from '../services/competition.service'; // Importa la nueva función
import { ProgressCircle } from "@chakra-ui/react"
import {
    Container, Heading, Text, Box, Alert, 
    Tag, Stack, List, ListItem
} from '@chakra-ui/react';
import { Icon } from "@chakra-ui/react"
import { Flex } from '@chakra-ui/react';

// Interfaz para los datos (debería coincidir con tu modelo y respuesta de la API)
interface Competition {
    _id: string;
    nombre: string;
    fecha: string;
    lugar: string;
    descripcion: string;
    categorias: string[];
    wods: string[];
    costo?: string;
    organizador?: { nombre: string }; // 'organizador' es un objeto
    creador?: { nombre: string }; // 'creador' es un objeto
}

function CompetitionDetailPage() {
    // 1. Obtener el ID de la URL
    // Si tu ruta es "/competitions/:id", useParams devolverá { id: "valor-del-id" }
    const { id } = useParams<{ id: string }>();

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

    // --- Renderizado de los Detalles ---
    return (
        <Container py={6}>
            <Stack>
                {/* Título Principal */}
                <Heading as="h1" size="2xl" textAlign="center" mb={4}>{competition.nombre}</Heading>

                {/* Fecha y Lugar */}
                <Box bg="gray.700" p={4} borderRadius="md">
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

                {/* (Aquí podríamos añadir la lógica del "Partner Finder" más adelante) */}
            </Stack>
        </Container>
    );
}

export default CompetitionDetailPage;