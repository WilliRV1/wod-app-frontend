import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createCompetition } from '../services/competition.service';
import { getMyBoxes } from '../services/box.service';
import {
    Container,
    Heading,
    Input,
    Button,
    VStack,
    Box,
    Text,
    Textarea,
    Stack,
    Flex,
} from '@chakra-ui/react';
import { Field } from "@chakra-ui/react";
import { NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import toast from 'react-hot-toast';

interface Box {
    _id: string;
    nombre: string;
}

function CreateCompetitionPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [formData, setFormData] = useState({
        nombre: '',
        fecha: '',
        lugar: '',
        descripcion: '',
        categorias: '',
        wods: '',
        costo: '',
    });

    const [tipoCompetencia, setTipoCompetencia] = useState<'comunitaria' | 'oficial'>('comunitaria');
    const [selectedBoxId, setSelectedBoxId] = useState<string>('');
    const [myBoxes, setMyBoxes] = useState<Box[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingBoxes, setLoadingBoxes] = useState(true);

    useEffect(() => {
        const loadBoxes = async () => {
            if (!currentUser) {
                 setLoadingBoxes(false);
                 setTipoCompetencia('comunitaria');
                 return;
            }

            try {
                const token = await currentUser.getIdToken();
                const response = await getMyBoxes(token);

                const userBoxes = response.boxes || [];
                setMyBoxes(userBoxes);

                if (userBoxes.length > 0) {
                    setSelectedBoxId(userBoxes[0]._id);
                } else {
                    setTipoCompetencia('comunitaria');
                }
            } catch (error) {
                console.error("Error al cargar boxes:", error);
                toast.error("No se pudieron cargar tus Boxes.");
                setTipoCompetencia('comunitaria');
            } finally {
                setLoadingBoxes(false);
            }
        };

        loadBoxes();
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            toast.error("Debes iniciar sesión para crear una competencia");
            navigate('/login');
            return;
        }

        if (!formData.nombre || !formData.fecha || !formData.lugar) {
            toast.error("Por favor completa los campos obligatorios (Nombre, Fecha, Lugar)");
            return;
        }

        if (tipoCompetencia === 'oficial' && myBoxes.length > 0 && !selectedBoxId) {
             toast.error("Debes seleccionar un box para competencias oficiales");
             return;
        }
        
        if (tipoCompetencia === 'oficial' && myBoxes.length === 0) {
            toast.error("No tienes Boxes registrados para crear una competencia oficial.");
            return;
        }

        setIsLoading(true);

        try {
            const token = await currentUser.getIdToken();

            const competitionData: any = {
                nombre: formData.nombre,
                fecha: formData.fecha,
                lugar: formData.lugar,
                descripcion: formData.descripcion,
                categorias: formData.categorias ? formData.categorias.split(',').map(cat => cat.trim()).filter(cat => cat) : [],
                wods: formData.wods ? formData.wods.split(',').map(wod => wod.trim()).filter(wod => wod) : [],
                costo: formData.costo,
            };

            if (tipoCompetencia === 'oficial' && selectedBoxId) {
                competitionData.organizadorBoxId = selectedBoxId;
            }

            const response = await createCompetition(competitionData, token);

            toast.success("¡Competencia creada exitosamente!");

            setTimeout(() => {
                 if (response?.competition?._id) {
                     navigate(`/competitions/${response.competition._id}`);
                 } else {
                     console.error("ID de competencia no encontrado en la respuesta:", response);
                     navigate('/');
                 }
            }, 1500);

        } catch (error: any) {
            console.error("Error al crear competencia:", error);
            toast.error(error.response?.data?.message || "Error al crear la competencia");
        } finally {
            setIsLoading(false);
        }
    };

    const isOficialDisabled = myBoxes.length === 0;

    return (
        <Container maxW="container.md" py={10}>
            <Box
                bg="gray.800"
                borderColor="gray.700"
                borderWidth="1px"
                borderRadius="xl"
                p={8}
                shadow="2xl"
                bgGradient="linear(to-br, gray.800, gray.900)"
            >
                <VStack gap={6} align="stretch">
                    <Box textAlign="center">
                        <Heading
                            size="2xl"
                            mb={2}
                            bgGradient="linear(to-r, green.300, green.500)"
                            bgClip="text"
                        >
                            Crear Competencia
                        </Heading>
                        <Text color="gray.400">
                            Organiza tu próximo evento de CrossFit
                        </Text>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <VStack gap={5}>

                            {/* --- Buttons for Competition Type --- */}
                            <Field.Root w="100%">
                                <Field.Label color="gray.300" fontSize="md" fontWeight="semibold" mb={3}>
                                    Tipo de Competencia
                                </Field.Label>
                                <Stack direction="row" gap={4} w="100%">
                                    <Button
                                        flex="1"
                                        variant={tipoCompetencia === 'comunitaria' ? 'solid' : 'outline'}
                                        colorScheme="green"
                                        size="lg"
                                        h="auto"
                                        py={4}
                                        bg={tipoCompetencia === 'comunitaria' ? 'green.500' : 'transparent'}
                                        color={tipoCompetencia === 'comunitaria' ? 'white' : 'gray.300'}
                                        borderColor={tipoCompetencia === 'comunitaria' ? 'green.500' : 'gray.600'}
                                        borderWidth="2px"
                                        onClick={() => setTipoCompetencia('comunitaria')}
                                        _hover={{
                                            bg: tipoCompetencia === 'comunitaria' ? 'green.600' : 'gray.750',
                                            borderColor: 'green.500',
                                            color: 'white',
                                            transform: 'translateY(-2px)',
                                            shadow: 'lg'
                                        }}
                                        transition="all 0.2s"
                                        isDisabled={isLoading}
                                    >
                                         <VStack gap={1}>
                                              <Text fontWeight="bold" fontSize="md">👤 Comunitaria</Text>
                                              <Text fontSize="xs" fontWeight="normal" opacity={0.8}>
                                                  Evento personal
                                              </Text>
                                         </VStack>
                                    </Button>
                                    <Button
                                        flex="1"
                                        variant={tipoCompetencia === 'oficial' ? 'solid' : 'outline'}
                                        colorScheme="green"
                                        size="lg"
                                        h="auto"
                                        py={4}
                                        bg={tipoCompetencia === 'oficial' ? 'green.500' : 'transparent'}
                                        color={tipoCompetencia === 'oficial' ? 'white' : 'gray.300'}
                                        borderColor={tipoCompetencia === 'oficial' ? 'green.500' : 'gray.600'}
                                        borderWidth="2px"
                                        onClick={() => !isOficialDisabled && setTipoCompetencia('oficial')}
                                        isDisabled={isOficialDisabled || isLoading}
                                        _hover={!isOficialDisabled ? {
                                            bg: tipoCompetencia === 'oficial' ? 'green.600' : 'gray.750',
                                            borderColor: 'green.500',
                                            color: 'white',
                                            transform: 'translateY(-2px)',
                                            shadow: 'lg'
                                        }: {}}
                                        transition="all 0.2s"
                                    >
                                         <VStack gap={1}>
                                              <Text fontWeight="bold" fontSize="md">🏢 Oficial</Text>
                                              <Text fontSize="xs" fontWeight="normal" opacity={0.8}>
                                                  En nombre de tu Box
                                              </Text>
                                         </VStack>
                                    </Button>
                                </Stack>
                            </Field.Root>
                            {/* --- End Buttons --- */}


                            {tipoCompetencia === 'oficial' && myBoxes.length > 0 && (
                                <Field.Root w="100%">
                                    <Field.Label color="gray.300">Selecciona tu Box <Text as="span" color="red.500">*</Text></Field.Label>
                                    <NativeSelectRoot>
                                        <NativeSelectField
                                            value={selectedBoxId}
                                            onChange={(e) => setSelectedBoxId(e.target.value)}
                                            bg="gray.900"
                                            borderColor="gray.600"
                                            color="white"
                                            _hover={{ borderColor: 'green.500' }}
                                            _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                            disabled={loadingBoxes || isLoading}
                                            required
                                        >
                                            {myBoxes.map((box) => (
                                                <option key={box._id} value={box._id}>
                                                    {box.nombre}
                                                </option>
                                            ))}
                                        </NativeSelectField>
                                    </NativeSelectRoot>
                                </Field.Root>
                            )}

                            {/* Message for users without boxes */}
                            {myBoxes.length === 0 && !loadingBoxes && (
                                <Box
                                    w="100%"
                                    p={5}
                                    bg="blue.900"
                                    borderRadius="lg"
                                    borderColor="blue.500"
                                    borderWidth="2px"
                                    bgGradient="linear(to-br, blue.900, blue.950)"
                                >
                                    <VStack align="start" gap={3}>
                                        <Flex align="center" gap={2}>
                                            <Text fontSize="2xl">💡</Text>
                                            <Text color="blue.200" fontSize="md" fontWeight="semibold">
                                                Información sobre Competencias Oficiales
                                            </Text>
                                        </Flex>
                                        <Text color="blue.100" fontSize="sm" lineHeight="1.6">
                                            Para crear una competencia 'Oficial', primero debes registrar tu Box. 
                                            Por ahora, solo puedes crear competencias 'Comunitarias' que serán visibles para todos los atletas.
                                        </Text>
                                        <Button 
                                            size="sm" 
                                            colorScheme="blue" 
                                            onClick={() => navigate('/create-box')}
                                            _hover={{
                                                transform: 'translateY(-2px)',
                                                shadow: 'md'
                                            }}
                                            transition="all 0.2s"
                                        >
                                            🏢 Crear mi Box
                                        </Button>
                                    </VStack>
                                </Box>
                            )}

                            <Field.Root w="100%">
                                <Field.Label color="gray.300">
                                    Nombre de la Competencia <Text as="span" color="red.500">*</Text>
                                </Field.Label>
                                <Input
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: Open WOD Challenge 2025"
                                    bg="gray.900"
                                    borderColor="gray.600"
                                    _hover={{ borderColor: 'green.500' }}
                                    _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                    color="white"
                                    required
                                />
                            </Field.Root>

                            <Stack direction={{ base: 'column', md: 'row' }} w="100%" gap={4}>
                                <Field.Root w="100%" flex="1">
                                    <Field.Label color="gray.300">Fecha <Text as="span" color="red.500">*</Text></Field.Label>
                                    <Input
                                        name="fecha"
                                        type="date"
                                        value={formData.fecha}
                                        onChange={handleChange}
                                        bg="gray.900"
                                        borderColor="gray.600"
                                        _hover={{ borderColor: 'green.500' }}
                                        _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                        color="white"
                                        required
                                        colorScheme='green'
                                        css={{
                                            '&::-webkit-calendar-picker-indicator': {
                                              filter: 'invert(1)',
                                              cursor: 'pointer'
                                            },
                                          }}
                                    />
                                </Field.Root>

                                <Field.Root w="100%" flex="1">
                                    <Field.Label color="gray.300">Lugar <Text as="span" color="red.500">*</Text></Field.Label>
                                    <Input
                                        name="lugar"
                                        value={formData.lugar}
                                        onChange={handleChange}
                                        placeholder="Ej: CrossFit Cali"
                                        bg="gray.900"
                                        borderColor="gray.600"
                                        _hover={{ borderColor: 'green.500' }}
                                        _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                        color="white"
                                        required
                                    />
                                </Field.Root>
                            </Stack>

                            <Field.Root w="100%">
                                <Field.Label color="gray.300">Descripción</Field.Label>
                                <Textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Describe tu competencia..."
                                    rows={4}
                                    bg="gray.900"
                                    borderColor="gray.600"
                                    _hover={{ borderColor: 'green.500' }}
                                    _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                    color="white"
                                />
                            </Field.Root>

                            <Field.Root w="100%">
                                <Field.Label color="gray.300">Categorías</Field.Label>
                                <Field.HelperText color="gray.500" fontSize="xs" mb={1}>
                                    Separa las categorías con comas (Ej: RX Male, RX Female, Scaled)
                                </Field.HelperText>
                                <Input
                                    name="categorias"
                                    value={formData.categorias}
                                    onChange={handleChange}
                                    placeholder="RX Male, RX Female, Scaled"
                                    bg="gray.900"
                                    borderColor="gray.600"
                                    _hover={{ borderColor: 'green.500' }}
                                    _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                    color="white"
                                />
                            </Field.Root>

                            <Field.Root w="100%">
                                <Field.Label color="gray.300">WODs</Field.Label>
                                <Field.HelperText color="gray.500" fontSize="xs" mb={1}>
                                    Separa los WODs o descripciones con comas
                                </Field.HelperText>
                                <Textarea
                                    name="wods"
                                    value={formData.wods}
                                    onChange={handleChange}
                                    placeholder="21-15-9 Thrusters y Pull-ups, AMRAP 10min: 5 Burpees..."
                                    rows={3}
                                    bg="gray.900"
                                    borderColor="gray.600"
                                    _hover={{ borderColor: 'green.500' }}
                                    _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                    color="white"
                                />
                            </Field.Root>

                            <Field.Root w="100%">
                                <Field.Label color="gray.300">Costo de Inscripción</Field.Label>
                                <Input
                                    name="costo"
                                    value={formData.costo}
                                    onChange={handleChange}
                                    placeholder="Ej: $50.000 COP o Gratuito"
                                    bg="gray.900"
                                    borderColor="gray.600"
                                    _hover={{ borderColor: 'green.500' }}
                                    _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                    color="white"
                                />
                            </Field.Root>

                            <Flex gap={4} w="100%" mt={4}>
                                <Button
                                    type="button"
                                    variant="outline"
                                    colorScheme="gray"
                                    flex="1"
                                    onClick={() => navigate('/')}
                                    disabled={isLoading}
                                    borderWidth="2px"
                                    _hover={{
                                        bg: 'gray.800',
                                        transform: 'translateY(-2px)',
                                        shadow: 'md'
                                    }}
                                    transition="all 0.2s"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    colorScheme="green"
                                    flex="1"
                                    loading={isLoading}
                                    _hover={{
                                        transform: 'translateY(-2px)',
                                        shadow: 'lg'
                                    }}
                                    transition="all 0.2s"
                                >
                                    Crear Competencia
                                </Button>
                            </Flex>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Container>
    );
}

export default CreateCompetitionPage;