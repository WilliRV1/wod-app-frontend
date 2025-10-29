import {
  Box,
  Flex,
  Button,
  Text,
  Spacer,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  Portal
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";


function Navbar() {
  const { currentUser, loadingAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Usuario deslogueado");
      navigate("/login");
    } catch (error) {
      console.error("Error al hacer logout:", error);
    }
  };

    const handleClickProfile = () => {
    // Comprueba que currentUser no sea nulo
    if (currentUser) {
      // Usa currentUser.uid (el ID de Firebase) para navegar
      navigate(`/profile/${currentUser.uid}`);
    } else {
      // Si algo falla, redirige a login
      console.error("No se pudo encontrar el usuario para ir al perfil.");
      navigate("/login");
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
            textDecoration: "none",
            color: "green.400",
            transform: "scale(1.05)",
          }}
          transition="all 0.2s"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Box
            as="span"
            bgGradient="linear(to-r, green.400, green.600)"
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
            <Text fontSize="sm" color="gray.400">
              Cargando...
            </Text>
          ) : currentUser ? (
            <Flex alignItems="center" gap={3}>
              {/* Crear Competencia Button */}
              <Button
                size="sm"
                colorScheme="green"
                display={{ base: "none", md: "flex" }}
                onClick={() => navigate("/create-competition")}
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
                }}
                transition="all 0.2s"
              >
                + Crear
              </Button>

              {/* Avatar/User Popover */}
              <Popover.Root positioning={{ placement: "bottom-end" }}>
                    <Popover.Trigger>
                      {/* En v3, el 'asChild' no es necesario,
                          simplemente pones el elemento que dispara el Popover */}
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
                          bg: "gray.700",
                          borderColor: "green.500",
                        }}
                        transition="all 0.2s"
                      >
                        {/* ... tu Flex de avatar ... */}
                        <Flex
                          w="32px"
                          h="32px"
                          borderRadius="full"
                          bg="green.500"
                          // ...
                        >
                          {currentUser.email?.charAt(0).toUpperCase()}
                        </Flex>
                        {/* ... tu Text de email ... */}
                        <Text
                          display={{ base: "none", lg: "block" }}
                          // ...
                        >
                          {currentUser.email?.split("@")[0]}
                        </Text>
                      </Flex>
                    </Popover.Trigger>
                    
                    <Portal>
                      <Popover.Positioner>
                        <Popover.Content
                          bg="gray.800"
                          borderColor="gray.700"
                          w="180px"
                          _focus={{ boxShadow: "none" }}
                        >
                          <Popover.Arrow bg="gray.800" />
                          <Popover.Body display="flex" flexDir="column" gap={2}>
                            {/* ... tus botones ... */}
                            <Button
                              size="sm"
                              bg="gray.700"
                              color="white"
                              _hover={{ bg: "gray.600" }}
                              onClick={handleClickProfile}
                            >
                              Ver Perfil
                            </Button>
                            {/* ... etc ... */}
                          </Popover.Body>
                        </Popover.Content>
                      </Popover.Positioner>
                    </Portal>
                  </Popover.Root>

              {/* Logout Button */}
              <Button
                colorScheme="red"
                size="sm"
                onClick={handleLogout}
                variant="outline"
                color="red.400"
                borderColor="red.500"
                _hover={{
                  bg: "red.900",
                  color: "white",
                  borderColor: "red.400",
                  transform: "translateY(-2px)",
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
                onClick={() => navigate("/login")}
                colorScheme="green"
                variant="outline"
                _hover={{
                  bg: "green.900",
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              >
                Iniciar Sesión
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/login")}
                colorScheme="green"
                display={{ base: "none", sm: "flex" }}
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
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
