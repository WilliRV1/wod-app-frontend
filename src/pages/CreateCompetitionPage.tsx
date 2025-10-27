import { useState, useEffect } from 'react';
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
    RadioGroup,
    
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
    const [loadingBoxes, setLoadingBoxes] = useState(false);

    // Cargar los boxes del usuario al montar el componente
    useEffect(() => {
        const loadBoxes = async () => {
            if (!currentUser) return;
            
            setLoadingBoxes(true);
            try {
                const token = await currentUser.getIdToken();
                const response = await getMyBoxes(token);
                
                const userBoxes = response.boxes || [];
                setMyBoxes(userBoxes);
                
                if (userBoxes.length > 0) {
                    setSelectedBoxId(userBoxes[0]._id);
                }
            } catch (error) {
                console.error("Error al cargar boxes:", error);
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
            toast.error("Por favor completa los campos obligatorios");
            return;
        }

        if (tipoCompetencia === 'oficial' && !selectedBoxId) {
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
                categorias: formData.categorias.split(',').map(cat => cat.trim()).filter(cat => cat),
                wods: formData.wods.split(',').map(wod => wod.trim()).filter(wod => wod),
                costo: formData.costo,
            };

            if (tipoCompetencia === 'oficial') {
                competitionData.organizadorBoxId = selectedBoxId;
            }

            const response = await createCompetition(competitionData, token);
            
            toast.success("¡Competencia creada exitosamente!");
            
            setTimeout(() => {
                navigate(`/competitions/${response.competition._id}`);
            }, 1500);

        } catch (error: any) {
            console.error("Error al crear competencia:", error);
            toast.error(error.response?.data?.message || "Error al crear la competencia");
        } finally {
            setIsLoading(false);
        }
    };

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
                            bgGradient="to-r"
                            gradientFrom="green.300"
                            gradientTo="green.500"
                            bgClip="text"
                        >
                            Crear Competencia
                        </Heading>
                        <Text color="gray.400">
                            Organiza tu próximo evento de CrossFit
                        </Text>
                    </Box>

                    {myBoxes.length > 0 && (
                        <Field.Root>
                            <Field.Label color="gray.300">Tipo de Competencia</Field.Label>
                            <RadioGroup.Root
                                value={tipoCompetencia}
                                onValueChange={(e) => setTipoCompetencia(e.value as 'comunitaria' | 'oficial')}
                            >
                                <Flex gap={6}>
                                    <Radio value="comunitaria" colorScheme="green">
                                        <Box>
                                            <Text color="white" fontWeight="semibold">Comunitaria</Text>
                                            <Text color="gray.400" fontSize="xs">Evento personal</Text>
                                        </Box>
                                    </Radio>
                                    <Radio value="oficial" colorScheme="green">
                                        <Box>
                                            <Text color="white" fontWeight="semibold">Oficial</Text>
                                            <Text color="gray.400" fontSize="xs">En nombre de tu Box</Text>
                                        </Box>
                                    </Radio>
                                </Flex>
                            </RadioGroup.Root>
                        </Field.Root>
                    )}

                    {tipoCompetencia === 'oficial' && myBoxes.length > 0 && (
                        <Field.Root>
                            <Field.Label color="gray.300">Selecciona tu Box</Field.Label>
                            <NativeSelectRoot>
                                <NativeSelectField
                                    value={selectedBoxId}
                                    onChange={(e) => setSelectedBoxId(e.target.value)}
                                    bg="gray.900"
                                    borderColor="gray.600"
                                    color="white"
                                    disabled={loadingBoxes}
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
                                💡 Aún no tienes un box registrado. Puedes crear uno para organizar competencias oficiales.
                            </Text>
                            <Button 
                                size="sm" 
                                colorScheme="blue" 
                                onClick={() => navigate('/create-box')}
                            >
                                Crear mi Box
                            </Button>
                        </Box>
                    )}

                    <form onSubmit={handleSubmit}>
                        <VStack gap={5}>
                            <Field.Root required>
                                <Field.Label color="gray.300">
                                    Nombre de la Competencia *
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
                                />
                            </Field.Root>

                            <Stack direction={{ base: 'column', md: 'row' }} w="100%" gap={4}>
                                <Field.Root required flex="1">
                                    <Field.Label color="gray.300">Fecha *</Field.Label>
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
                                    />
                                </Field.Root>

                                <Field.Root required flex="1">
                                    <Field.Label color="gray.300">Lugar *</Field.Label>
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
                                    />
                                </Field.Root>
                            </Stack>

                            <Field.Root>
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

                            <Field.Root>
                                <Field.Label color="gray.300">Categorías</Field.Label>
                                <Field.HelperText color="gray.500" fontSize="sm">
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

                            <Field.Root>
                                <Field.Label color="gray.300">WODs</Field.Label>
                                <Field.HelperText color="gray.500" fontSize="sm">
                                    Separa los WODs con comas
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

                            <Field.Root>
                                <Field.Label color="gray.300">Costo de Inscripción</Field.Label>
                                <Input
                                    name="costo"
                                    value={formData.costo}
                                    onChange={handleChange}
                                    placeholder="Ej: $50.000 COP"
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