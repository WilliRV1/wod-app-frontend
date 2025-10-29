// pages/ProfilePage.tsx (CORREGIDO)

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Importa tu AuthContext
import {
  getUserProfile,
  registerUserProfile,
} from "../services/user.service"; // 👈 IMPORTANTE: Tu servicio de API

// --- IMPORTACIONES CORRECTAS DE CHAKRA V3 ---
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Center,
  Spinner,
  IconButton,
  Link,
  Divider, // 👈 Usa Divider
} from "styled-system/jsx"; // 👈 IMPORTANTE: Esta es la ruta
import { Avatar } from "@chakra-ui/avatar"; // 👈 Avatar viene de su propio paquete
import { toast } from "react-hot-toast";
import {
  FaInstagram,
  FaShareAlt,
  FaEdit,
  FaTimesCircle,
} from "react-icons/fa";

// --- INTERFACE (Ajustada a tu Modelo Mongoose) ---
interface UserData {
  _id?: string;
  firebaseUid: string;
  nombre: string;
  apellidos: string;
  email: string;
  nivel: "Novato" | "Intermedio" | "RX";
  boxAfiliado: string;
  competencias: string[]; // 👈 Tu modelo Mongoose usa 'competencias'
  pais: string;
  ciudad: string;
  mejorPodio: number;
  fotoUrl?: string;
}

