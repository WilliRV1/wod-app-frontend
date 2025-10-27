import { Box, Flex, Button, Text, Spacer } from '@chakra-ui/react';
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
            bg="gray.800"
            color="white"
            w="100%"
            position="fixed"
            top="0"
            zIndex="500"
            py={3}
            borderBottom="1px solid"
            borderColor="gray.700"
        >
            <Flex
                w="100%"
                maxW="container.lg" 
                mx="auto"           
                px={5}
                alignItems="center"
            >
                {/* Logo */}
                <Text 
                    fontSize="2xl" 
                    fontWeight="bold"
                    color="green.400"
                    cursor="pointer"
                    onClick={() => navigate('/')}
                    _hover={{ color: 'green.300' }}
                >
                    WOD-APP
                </Text>

                <Spacer />

                {/* Autenticación */}
                <Box>
                    {loadingAuth ? (
                        <Text>Cargando...</Text>
                    ) : currentUser ? (
                        <Flex alignItems="center" gap={4}>
                            <Text display={{ base: 'none', md: 'block' }}>
                                {currentUser.email}
                            </Text>
                            <Button 
                                colorPalette="red" 
                                size="sm" 
                                onClick={handleLogout}
                                bg="brand.primary" color="white" size="lg" borderRadius="full" _hover={{ bg: 'brand.primary/80' }}
                            >
                                Logout
                            </Button>
                        </Flex>
                    ) : (
                        <Flex gap={2}>
                            <Button 
                                size="sm" 
                                onClick={() => navigate('/login')}
                                colorPalette="green"
                                bg="brand.primary" color="white" size="lg" borderRadius="full" _hover={{ bg: 'brand.primary/80' }}
                            > 
                                Login
                            </Button>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                colorPalette="green"
                                bg="brand.primary" color="white" size="lg" borderRadius="full" _hover={{ bg: 'brand.primary/80' }}
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