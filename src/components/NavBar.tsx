// src/components/NavBar.tsx
import { Box, Flex, Button, Text, Spacer, Portal, IconButton, VStack, HStack } from "@chakra-ui/react";
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow } from "@chakra-ui/react";
import { DrawerRoot, DrawerBackdrop, DrawerContent, DrawerHeader, DrawerBody, DrawerCloseTrigger } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useDisclosure } from "@chakra-ui/react";
import { HiMenu } from "react-icons/hi";
import { FaBolt, FaUser, FaSignOutAlt } from "react-icons/fa";

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
        maxW="container.xl"
        mx="auto"
        px={{ base: 4, md: 6, lg: 8 }}
        py={{ base: 3, md: 4 }}
        alignItems="center"
      >
        {/* Logo/Brand - WODMATCH BATTLE */}
        <Box
          cursor="pointer"
          onClick={() => navigate("/")}
          style={{
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
            <HStack gap={2}>
              <FaBolt size={24} color="#48bb78" />
              <Text fontSize="xl" fontWeight="black" color="white">
                WODMATCH
              </Text>
              <Text fontSize="xl" fontWeight="black" color="green.400">
                BATTLE
              </Text>
            </HStack>
          </Box>
        </Box>

        <Spacer />

        {/* Auth Section */}
        <Box>
          {loadingAuth ? (
            <Text fontSize="sm" color="gray.400">
              Cargando...
            </Text>
          ) : currentUser ? (
            <Flex alignItems="center" gap={3}>
              {/* Desktop Menu - Solo WODMATCH BATTLE */}
              <HStack gap={4} display={{ base: 'none', lg: 'flex' }}>
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="green"
                  borderColor="green.500"
                  color="green.400"
                  _hover={{
                    bg: "green.900",
                    transform: "translateY(-2px)"
                  }}
                  transition="all 0.2s"
                  onClick={() => navigate("/")}
                >
                  🥊 Inicio Battle
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  bg="green.500"
                  color="white"
                  _hover={{
                    transform: "translateY(-2px)",
                    shadow: "lg",
                    bg: "green.600"
                  }}
                  transition="all 0.2s"
                  onClick={() => navigate("/battle/register")}
                >
                  🎯 Registrarse
                </Button>
              </HStack>

              {/* Popover Menu - SIMPLIFICADO */}
              <PopoverRoot lazyMount unmountOnExit>
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
                    w="180px"
                    borderRadius="md"
                    boxShadow="2xl"
                    borderWidth="1px"
                    zIndex={10000}
                    position="fixed"
                    top="55px"
                    right="20px"
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
                        <HStack gap={2}>
                          <FaUser size={12} />
                          <Text>Mi Perfil</Text>
                        </HStack>
                      </Button>
                      
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
                        <HStack gap={2}>
                          <FaSignOutAlt size={12} />
                          <Text>Cerrar Sesión</Text>
                        </HStack>
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
                <HiMenu />
              </IconButton>
            </Flex>
          ) : (
            // Logged Out State - SIMPLIFICADO
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
                onClick={() => navigate("/battle/register")}
                bg="green.500"
                color="white"
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "lg",
                  bg: "green.600"
                }}
                transition="all 0.2s"
              >
                🥊 Registrarse
              </Button>
            </Flex>
          )}
        </Box>
      </Flex>

      {/* Mobile Drawer - SIMPLIFICADO */}
      <DrawerRoot open={isDrawerOpen} onOpenChange={onDrawerClose}>
        <DrawerBackdrop />
        <DrawerContent bg="gray.900">
          <DrawerHeader color="white" borderBottomWidth="1px" borderColor="gray.700">
            <Flex justify="space-between" align="center">
              <Text fontWeight="bold">WODMATCH BATTLE</Text>
              <DrawerCloseTrigger />
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <VStack gap={4} align="stretch">
              <Button 
                variant="ghost" 
                colorScheme="green" 
                w="100%" 
                onClick={() => { navigate("/"); onDrawerClose(); }}
              >
                🥊 Inicio Battle
              </Button>
              <Button 
                variant="ghost" 
                colorScheme="green" 
                w="100%" 
                onClick={() => { navigate("/battle/register"); onDrawerClose(); }}
              >
                🎯 Registrarse
              </Button>
              <Button 
                variant="ghost" 
                colorScheme="green" 
                w="100%" 
                onClick={() => { navigate(`/profile/${currentUser?.uid}`); onDrawerClose(); }}
              >
                👤 Mi Perfil
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