// ===========================================
// --- COMPONENTE PRINCIPAL: ProfilePage ---
// ===========================================
const ProfilePage = () => {
  // --- HOOKS Y ESTADO ---
  const navigate = useNavigate();
  const { currentUser, loadingAuth } = useAuth(); // Obtenemos el usuario de Firebase Auth

  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Colores (esto parece venir de un custom hook, asumiendo que está bien)
  // const cardBg = useColorModeValue("white", "gray.800");
  // const textColor = useColorModeValue("gray.700", "gray.200");
  // const containerBg = useColorModeValue("gray.50", "gray.900");
  
  // Valores fijos para modo oscuro (simplificado)
  const cardBg = "gray.800";
  const textColor = "gray.200";
  const containerBg = "gray.900";


  // 5. CARGA DEL PERFIL DESDE TU API (MongoDB)
  useEffect(() => {
    // No hacer nada si el usuario de Firebase aún está cargando
    if (loadingAuth) {
      return;
    }

    // Si terminó de cargar y no hay usuario, redirigir
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // --- Función para cargar el perfil desde NUESTRO backend ---
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        // 1. Obtener el token de Firebase del usuario actual
        const token = await currentUser.getIdToken();

        // 2. Llamar a nuestro servicio (user.service.ts)
        const data = await getUserProfile(token);
        setUserProfile(data.user); // El endpoint devuelve { user: ... }
        
      } catch (error: any) {
        
        // 3. Si el error es 404 (Perfil no encontrado en MongoDB)
        if (error.response && error.response.status === 404) {
          console.warn("Perfil no encontrado en MongoDB, creando uno nuevo...");
          
          try {
            // Creamos el perfil usando el servicio de registro
            const newProfileData = {
              firebaseUid: currentUser.uid,
              email: currentUser.email || "no-email@error.com",
              nombre: "Usuario",
              apellidos: "Nuevo",
              rol: "atleta" as "atleta" | "dueño_box", // Tu servicio pide 'rol'
              nivel: "Novato",
              boxAfiliado: "",
            };
            
            const newData = await registerUserProfile(newProfileData);
            setUserProfile(newData.user); // Asumimos que también devuelve { user: ... }
            toast.success("¡Perfil creado!");

          } catch (createError) {
            console.error("Error CRÍTICO al crear perfil:", createError);
            toast.error("No se pudo crear tu perfil.");
            setUserProfile(null);
          }
        } else {
          // Otro tipo de error de red
          console.error("Error al cargar perfil desde API:", error);
          toast.error("Error de conexión al cargar perfil.");
          setUserProfile(null);
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
    
  }, [currentUser, loadingAuth, navigate]); // Dependencias

  // 6. ESTADOS DE CARGA Y ERROR
  if (loadingAuth || loadingProfile) {
    return (
      <Center h="100vh" bg={containerBg}>
        <VStack>
          <Spinner size="xl" color="green.500" />
          <Text color="gray.400">Cargando perfil...</Text>
        </VStack>
      </Center>
    );
  }

  if (!userProfile || !currentUser) {
    // Esto ahora significa que el perfil no se pudo cargar NI crear
    return (
      <Center h="100vh" bg={containerBg}>
        <VStack>
          <FaTimesCircle size={40} color="red" />
          <Text color={textColor} fontSize="xl" mt={4}>
            Error crítico al cargar el perfil.
          </Text>
          <Button colorScheme="green" onClick={() => navigate("/")} mt={4}>
            Ir a Inicio
          </Button>
        </VStack>
      </Center>
    );
  }

  // Helper de banderas (tu código)
  const getFlag = (country: string = "") => {
    switch (country.toLowerCase()) {
      case "colombia": return "🇨🇴";
      case "chile": return "🇨🇱";
      case "mexico": return "🇲🇽";
      default: return "🌎";
    }
  };

  // --- COMPONENTE PRINCIPAL ---
  return (
    <Box
      minH="100vh"
      bg={containerBg}
      pt="100px" // Espacio para la Navbar fija
      pb={10}
      px={{ base: 4, md: 8 }}
    >
      <VStack maxW="container.md" mx="auto" gap={6}> {/* Añadido gap */}
        {/* ======================================= */}
        {/* 1. CARD PRINCIPAL DEL PERFIL */}
        {/* ======================================= */}
        <Box
          w="100%"
          bg={cardBg}
          p={{ base: 6, md: 8 }}
          borderRadius="xl"
          shadow="2xl"
          border="1px solid"
          borderColor="gray.700"
        >
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            gap={6}
          >
            {/* Izquierda: Foto y Redes */}
            <VStack>
              <Avatar.Root
                size="xl"
                bg="green.500"
                color="white"
                border="4px solid"
                borderColor="green.500"
                boxShadow="xl"
              >
                <Avatar.Fallback>
                  {userProfile.nombre[0]}
                  {userProfile.apellidos[0]}
                </Avatar.Fallback>
                {userProfile.fotoUrl && (
                  <Avatar.Image src={userProfile.fotoUrl} />
                )}
              </Avatar.Root>

              <HStack>
                <Link href="https://www.instagram.com" isExternal>
                  <IconButton
                    aria-label="Instagram"
                    variant="ghost"
                    colorScheme="green" // Corregido: colorScheme
                    rounded="full"
                    icon={<FaInstagram />}
                  />
                </Link>
                <Link href="#" isExternal>
                  <IconButton
                    aria-label="Compartir"
                    variant="ghost"
                    colorScheme="green" // Corregido: colorScheme
                    rounded="full"
                    icon={<FaShareAlt />}
                  />
                </Link>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                ID: {currentUser.uid.substring(0, 8)}...
              </Text>
            </VStack>

            {/* Centro: Información Personal y Estadísticas */}
            <Flex direction="column" flex={1} minW="0" align={{ base: "center", md: "start" }}>
              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                color="white"
                mb={1}
                textAlign={{ base: "center", md: "left" }}
              >
                {userProfile.nombre} {userProfile.apellidos}
              </Heading>

              <Text fontSize="md" color="gray.400" mb={2}>
                {getFlag(userProfile.pais)} {userProfile.ciudad || "Sin ciudad"}
              </Text>

              <Text
                fontSize="sm"
                color="gray.400"
                mb={4}
                fontWeight="medium"
              >
                Box Afiliado: {userProfile.boxAfiliado || "Sin afiliar"}
              </Text>

              <HStack mb={4} gap={{ base: 4, md: 6 }}> {/* Añadido gap */}
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="green.400">
                    {userProfile.competencias?.length || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                    Competencias
                  </Text>
                </VStack>

                <Center height="40px">
                  <Divider orientation="vertical" borderColor="gray.600" />
                </Center>

                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="green.400">
                    {userProfile.mejorPodio === 999 || !userProfile.mejorPodio
                      ? "N/A"
                      : `${userProfile.mejorPodio}°`}
                  </Text>
                  <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                    Mejor Podio
                  </Text>
                </VStack>

                <Center height="40px">
                  <Divider orientation="vertical" borderColor="gray.600" />
                </Center>

                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="green.400">
                    {userProfile.nivel}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Nivel
                  </Text>
                </VStack>
              </HStack>

              <Button
                colorScheme="green"
                variant="outline"
                size="md"
                mt={{ base: 4, md: 0 }}
                onClick={() => navigate("/edit-profile")}
                _hover={{ bg: "green.900", transform: "translateY(-1px)" }}
                transition="all 0.2s"
                leftIcon={<FaEdit />} // Icono dentro del botón
                w={{ base: "100%", md: "auto" }} // Ancho completo en móvil
              >
                Editar Perfil
              </Button>
            </Flex>
          </Flex>
        </Box>

        {/* ======================================= */}
        {/* 2. HISTORIAL DE COMPETENCIAS */}
        {/* ======================================= */}
        <Box
          w="100%"
          bg={cardBg}
          p={{ base: 6, md: 8 }}
          borderRadius="xl"
          shadow="xl"
          border="1px solid"
          borderColor="gray.700"
        >
          <Heading size="lg" mb={6} color="white">
            Historial de competencias
          </Heading>

          <VStack align="stretch">
            {(userProfile.competencias?.length || 0) > 0 ? (
              // Aquí deberías mapear la lista de IDs para obtener los datos reales
              <HStack
                p={4}
                bg="gray.700"
                borderRadius="lg"
                alignItems="center"
                justifyContent="space-between"
                cursor="pointer"
                _hover={{ bg: "gray.600" }}
                transition="all 0.2s"
              >
                {/* ... (Tu JSX de competencia de ejemplo) ... */}
              </HStack>
            ) : (
              <Text color="gray.500" textAlign="center" py={4}>
                Aún no has participado en ninguna competencia.
              </Text>
            )}

            <Center py={4}>
              <Button
                variant="solid"
                colorScheme="green"
                size="sm"
                onClick={() => navigate("/")} // Navegar a la home por ahora
              >
                Ver todas las competencias
              </Button>
            </Center>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ProfilePage;