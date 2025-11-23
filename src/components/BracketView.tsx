import { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Badge, Spinner } from '@chakra-ui/react';
import { io } from 'socket.io-client';
import axios from 'axios';

// Assuming backend is running on localhost:5000 or similar. 
// In production, this should be an env var.
const SOCKET_URL = 'http://localhost:5000';

interface Match {
    _id: string;
    ronda: number;
    participante1: { _id?: string; nombre: string; apellidos: string } | null;
    participante2: { _id?: string; nombre: string; apellidos: string } | null;
    resultado: {
        ganador: { _id?: string; nombre: string; apellidos: string } | null;
        tiempoParticipante1?: number;
        tiempoParticipante2?: number;
        repsParticipante1?: number;
        repsParticipante2?: number;
    };
    estado: string;
    nextMatchId: string | null;
}

interface BracketViewProps {
    battleId: string;
    category: string;
}

const BracketView = ({ battleId, category }: BracketViewProps) => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Map display names to database enum values
        const categoryMap: { [key: string]: string } = {
            'Intermedio Masculino': 'intermedio-male',
            'Intermedio Femenino': 'intermedio-female',
            'Scaled Masculino': 'scaled-male',
            'Scaled Femenino': 'scaled-female'
        };

        const dbCategory = categoryMap[category] || category;
        console.log(`BracketView: Fetching bracket for category: ${category} -> ${dbCategory}`);

        // 1. Load initial bracket data
        const fetchBracket = async () => {
            try {
                const response = await axios.get(`${SOCKET_URL}/api/competencias/bracket/${battleId}/${dbCategory}`);
                console.log(`BracketView: Received ${response.data.length} matches`);
                setMatches(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error loading bracket:", error);
                setLoading(false);
            }
        };

        fetchBracket();

        // 2. Connect to Socket.io
        const newSocket = io(SOCKET_URL);

        newSocket.on('connect', () => {
            console.log("Connected to socket server");
            newSocket.emit('join_battle', battleId);
        });

        newSocket.on('match_update', (updatedMatch: Match) => {
            console.log("Match update received:", updatedMatch);
            setMatches(prevMatches =>
                prevMatches.map(m => m._id === updatedMatch._id ? updatedMatch : m)
            );
        });

        return () => {
            newSocket.disconnect();
        };
    }, [battleId, category]);

    if (loading) {
        return <Spinner size="xl" color="green.500" />;
    }

    if (matches.length === 0) {
        return <Text color="gray.400">No se ha generado el bracket aún.</Text>;
    }

    // Group matches by round
    const rounds: { [key: number]: Match[] } = {};
    matches.forEach(m => {
        if (!rounds[m.ronda]) rounds[m.ronda] = [];
        rounds[m.ronda].push(m);
    });

    const roundNumbers = Object.keys(rounds).map(Number).sort((a, b) => a - b);

    return (
        <Box overflowX="auto" py={8}>
            <HStack align="center" gap={16} minW="max-content" justify="center">
                {roundNumbers.map(roundNum => {
                    // Calculate spacing multiplier for each round to create pyramid effect
                    const spacingMultiplier = Math.pow(2, roundNum - 1);
                    const matchGap = 8 * spacingMultiplier;

                    return (
                        <VStack key={roundNum} gap={matchGap} justify="center" minH="600px">
                            <Text color="green.400" fontWeight="bold" fontSize="lg">
                                Ronda {roundNum}
                            </Text>
                            <VStack gap={matchGap} justify="center" flex={1}>
                                {rounds[roundNum].map(match => (
                                    <Box
                                        key={match._id}
                                        bg="gray.800"
                                        p={4}
                                        borderRadius="md"
                                        border="1px solid"
                                        borderColor={match.estado === 'completado' ? 'green.500' : 'gray.600'}
                                        w="250px"
                                        position="relative"
                                        _after={match.nextMatchId ? {
                                            content: '""',
                                            position: 'absolute',
                                            right: '-32px',
                                            top: '50%',
                                            width: '32px',
                                            height: '2px',
                                            bg: 'gray.600'
                                        } : undefined}
                                    >
                                        <VStack align="stretch" gap={2}>
                                            <HStack justify="space-between">
                                                <Text color={match.participante1 ? "white" : "gray.500"} fontSize="sm" maxW="180px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                                    {match.participante1 ? `${match.participante1.nombre} ${match.participante1.apellidos}` : "TBD"}
                                                </Text>
                                                {match.resultado?.ganador && String(match.resultado.ganador) === String(match.participante1?._id || match.participante1) && (
                                                    <Badge colorScheme="green">WIN</Badge>
                                                )}
                                            </HStack>
                                            <Box h="1px" bg="gray.700" />
                                            <HStack justify="space-between">
                                                <Text color={match.participante2 ? "white" : "gray.500"} fontSize="sm" maxW="180px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                                                    {match.participante2 ? `${match.participante2.nombre} ${match.participante2.apellidos}` : "TBD"}
                                                </Text>
                                                {match.resultado?.ganador && String(match.resultado.ganador) === String(match.participante2?._id || match.participante2) && (
                                                    <Badge colorScheme="green">WIN</Badge>
                                                )}
                                            </HStack>
                                        </VStack>
                                    </Box>
                                ))}
                            </VStack>
                        </VStack>
                    );
                })}
            </HStack>
        </Box>
    );
};

export default BracketView;
