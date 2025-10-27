import React, { useState, useEffect } from 'react'; // Added React import
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import { createCompetition } from '../services/competition.service'; // Assuming you have this service
import { getMyBoxes } from '../services/box.service'; // Assuming you have this service
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
    // RadioGroup, // Removed RadioGroup import
} from '@chakra-ui/react';
import { Field } from "@chakra-ui/react";
import { NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import toast from 'react-hot-toast';

// --- MOCK FUNCTION ---
// Remove this or replace with your actual import when ready
const createCompetition = async (data: any, token: string) => {
    console.log("Mock createCompetition called with:", data, token);
    // Simulate API response
    await new Promise(resolve => setTimeout(resolve, 500));
    return { competition: { _id: 'mock-id-123', ...data } };
};
// --- END MOCK FUNCTION ---


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
    const [loadingBoxes, setLoadingBoxes] = useState(true); // Start loading boxes initially

    // Cargar los boxes del usuario al montar el componente
    useEffect(() => {
        const loadBoxes = async () => {
            if (!currentUser) {
                 setLoadingBoxes(false); // Stop loading if no user
                 setTipoCompetencia('comunitaria'); // Default for non-logged in (shouldn't happen if page is protected)
                return;
            }

            // No need to set setLoadingBoxes(true) here, already true by default

            try {
                const token = await currentUser.getIdToken();
                const response = await getMyBoxes(token);

                const userBoxes = response.boxes || [];
                setMyBoxes(userBoxes);

                if (userBoxes.length > 0) {
                    setSelectedBoxId(userBoxes[0]._id);
                    // Keep default 'comunitaria' or let user choose
                } else {
                    // If no boxes, force 'comunitaria'
                    setTipoCompetencia('comunitaria');
                }
            } catch (error) {
                console.error("Error al cargar boxes:", error);
                toast.error("No se pudieron cargar tus Boxes.");
                setTipoCompetencia('comunitaria'); // Default to comunitaria on error
            } finally {
                setLoadingBoxes(false); // Stop loading after attempt
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

        if (tipoCompetencia === 'oficial' && !selectedBoxId) {
             // This check might be redundant if the button is disabled, but good failsafe
            toast.error("Debes seleccionar un box para competencias oficiales");
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

            // Only add organizadorBoxId if the type is 'oficial' AND a box is selected
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
                    navigate('/'); // Navigate home as fallback
                }
            }, 1500);

        } catch (error: any) {
            console.error("Error al crear competencia:", error);
            toast.error(error.response?.data?.message || "Error al crear la competencia");
        } finally {
            setIsLoading(false);
        }
    };

    // Determine if the 'Oficial' option should be disabled
    const isOficialDisabled = myBoxes.length === 0;

    return (
        <Container maxW="container.md" py={10}>
            <Box
                bg="gray.800"
                borderColor="gray.700"
                borderWidth="1px"
                borderRadius="lg"
                p={8}
                shadow="xl"
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

                            {/* --- Selector de Tipo con Botones --- */}
                            <Field.Root w="100%">
                                <Field.Label color="gray.300">Tipo de Competencia</Field.Label>
                                <Stack direction="row" spacing={4} mt={1}>
                                    <Button
                                        variant={tipoCompetencia === 'comunitaria' ? 'solid' : 'outline'}
                                        bg={tipoCompetencia === 'comunitaria' ? 'green.500' : 'transparent'}
                                        color={tipoCompetencia === 'comunitaria' ? 'white' : 'green.300'}
                                        borderColor="green.500"
                                        colorScheme="green"
                                        onClick={() => setTipoCompetencia('comunitaria')}
                                        flex="1"
                                        _hover={{
                                            bg: tipoCompetencia === 'comunitaria' ? 'green.600' : 'green.500',
                                            color: 'white',
                                        }}
                                        isDisabled={isLoading} // Disable while submitting
                                    >
                                        <Box textAlign="center">
                                            <Text fontWeight="semibold">Comunitaria</Text>
                                            <Text fontSize="xs" color={tipoCompetencia === 'comunitaria' ? 'gray.200' : 'gray.400'}>Evento personal o de grupo</Text>
                                        </Box>
                                    </Button>
                                    <Button
                                        variant={tipoCompetencia === 'oficial' ? 'solid' : 'outline'}
                                        bg={tipoCompetencia === 'oficial' ? 'green.500' : 'transparent'}
                                        color={tipoCompetencia === 'oficial' ? 'white' : 'green.300'}
                                        borderColor="green.500"
                                        colorScheme="green"
                                        onClick={() => !isOficialDisabled && setTipoCompetencia('oficial')} // Only allow click if not disabled
                                        flex="1"
                                        isDisabled={isOficialDisabled || isLoading} // Disable if no boxes OR submitting
                                        _hover={!isOficialDisabled ? { // Only apply hover if not disabled
                                            bg: tipoCompetencia === 'oficial' ? 'green.600' : 'green.500',
                                            color: 'white',
                                        } : {}}
                                        _disabled={{ // Style for disabled state
                                            opacity: 0.5,
                                            cursor: 'not-allowed',
                                            borderColor: 'gray.600',
                                            color: 'gray.500',
                                            bg: 'transparent'
                                        }}
                                    >
                                       <Box textAlign="center">
                                            <Text fontWeight="semibold">Oficial</Text>
                                            <Text fontSize="xs" color={tipoCompetencia === 'oficial' ? 'gray.200' : 'gray.400'}>En nombre de tu Box</Text>
                                        </Box>
                                    </Button>
                                </Stack>
                            </Field.Root>
                            {/* --- Fin Selector de Tipo con Botones --- */}


                            {/* Show Box selector only if 'oficial' is selected AND user has boxes */}
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
                                            disabled={loadingBoxes || isLoading}
                                            placeholder={loadingBoxes ? "Cargando Boxes..." : "Selecciona un Box"}
                                            required // Make selection mandatory if 'oficial' is chosen
                                            _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
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
                                     p={4}
                                     bg="blue.900"
                                     borderRadius="md"
                                     borderColor="blue.500"
                                     borderWidth="1px"
                                 >
                                     <Text color="blue.200" fontSize="sm" mb={2}>
                                         💡 Para crear una competencia 'Oficial', primero debes registrar tu Box. Por ahora, solo puedes crear competencias 'Comunitarias'.
                                     </Text>
                                     {/* Removed button as per previous edit, keep if needed */}
                                     {/* <Button size="sm" colorScheme="blue" onClick={() => navigate('/create-box')}>Crear mi Box</Button> */}
                                 </Box>
                             )}

                            {/* --- Fields for Competition Details --- */}
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
                                    required // HTML5 validation attribute
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
                                        sx={{
                                            '&::-webkit-calendar-picker-indicator': {
                                                filter: 'invert(1)', // Make date picker icon visible
                                            },
                                        }}
                                        required // HTML5 validation attribute
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
                                        required // HTML5 validation attribute
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
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    colorScheme="green"
                                    flex="1"
                                    isLoading={isLoading}
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

