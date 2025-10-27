import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";
import { registerUserProfile } from '../services/user.service';
import {
    Box,
    Container,
    Heading,
    Input,
    Button,
    VStack,
    Text,
    Link,
    Card,
    Field,
    Flex
} from '@chakra-ui/react';
import { toast } from 'react-hot-toast';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await registerUserProfile({
                firebaseUid: user.uid,
                email: user.email || email,
                nombre: nombre,
                apellidos: apellidos,
                rol: 'atleta'
            });

            toast.success("¡Registro completo! Bienvenido.");
            navigate('/');

        } catch (error: any) {
            console.error("Error en Registro:", error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error('El correo electrónico ya está registrado.');
            } else if (error.code === 'auth/weak-password') {
                toast.error('La contraseña debe tener al menos 6 caracteres.');
            } else {
                toast.error('Error al registrar. Verifica tus datos.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('¡Bienvenido de nuevo!');
            navigate('/');

        } catch (firebaseError: any) {
            console.error("Error en Login:", firebaseError);
            if (firebaseError.code === 'auth/invalid-credential' || 
                firebaseError.code === 'auth/user-not-found' || 
                firebaseError.code === 'auth/wrong-password') {
                toast.error('Correo electrónico o contraseña incorrectos.');
            } else {
                toast.error('Error al iniciar sesión. Intenta de nuevo.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="md" py={10}>
            <Card.Root bg="gray.800" borderColor="gray.600" borderWidth="1px">
                <Card.Body p={8}>
                    <VStack gap={6} align="stretch">
                        {/* Header */}
                        <Box textAlign="center">
                            <Heading size="2xl" color="white" mb={2}>
                                {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
                            </Heading>
                            <Text color="gray.400">
                                {isRegistering 
                                    ? 'Únete a la comunidad WOD' 
                                    : 'Accede a tu cuenta'}
                            </Text>
                        </Box>

                        {/* Form */}
                        <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                            <VStack gap={4} align="stretch">
                                {isRegistering && (
                                    <>
                                        <Field.Root>
                                            <Field.Label color="gray.300">Nombre</Field.Label>
                                            <Input
                                                type="text"
                                                value={nombre}
                                                onChange={(e) => setNombre(e.target.value)}
                                                placeholder="Tu nombre"
                                                bg="gray.700"
                                                borderColor="gray.600"
                                                color="white"
                                                _placeholder={{ color: 'gray.500' }}
                                                _hover={{ borderColor: 'green.400' }}
                                                _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                                required
                                            />
                                        </Field.Root>

                                        <Field.Root>
                                            <Field.Label color="gray.300">Apellidos</Field.Label>
                                            <Input
                                                type="text"
                                                value={apellidos}
                                                onChange={(e) => setApellidos(e.target.value)}
                                                placeholder="Tus apellidos"
                                                bg="gray.700"
                                                borderColor="gray.600"
                                                color="white"
                                                _placeholder={{ color: 'gray.500' }}
                                                _hover={{ borderColor: 'green.400' }}
                                                _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                                required
                                            />
                                        </Field.Root>
                                    </>
                                )}

                                <Field.Root>
                                    <Field.Label color="gray.300">Email</Field.Label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                        bg="gray.700"
                                        borderColor="gray.600"
                                        color="white"
                                        _placeholder={{ color: 'gray.500' }}
                                        _hover={{ borderColor: 'green.400' }}
                                        _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                        required
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label color="gray.300">Contraseña</Field.Label>
                                    <Input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        bg="gray.700"
                                        borderColor="gray.600"
                                        color="white"
                                        _placeholder={{ color: 'gray.500' }}
                                        _hover={{ borderColor: 'green.400' }}
                                        _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px var(--chakra-colors-green-500)' }}
                                        required
                                    />
                                    {isRegistering && (
                                        <Field.HelperText color="gray.500" fontSize="sm">
                                            Mínimo 6 caracteres
                                        </Field.HelperText>
                                    )}
                                </Field.Root>

                                <Button
                                    type="submit"
                                    colorScheme="green"
                                    size="lg"
                                    width="full"
                                    loading={isLoading}
                                    mt={2}
                                >
                                    {isRegistering ? 'Registrarme' : 'Iniciar Sesión'}
                                </Button>
                            </VStack>
                        </form>

                        {/* Toggle Register/Login */}
                        <Flex justify="center" align="center" gap={2}>
                            <Text color="gray.400" fontSize="sm">
                                {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                            </Text>
                            <Link
                                color="green.400"
                                fontWeight="semibold"
                                fontSize="sm"
                                onClick={() => {
                                    setIsRegistering(!isRegistering);
                                    setEmail('');
                                    setPassword('');
                                    setNombre('');
                                    setApellidos('');
                                }}
                                _hover={{ color: 'green.300', textDecoration: 'underline' }}
                            >
                                {isRegistering ? 'Inicia Sesión' : 'Regístrate'}
                            </Link>
                        </Flex>
                    </VStack>
                </Card.Body>
            </Card.Root>
        </Container>
    );
}

export default LoginPage;