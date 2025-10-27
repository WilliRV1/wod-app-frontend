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
        // 1. CONTENEDOR EXTERIOR (FONDO NEGRO)
        <Box
            as="nav"
            bg="gray.800"
            color="white"
            w="100%"
            position="fixed"
            top="0"
            zIndex="500"
            py={3}
        >
            {/* 2. CONTENEDOR INTERIOR (CONTENIDO CENTRADO) */}
            <Flex
                w="100%"
                
                maxW="container.md" 
           
                mx="auto"           
                px={5} // El padding interno para que no se pegue a los bordes
                alignItems="center"
            >
                {/* Logo */}

                <Link href="/" fontSize="3xl" color={'white'}>
                WOD-APP
                </Link>                
                

                <Spacer />

                {/* Bloque de Autenticación */}
                <Box>
                    {loadingAuth ? (
                        <Text>Cargando...</Text>
                    ) : currentUser ? (
                        <Flex alignItems="center">
                            <Text mr={4} display={{ base: 'none', md: 'block' }}>
                                Hola, {currentUser.email}
                            </Text>
                            <Button colorScheme="red" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
                        </Flex>
                    ) : (
                        <Flex>
                            <Button size="sm" mr={2} onClick={ () =>  navigate ('/login')}> 
                                Login
                            </Button>
                            <Button size="sm" variant="outline" colorScheme="blue">
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