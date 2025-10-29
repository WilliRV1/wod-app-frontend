import { Box, Flex, Button, Text, Spacer, Link } from "styled-system/jsx"; // Ensure this path is correct relative to tsconfig/vite config
import { Popover } from "@chakra-ui/popover";
import { Portal } from "@chakra-ui/portal";
import { useNavigate } from "react-router-dom";
// Assuming AuthContext.tsx is in src/contexts/
import { useAuth } from "../contexts/AuthContext";
// Assuming firebase.ts is in src/
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
    if (currentUser) {
      // Navigate using the firebase UID
      navigate(`/profile/${currentUser.uid}`);
    } else {
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
      zIndex="sticky" // Use semantic token or number like 500
      borderBottomWidth="1px"
      borderColor="gray.800"
      shadow="lg"
    >
      <Flex
        w="100%"
        maxW="container.md"
        mx="auto"
        px="5" // Use Panda tokens/values
        py="4" // Use Panda tokens/values
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
          gap="2" // Use Panda tokens/values
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
            <Flex alignItems="center" gap="3">
              {/* Crear Competencia Button */}
              <Button
                size="sm"
                // colorScheme="green" // Use direct styling with Panda
                bg="green.500"
                color="white"
                _hover={{ bg: "green.600" }}
                display={{ base: "none", md: "flex" }}
                onClick={() => navigate("/create-competition")}
                _hover={{ // Combined hover styles
                  transform: "translateY(-2px)",
                  shadow: "lg",
                  bg: "green.600" // Ensure hover bg is defined
                }}
                transition="all 0.2s"
              >
                + Crear
              </Button>

              {/* === POPOVER JSX === */}
              <Popover.Root positioning={{ placement: "bottom-end" }} >
                <Popover.Trigger>
                  {/* Trigger Element */}
                  <Flex
                    alignItems="center"
                    gap="2"
                    cursor="pointer"
                    p="2"
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
                    {/* Avatar Flex */}
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
                    {/* Email Text */}
                    <Text
                      display={{ base: "none", lg: "block" }}
                      fontSize="sm"
                      color="gray.300"
                    >
                      {currentUser.email?.split("@")[0]}
                    </Text>
                  </Flex>
                </Popover.Trigger>

                <Portal>
                  <Popover.Positioner>
                    {/* Popover Content Box */}
                    <Popover.Content
                      bg="gray.800"
                      borderColor="gray.700"
                      w="180px"
                      _focus={{ boxShadow: "none" }}
                      borderRadius="md"
                      boxShadow="lg"
                      borderWidth="1px"
                      mt="2" // Use Panda token/value
                    >
                      {/* Arrow */}
                      <Popover.Arrow bg="gray.800">
                         <Popover.ArrowTip />
                      </Popover.Arrow>
                      {/* Body */}
                      <Popover.Body p="2" display="flex" flexDir="column" gap="2">
                        {/* Buttons inside Popover */}
                        <Button
                          size="sm"
                          variant="ghost"
                          justifyContent="start"
                          w="full"
                          color="white" // Ensure text color in ghost
                          _hover={{ bg: "gray.700" }}
                          onClick={handleClickProfile}
                        >
                          Ver Perfil
                        </Button>
                         <Button
                            size="sm"
                            variant="ghost"
                            justifyContent="start"
                            w="full"
                            color="white"
                            _hover={{ bg: "gray.700" }}
                            onClick={() => navigate("/profile")} // Adjust navigation as needed
                          >
                            Competencias Creadas
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            justifyContent="start"
                            w="full"
                            color="white"
                            _hover={{ bg: "gray.700" }}
                             onClick={() => navigate("/settings")} // Adjust navigation as needed
                          >
                            Ajustes
                          </Button>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover.Positioner>
                </Portal>
              </Popover.Root>
              {/* === END POPOVER === */}


              {/* Logout Button */}
              <Button
                // colorScheme="red" // Use direct styling
                size="sm"
                onClick={handleLogout}
                variant="outline"
                color="red.400"
                borderColor="red.500"
                _hover={{
                  bg: "red.900", // Use color token
                  color: "white",
                  borderColor: "red.400", // Use color token
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              >
                Salir
              </Button>
            </Flex>
          ) : (
            // Logged Out State
            <Flex gap="3">
              <Button
                size="sm"
                onClick={() => navigate("/login")}
                // colorScheme="green"
                variant="outline"
                color="green.400" // Outline color
                borderColor="green.500" // Outline border
                _hover={{
                  bg: "green.900", // Use color token
                  transform: "translateY(-2px)",
                }}
                transition="all 0.2s"
              >
                Iniciar Sesión
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/login")} // Should this go to /register?
                // colorScheme="green"
                bg="green.500"
                color="white"
                _hover={{ bg: "green.600" }}
                display={{ base: "none", sm: "flex" }}
                _hover={{ // Combined hover
                  transform: "translateY(-2px)",
                  shadow: "lg",
                  bg: "green.600" // Ensure hover bg
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

