import React, { useState, useEffect } from 'react'; // Added React import
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext'; // Removed: Will be mocked
// import { createCompetition } from '../services/competition.service'; // Assuming you have this service
// import { getMyBoxes } from '../services/box.service'; // Removed: Will be mocked
import {
    Container,
    Heading,
    Input,
    Button,
    VStack,
    Box,
    Text,
    Textarea,
    Stack, // Keep Stack for layout if needed
    Flex,
    // RadioGroup is no longer needed if using Buttons
} from '@chakra-ui/react';
import { Field } from "@chakra-ui/react";
import { NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import toast from 'react-hot-toast';

// --- MOCK FUNCTIONS ---

// Mock for createCompetition
const createCompetition = async (data: any, token: string) => {
    console.log("Mock createCompetition called with:", data, token);
    // Simulate API response
    await new Promise(resolve => setTimeout(resolve, 500));
    return { competition: { _id: 'mock-id-123', ...data } };
};

// Mock for AuthContext
const useAuth = () => {
    console.log("Mock useAuth called");
    // Simulate a logged-in user
    const currentUser = {
        getIdToken: async () => {
            console.log("Mock getIdToken called");
            await new Promise(resolve => setTimeout(resolve, 50));
            return 'mock-firebase-token-12345';
        },
        uid: 'mock-user-uid-abc'
        // Add other user properties if needed, e.g., email
    };

    // To test logged-out user, uncomment this line:
    // const currentUser = null;

    return { currentUser };
};

// Mock for Box interface
interface Box {
    _id: string;
    nombre: string;
}

// Mock for getMyBoxes service
const getMyBoxes = async (token: string): Promise<{ boxes: Box[] }> => {
    console.log("Mock getMyBoxes called with token:", token);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // --- Simulate a user having boxes ---
    return {
        boxes: [
            { _id: 'box-1', nombre: 'Mi Box Principal' },
            { _id: 'box-2', nombre: 'CrossFit del Valle' }
        ]
    };

    // --- To test user with NO boxes, uncomment this line: ---
    // return { boxes: [] };
};
// --- END MOCK FUNCTIONS ---


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
    const [loadingBoxes, setLoadingBoxes] = useState(true); // Start loading

    // Cargar los boxes del usuario al montar el componente
    useEffect(() => {
        const loadBoxes = async () => {
            if (!currentUser) {
                 setLoadingBoxes(false); // Stop loading if no user
                 setTipoCompetencia('comunitaria'); // Default if no user
                 return;
            }

            // setLoadingBoxes(true); // Already set initially
            try {
                const token = await currentUser.getIdToken();
                const response = await getMyBoxes(token);

                const userBoxes = response.boxes || [];
                setMyBoxes(userBoxes);

                if (userBoxes.length > 0) {
                    setSelectedBoxId(userBoxes[0]._id);
                    // Keep 'comunitaria' as default, let user choose 'oficial'
                } else {
                    // If no boxes, force comunitaria
                    setTipoCompetencia('comunitaria');
                }
            } catch (error) {
                console.error("Error al cargar boxes:", error);
                toast.error("No se pudieron cargar tus Boxes.");
                setTipoCompetencia('comunitaria'); // Default to comunitaria on error
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

        // Ensure a box is selected ONLY IF the type is 'oficial' AND there ARE boxes available
        if (tipoCompetencia === 'oficial' && myBoxes.length > 0 && !selectedBoxId) {
             toast.error("Debes seleccionar un box para competencias oficiales");
             return;
        }
        // Prevent submitting 'oficial' if no boxes exist (though button should be disabled)
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
                // Ensure split only happens if string is not empty
                categorias: formData.categorias ? formData.categorias.split(',').map(cat => cat.trim()).filter(cat => cat) : [],
                wods: formData.wods ? formData.wods.split(',').map(wod => wod.trim()).filter(wod => wod) : [],
                costo: formData.costo,
            };

            // Only add organizerBoxId if type is 'oficial' AND a box was actually selected
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
                     navigate('/'); // Fallback navigation
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

                            {/* --- Buttons for Competition Type --- */}
                            <Field.Root w="100%">
                                <Field.Label color="gray.300">Tipo de Competencia</Field.Label>
                                <Stack direction="row" gap={4} w="100%" mt={2}>
                                    <Button
                                        flex="1"
                                        variant={tipoCompetencia === 'comunitaria' ? 'solid' : 'outline'}
                                        colorScheme="green"
                                        bg={tipoCompetencia === 'comunitaria' ? 'green.500' : 'transparent'}
                                        color={tipoCompetencia === 'comunitaria' ? 'white' : 'green.300'}
                                        borderColor="green.500"
                                        onClick={() => setTipoCompetencia('comunitaria')}
                                        _hover={{
                                            bg: tipoCompetencia === 'comunitaria' ? 'green.600' : 'green.500',
                                            color: 'white'
                                        }}
                                        // FIX: Chakra Buttons use 'isDisabled'
                                        isDisabled={isLoading}
                                    >
                                         <Box textAlign="center">
                                             <Text fontWeight="semibold">Comunitaria</Text>
                                             <Text fontSize="xs" fontWeight="normal" color={tipoCompetencia === 'comunitaria' ? 'gray.200': 'gray.400'}>Evento personal</Text>
                                         </Box>
                                    </Button>
                                    <Button
                                        flex="1"
                                        variant={tipoCompetencia === 'oficial' ? 'solid' : 'outline'}
                                        colorScheme="green"
                                        bg={tipoCompetencia === 'oficial' ? 'green.500' : 'transparent'}
                                        color={tipoCompetencia === 'oficial' ? 'white' : 'green.300'}
                                        borderColor="green.500"
                                        onClick={() => !isOficialDisabled && setTipoCompetencia('oficial')}
                                        // FIX: Chakra Buttons use 'isDisabled'
                                        isDisabled={isOficialDisabled || isLoading}
                                        _hover={!isOficialDisabled ? { // Only apply hover if not disabled
                                            bg: tipoCompetencia === 'oficial' ? 'green.600' : 'green.500',
                                            color: 'white'
                                        }: {}}
                                        _disabled={{ // Styles for disabled state
                                            bg: 'gray.700',
                                            borderColor: 'gray.600',
                                            color: 'gray.500',
                                            opacity: 0.6,
                                            cursor: 'not-allowed',
                                        }}
                                    >
                                         <Box textAlign="center">
                                             <Text fontWeight="semibold">Oficial</Text>
                                             <Text fontSize="xs" fontWeight="normal" color={tipoCompetencia === 'oficial' ? 'gray.200': 'gray.400'}>En nombre de tu Box</Text>
                                         </Box>
                                    </Button>
                                </Stack>
                            </Field.Root>
                            {/* --- End Buttons --- */}


                            {tipoCompetencia === 'oficial' && myBoxes.length > 0 && (
                                <Field.Root w="100%">
                                    <Field.Label color="gray.300">Selecciona tu Box <Text as="span" color="red.500">*</Text></Field.Label>
                                    <NativeSelectRoot>
                                        {/* FIX: Use 'disabled' for the boolean prop on native elements */}
                                        <NativeSelectField
                                            value={selectedBoxId}
                                            onChange={(e) => setSelectedBoxId(e.target.value)}
                                            bg="gray.900"
                                            borderColor="gray.600"
                                            color="white"
                                            // FIX 1: 'disabled' takes the boolean
                                            disabled={loadingBoxes || isLoading}
                                            // FIX 2: '_disabled' takes the style object
                                            _disabled={{
                                                opacity: 0.6,
                                                cursor: 'not-allowed',
                                                bg: 'gray.700',
                                            }}
                                            placeholder={loadingBoxes ? "Cargando Boxes..." : myBoxes.length === 0 ? "No tienes boxes registrados" : "Selecciona un Box"}
                                            required // Make selection mandatory if 'oficial' is chosen
                                        >
                                            {/* Only map if there are boxes */}
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
                                    {/* Link to create box if needed */}
                                    {/* <Button size="sm" colorScheme="blue" onClick={() => navigate('/create-box')}>Crear mi Box</Button> */}
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
                                        required // HTML5 validation attribute
                                        // Style to make date picker icon visible in dark mode
                                        colorScheme='green' // Attempts to color the picker, may vary by browser
                                        css={{ // More direct CSS approach
                                            '&::-webkit-calendar-picker-indicator': {
                                                filter: 'invert(1)', // Makes the default icon whiteish
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
                                    onClick={() => navigate('/')} // Navigate to home or maybe back? navigate(-1)
                                    // FIX: Chakra Buttons use 'isDisabled'
                                    isDisabled={isLoading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    colorScheme="green"
                                    flex="1"
                                    isLoading={isLoading} // 'loading' is correct here, it implies disabled
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

