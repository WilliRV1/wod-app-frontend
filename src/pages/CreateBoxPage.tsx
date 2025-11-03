import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createBox } from '../services/box.service'; // Ensure this service function exists and is imported
import {
    Container,
    Heading,
    Input,
    Button,
    VStack,
    Box,
    Text,
    // Remove FormControl import if present, ensure Field is imported below or correctly
} from '@chakra-ui/react';
// Correctly import Field component parts
import { Field } from "@chakra-ui/react";
import toast from 'react-hot-toast';

function CreateBoxPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            toast.error("Debes iniciar sesión para crear un Box");
            navigate('/login');
            return;
        }

        if (!nombre.trim()) {
            toast.error("El nombre del Box es obligatorio");
            return;
        }

        setIsLoading(true);

        try {
            const token = await currentUser.getIdToken();
            const boxData = {
                nombre: nombre.trim(),
                direccion: direccion.trim() || undefined // Send undefined if empty
            };

            await createBox(boxData, token);

            toast.success(`¡Box "${boxData.nombre}" creado exitosamente!`);

            // Optionally navigate somewhere else, e.g., a dashboard or back
            setTimeout(() => {
                 navigate('/'); // Navigate to home for now
            }, 1500);

        } catch (error: any) {
            console.error("Error al crear el Box:", error);
            toast.error(error.response?.data?.message || "Error al crear el Box");
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
                            bgGradient="linear(to-r, green.300, green.500)"
                            bgClip="text"
                        >
                            Crear Nuevo Box
                        </Heading>
                        <Text color="gray.400">
                            Registra tu espacio de entrenamiento
                        </Text>
                    </Box>

                    <form onSubmit={handleSubmit}>
                        <VStack gap={5}>
                            {/* Corrected: Use 'required' prop instead of 'isRequired' */}
                            <Field.Root w="100%" required>
                                <Field.Label color="gray.300">
                                    Nombre del Box <Text as="span" color="red.500">*</Text>
                                </Field.Label>
                                <Input
                                    name="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ej: CrossFit El Muro"
                                    bg="gray.900"
                                    borderColor="gray.600"
                                    _hover={{ borderColor: 'green.500' }}
                                    _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                    color="white"
                                    required // HTML5 validation also helps
                                />
                            </Field.Root>

                            <Field.Root w="100%">
                                <Field.Label color="gray.300">Dirección (Opcional)</Field.Label>
                                <Input
                                    name="direccion"
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                    placeholder="Ej: Calle 5 # 40-10, Cali"
                                    bg="gray.900"
                                    borderColor="gray.600"
                                    _hover={{ borderColor: 'green.500' }}
                                    _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                    color="white"
                                />
                            </Field.Root>

                            {/* Corrected: Use 'loading' prop instead of 'isLoading' */}
                            <Button
                                type="submit"
                                colorScheme="green"
                                size="lg"
                                width="100%"
                                mt={4}
                                loading={isLoading}
                                _hover={{
                                    transform: 'translateY(-2px)',
                                    shadow: 'lg'
                                }}
                                transition="all 0.2s"
                            >
                                Crear Box
                            </Button>
                             <Button
                                 type="button" // Important: Prevent form submission
                                 variant="outline"
                                 colorScheme="gray"
                                 width="100%"
                                 mt={2}
                                 onClick={() => navigate(-1)} // Go back to previous page
                                 disabled={isLoading} // Correct: use 'disabled'
                             >
                                 Cancelar
                             </Button>
                        </VStack>
                    </form>
                </VStack>
            </Box>
        </Container>
    );
}

export default CreateBoxPage;