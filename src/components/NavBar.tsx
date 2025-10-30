  // src/components/NavBar.tsx
import { Box, Flex, Button, Text, Spacer, Portal, IconButton, VStack, HStack } from "@chakra-ui/react";
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow } from "@chakra-ui/react";
import { DrawerRoot, DrawerBackdrop, DrawerContent, DrawerHeader, DrawerBody, DrawerCloseTrigger } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useDisclosure } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

function Navbar() {
  const { currentUser, loadingAuth } = useAuth();
  const navigate = useNavigate();
  const { open: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();

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
      zIndex={1000}
      borderBottomWidth="1px"
      borderColor="gray.800"
      shadow="lg"
    >
      <Flex
        w="100%"
        maxW="container.xl"  // Match App container
        mx="auto"
        px={{ base: 4, md: 6, lg: 8 }}  // Responsive padding
        py={{ base: 3, md: 4 }}  // Responsive padding
        alignItems="center"
      >
        {/* Logo/Brand */}
        <a
          href="/"
          style={{
            fontSize: '1.25rem', // Responsive font size
            fontWeight: 'bold',
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Box
            as="span"
            style={{
              background: 'linear-gradient(to right, #48bb78, #38a169)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '800'
            }}
          >
            WOD
          </Box>
          <Box as="span" color="white">
            APP
          </Box>
        </a>

        <Spacer />

        {/* Auth Section */}
        <Box>
          {loadingAuth ? (
            <Text fontSize="sm" color="gray.400">
              Cargando...
            </Text>
          ) : currentUser ? (
            <Flex alignItems="center" gap={3}>
              {/* Desktop Menu - Hidden on mobile */}
              <HStack gap={6} display={{ base: 'none', lg: 'flex' }}>
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="green"
                  onClick={() => navigate("/")}
                >
                  Inicio
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="green"
                  onClick={() => navigate("/create-competition")}
                >
                  + Crear
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="green"
                  onClick={() => navigate(`/profile/${currentUser.uid}`)}
                >
                  Perfil
                </Button>
              </HStack>

              {/* Popover Menu - POSICIONAMIENTO PRECISO */}
              <PopoverRoot 
                lazyMount
                unmountOnExit
              > 
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    p={2}
                    bg="gray.800"
                    borderWidth="1px"
                    borderColor="gray.700"
                    _hover={{
                      bg: "gray.700",
                      borderColor: "green.500",
                    }}
                    transition="all 0.2s"
                  >
                    <Flex alignItems="center" gap={2}>
                      {/* Simple Avatar Circle */}
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
                        display={{ base: "none", md: "block" }}
                        fontSize="sm"
                        color="gray.300"
                      >
                        {currentUser.email?.split("@")[0]}
                      </Text>
                    </Flex>
                  </Button>
                </PopoverTrigger>
                
                <Portal>
                  <PopoverContent
                    bg="gray.800"
                    borderColor="gray.700"
                    w="200px"
                    borderRadius="md"
                    boxShadow="2xl"
                    borderWidth="1px"
                    zIndex={10000}
                    position="fixed"
                    // POSICIONAMIENTO CALCULADO PARA NAVBAR CENTRADO
                    top="55px"
                    right="20px" // Ajusta este valor hasta que quede perfecto// Ajusta 1200 según tu maxW
                  >
                    <PopoverArrow bg="gray.800" />
                    <PopoverBody p={3} display="flex" flexDir="column" gap={2}>
                      <Button
                        size="sm"
                        variant="ghost"
                        justifyContent="start"
                        w="full"
                        color="white"
                        _hover={{ bg: "gray.700" }}
                        onClick={handleClickProfile}
                      >
                        👤 Ver Perfil
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        justifyContent="start"
                        w="full"
                        color="white"
                        _hover={{ bg: "gray.700" }}
                        onClick={() => navigate("/my-competitions")}
                      >
                        🏆 Mis Competencias
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        justifyContent="start"
                        w="full"
                        color="white"
                        _hover={{ bg: "gray.700" }}
                        onClick={() => navigate("/notifications")}
                      >
                        🔔 Notificaciones
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        justifyContent="start"
                        w="full"
                        color="white"
                        _hover={{ bg: "gray.700" }}
                        onClick={() => navigate("/settings")}
                      >
                        ⚙️ Ajustes
                      </Button>
                      
                      {/* Divider visual usando Box */}
                      <Box h="1px" bg="gray.700" my={1} />
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        justifyContent="start"
                        w="full"
                        color="red.400"
                        _hover={{ bg: "red.900" }}
                        onClick={handleLogout}
                      >
                        🚪 Cerrar Sesión
                      </Button>
                    </PopoverBody>
                  </PopoverContent>
                </Portal>
              </PopoverRoot>

              {/* Mobile Menu Button */}
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onDrawerOpen}
                variant="ghost"
                aria-label="Open menu"
              >
                <HamburgerIcon />
              </IconButton>
            </Flex>
          ) : (
            // Logged Out State
            <Flex gap={3}>
              <Button
                size="sm"
                onClick={() => navigate("/login")}
                variant="outline"
                color="green.400"
                borderColor="green.500"
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
                bg="green.500"
                color="white"
                display={{ base: "none", sm: "flex" }}
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
                  bg: "green.600"
                }}
                transition="all 0.2s"
              >
                Registrarse
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>

      {/* Mobile Drawer */}
      <DrawerRoot open={isDrawerOpen} onOpenChange={onDrawerClose}>
        <DrawerBackdrop />
        <DrawerContent bg="gray.900">
          <DrawerHeader color="white" borderBottomWidth="1px" borderColor="gray.700">
            <Flex justify="space-between" align="center">
              <Text>Menú</Text>
              <DrawerCloseTrigger />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack gap={4} align="stretch">
              <Button variant="ghost" colorScheme="green" w="100%" onClick={() => { navigate("/"); onDrawerClose(); }}>
                🏠 Inicio
              </Button>
              <Button variant="ghost" colorScheme="green" w="100%" onClick={() => { navigate("/create-competition"); onDrawerClose(); }}>
                ➕ Crear Competencia
              </Button>
              <Button variant="ghost" colorScheme="green" w="100%" onClick={() => { navigate(`/profile/${currentUser?.uid}`); onDrawerClose(); }}>
                👤 Perfil
              </Button>
              <Button variant="ghost" colorScheme="green" w="100%" onClick={() => { navigate("/my-competitions"); onDrawerClose(); }}>
                🏆 Mis Competencias
              </Button>
              <Button variant="ghost" colorScheme="green" w="100%" onClick={() => { navigate("/notifications"); onDrawerClose(); }}>
                🔔 Notificaciones
              </Button>
              <Button variant="ghost" colorScheme="green" w="100%" onClick={() => { navigate("/settings"); onDrawerClose(); }}>
                ⚙️ Ajustes
              </Button>

              <Box h="1px" bg="gray.700" my={2} />

              <Button
                variant="ghost"
                color="red.400"
                w="100%"
                onClick={() => { handleLogout(); onDrawerClose(); }}
                _hover={{ bg: "red.900" }}
              >
                🚪 Cerrar Sesión
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </Box>
  );
}

export default Navbar;