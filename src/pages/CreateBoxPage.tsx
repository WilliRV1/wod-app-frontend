import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createBox } from '../services/box.service';
import {
    Container,
    Heading,
    Input,
    Button,
    VStack,
    Box,
    Text,
    Textarea,
} from '@chakra-ui/react';
import { Field } from "@chakra-ui/react";
import toast from 'react-hot-toast';

function CreateBoxPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
    });
    
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!currentUser) {
            toast.error("Debes iniciar sesión");
            navigate('/login');
            return;
        }

        if (!formData.nombre) {
            toast.error("El nombre del Box es obligatorio");
            return;
        }

        setIsLoading(true);

        try {
            const token = await currentUser.getIdToken();
            
            const response = await createBox(formData, token);
            
            toast.success("¡Box creado exitosamente!");
            
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error: any) {
            console.error("Error al crear box:", error);
            const errorMessage = error.response?.data?.message || "Error al crear el box";
            toast.error(errorMessage);
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
                    {/* Header */}
                    <Box textAlign="center">
                        <Heading
                            size="2xl"
                            mb={2}
                            bgGradient="to-r"
                            gradientFrom="green.300"
                            gradientTo="green.500"
                            bgClip="text"
                        >
                            Crear Mi Box
                        </Heading>
                        <Text color="gray.400">
                            Registra tu box de CrossFit
                        </Text>
                    </Box>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <VStack gap={5}>
                            {/* Nombre del Box */}
                            <Field.Root required>
                                <Field.Label color="gray.300">
                                    Nombre del Box *
                                </Field.Label>
                                <Input
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Ej: CrossFit Cali"
                                    bg="gray.900"
                                    borderColor="gray.600"
                                    _hover={{ borderColor: 'green.500' }}
                                    _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                    color="white"
                                />
                            </Field.Root>

                            {/* Dirección */}
                            <Field.Root>
                                <Field.Label color="gray.300">Dirección</Field.Label>
                                <Textarea
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    placeholder="Dirección completa del box..."
                                    rows={3}
                                    bg="gray.900"
                                    borderColor="gray.600"
                                    _hover={{ borderColor: 'green.500' }}
                                    _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                    color="white"
                                />
                            </Field.Root>

                            {/* Información adicional */}
                            <Box 
                                w="100%" 
                                p={4} 
                                bg="blue.900" 
                                borderRadius="md" 
                                borderColor="blue.500" 
                                borderWidth="1px"
                            >
                                <Text color="blue.200" fontSize="sm">
                                    💡 Una vez creado tu box, podrás organizar competencias oficiales
                                    en nombre de tu box.
                                </Text>
                            </Box>

                            {/* Botones */}
                            <Box w="100%" display="flex" gap={4} mt={4}>
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
                                    Crear Box
                                </Button>
                            </Box>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Container>
    );
}

export default CreateBoxPage;