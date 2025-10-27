// src/components/Navbar.tsx
import { Box, Flex, Button, Text, Spacer, Link } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

function Navbar() {
    const { currentUser, loadingAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("Usuario deslogueado");
            navigate('/login');
        } catch (error) {
            console.error("Error al hacer logout:", error);
        }
    };

    return (
        <Box
            as="nav"
            bg="gray.900"
            color="white"
            w="100%"
            position="fixed"
            top="0"
            zIndex="500"
            borderBottomWidth="1px"
            borderColor="gray.800"
            shadow="lg"
        >
            <Flex
                w="100%"
                maxW="container.md"
                mx="auto"
                px={5}
                py={4}
                alignItems="center"
            >
                {/* Logo/Brand */}
                <Link 
                    href="/" 
                    fontSize="2xl" 
                    fontWeight="bold"
                    color="white"
                    _hover={{ 
                        textDecoration: 'none',
                        color: 'green.400',
                        transform: 'scale(1.05)'
                    }}
                    transition="all 0.2s"
                    display="flex"
                    alignItems="center"
                    gap={2}
                >
                    <Box
                        as="span"
                        bgGradient="to-r"
                        gradientFrom="green.400"
                        gradientTo="green.600"
                        bgClip="text"
                        fontWeight="extrabold"
                    >
                        WOD
                    </Box>
                    <Box as="span" color="white">
                        APP
                    </Box>
                </Link>

                <Spacer />

                {/* Auth Section */}
                <Box>
                    {loadingAuth ? (
                        <Text fontSize="sm" color="gray.400">Cargando...</Text>
                    ) : currentUser ? (
                        <Flex alignItems="center" gap={3}>
                            {/* Crear Competencia Button */}
                            <Button
                                size="sm"
                                colorScheme="green"
                                display={{ base: 'none', md: 'flex' }}
                                onClick={() => {
                                    console.log("Navegando a /create-competition");
                                    navigate('/create-competition');
                                }}
                                _hover={{ 
                                    transform: 'translateY(-2px)',
                                    shadow: 'lg'
                                }}
                                transition="all 0.2s"
                            >
                                + Crear
                            </Button>

                            {/* Perfil Button */}
                            <Button
                                size="sm"
                                variant="outline"
                                colorScheme="gray"
                                color="gray.300"
                                borderColor="gray.600"
                                display={{ base: 'none', sm: 'flex' }}
                                _hover={{ 
                                    bg: 'gray.800',
                                    borderColor: 'green.500',
                                    color: 'white',
                                    transform: 'translateY(-2px)'
                                }}
                                transition="all 0.2s"
                            >
                                Perfil
                            </Button>

                            {/* Avatar/User Badge */}
                            <Flex 
                                alignItems="center" 
                                gap={2}
                                cursor="pointer"
                                p={2}
                                borderRadius="lg"
                                bg="gray.800"
                                borderWidth="1px"
                                borderColor="gray.700"
                                _hover={{ 
                                    bg: 'gray.750',
                                    borderColor: 'green.500'
                                }}
                                transition="all 0.2s"
                            >
                                {/* Avatar Circle */}
                                <Flex
                                    w="32px"
                                    h="32px"
                                    borderRadius="full"
                                    bg="green.500"
                                    alignItems="center"
                                    justifyContent="center"
                                    color="white"
                                    fontWeight="bold"
                                    fontSize="sm"
                                >
                                    {currentUser.email?.charAt(0).toUpperCase()}
                                </Flex>
                                
                                <Text 
                                    display={{ base: 'none', lg: 'block' }}
                                    fontSize="sm"
                                    color="gray.300"
                                >
                                    {currentUser.email?.split('@')[0]}
                                </Text>
                            </Flex>

                            {/* Logout Button */}
                            <Button
                                colorScheme="red"
                                size="sm"
                                onClick={handleLogout}
                                variant="outline"
                                color="red.400"
                                borderColor="red.500"
                                _hover={{ 
                                    bg: 'red.900',
                                    color: 'white',
                                    borderColor: 'red.400',
                                    transform: 'translateY(-2px)'
                                }}
                                transition="all 0.2s"
                            >
                                Salir
                            </Button>
                        </Flex>
                    ) : (
                        <Flex gap={3}>
                            <Button
                                size="sm"
                                onClick={() => navigate('/login')}
                                colorScheme="green"
                                variant="outline"
                                _hover={{ 
                                    bg: 'green.900',
                                    transform: 'translateY(-2px)'
                                }}
                                transition="all 0.2s"
                            >
                                Iniciar Sesión
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => navigate('/login')}
                                colorScheme="green"
                                display={{ base: 'none', sm: 'flex' }}
                                _hover={{ 
                                    transform: 'translateY(-2px)',
                                    shadow: 'lg'
                                }}
                                transition="all 0.2s"
                            >
                                Registrarse
                            </Button>
                        </Flex>
                    )}
                </Box>
            </Flex>
        </Box>
    );
}

export default Navbar;