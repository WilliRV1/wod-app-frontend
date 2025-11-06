// src/pages/ProfilePage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserProfile,
  registerUserProfile,
} from "../services/user.service";

// Imports correctos de Chakra UI v3
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Center,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import {
  FaInstagram,
  FaShareAlt,
  FaEdit,
  FaTimesCircle,
} from "react-icons/fa";

interface UserData {
  _id?: string;
  firebaseUid: string;
  nombre: string;
  apellidos: string;
  email: string;
  nivel: "Novato" | "Intermedio" | "RX";
  boxAfiliado: string;
  nacionalidad?: string;
  ciudad?: string;
  competencias: string[];
  mejorPodio: number;
  fotoUrl?: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, loadingAuth } = useAuth();

  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Colores para modo oscuro
  const cardBg = "gray.800";
  const textColor = "gray.200";
  const containerBg = "gray.900";

  useEffect(() => {
    if (loadingAuth) {
      return;
    }

    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const token = await currentUser.getIdToken();
        const data = await getUserProfile(token);
        setUserProfile(data.user);
        
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          console.warn("Perfil no encontrado en MongoDB, creando uno nuevo...");
          
          try {
            const newProfileData = {
              firebaseUid: currentUser.uid,
              email: currentUser.email || "no-email@error.com",
              nombre: "Usuario",
              apellidos: "Nuevo",
              rol: "atleta" as "atleta" | "dueño_box",
              nivel: "Novato",
              boxAfiliado: "",
            };
            
            const newData = await registerUserProfile(newProfileData);
            setUserProfile(newData.user);
            toast.success("¡Perfil creado!");

          } catch (createError) {
            console.error("Error CRÍTICO al crear perfil:", createError);
            toast.error("No se pudo crear tu perfil.");
            setUserProfile(null);
          }
        } else {
          console.error("Error al cargar perfil desde API:", error);
          toast.error("Error de conexión al cargar perfil.");
          setUserProfile(null);
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
    
  }, [currentUser, loadingAuth, navigate]);

  if (loadingAuth || loadingProfile) {
    return (
      <Center h="100vh" bg={containerBg}>
        <VStack gap={4}>
          <Spinner size="xl" color="green.500" />
          <Text color="gray.400">Cargando perfil...</Text>
        </VStack>
      </Center>
    );
  }

  if (!userProfile || !currentUser) {
    return (
      <Center h="100vh" bg={containerBg}>
        <VStack gap={4}>
          <Box color="red.500">
            <FaTimesCircle size={40} />
          </Box>
          <Text color={textColor} fontSize="xl">
            Error crítico al cargar el perfil.
          </Text>
          <Button colorScheme="green" onClick={() => navigate("/")}>
            Ir a Inicio
          </Button>
        </VStack>
      </Center>
    );
  }

  const getFlag = (country: string | null | undefined) => {
    if (!country) return "🌎";

    // Lista completa de países con banderas
    const PAISES = [
      { code: "Colombia", name: "Colombia", flag: "🇨🇴" },
      { code: "México", name: "México", flag: "🇲🇽" },
      { code: "Argentina", name: "Argentina", flag: "🇦🇷" },
      { code: "Chile", name: "Chile", flag: "🇨🇱" },
      { code: "Perú", name: "Perú", flag: "🇵🇪" },
      { code: "Ecuador", name: "Ecuador", flag: "🇪🇨" },
      { code: "Uruguay", name: "Uruguay", flag: "🇺🇾" },
      { code: "Paraguay", name: "Paraguay", flag: "🇵🇾" },
      { code: "Bolivia", name: "Bolivia", flag: "🇧🇴" },
      { code: "Venezuela", name: "Venezuela", flag: "🇻🇪" },
      { code: "Panamá", name: "Panamá", flag: "🇵🇦" },
      { code: "Costa Rica", name: "Costa Rica", flag: "🇨🇷" },
      { code: "Guatemala", name: "Guatemala", flag: "🇬🇹" },
      { code: "El Salvador", name: "El Salvador", flag: "🇸🇻" },
      { code: "Honduras", name: "Honduras", flag: "🇭🇳" },
      { code: "Nicaragua", name: "Nicaragua", flag: "🇳🇮" },
      { code: "República Dominicana", name: "República Dominicana", flag: "🇩🇴" },
      { code: "Puerto Rico", name: "Puerto Rico", flag: "🇵🇷" },
      { code: "Cuba", name: "Cuba", flag: "🇨🇺" },
      { code: "Estados Unidos", name: "Estados Unidos", flag: "🇺🇸" },
      { code: "Canadá", name: "Canadá", flag: "🇨🇦" },
      { code: "España", name: "España", flag: "🇪🇸" },
    ];

    // Buscar el país por nombre exacto
    const paisEncontrado = PAISES.find(pais =>
      pais.name.toLowerCase() === country.toLowerCase() ||
      pais.code.toLowerCase() === country.toLowerCase()
    );

    return paisEncontrado ? paisEncontrado.flag : "🌎";
  };

  return (
    <Box
      minH="100vh"
      bg={containerBg}
      pt="100px"
      pb={10}
      px={{ base: 4, md: 8 }}
    >
      <VStack maxW="container.md" mx="auto" gap={6}>
        {/* CARD PRINCIPAL DEL PERFIL */}
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
            {/* Avatar y Redes */}
            <VStack gap={3}>
              {/* Avatar simple usando Flex */}
              <Flex
                w="120px"
                h="120px"
                borderRadius="full"
                bg="green.500"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontWeight="bold"
                fontSize="3xl"
                border="4px solid"
                borderColor="green.500"
                boxShadow="xl"
              >
                {userProfile.nombre[0]}{userProfile.apellidos[0]}
              </Flex>

              <HStack gap={2}>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <IconButton
                    aria-label="Instagram"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: "green.400", bg: "gray.700" }}
                    rounded="full"
                    size="lg"
                  >
                    <FaInstagram />
                  </IconButton>
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                >
                  <IconButton
                    aria-label="Compartir"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: "green.400", bg: "gray.700" }}
                    rounded="full"
                    size="lg"
                  >
                    <FaShareAlt />
                  </IconButton>
                </a>
              </HStack>
              <Text fontSize="xs" color="gray.500">
                ID: {currentUser.uid.substring(0, 8)}...
              </Text>
            </VStack>

            {/* Información Personal */}
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
                {getFlag(userProfile.nacionalidad)} {userProfile.nacionalidad || "Sin país"} • {userProfile.ciudad || "Sin ciudad"}
              </Text>

              <Text
                fontSize="sm"
                color="gray.400"
                mb={4}
                fontWeight="medium"
              >
                Box Afiliado: {userProfile.boxAfiliado || "Sin afiliar"}
              </Text>

              <HStack mb={4} gap={{ base: 4, md: 6 }}>
                <VStack gap={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="green.400">
                    {userProfile.competencias?.length || 0}
                  </Text>
                  <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                    Competencias
                  </Text>
                </VStack>

                {/* Divisor vertical usando Box */}
                <Box h="40px" w="1px" bg="gray.600" />

                <VStack gap={1}>
                  <Text fontSize="2xl" fontWeight="bold" color="green.400">
                    {userProfile.mejorPodio === 999 || !userProfile.mejorPodio
                      ? "N/A"
                      : `${userProfile.mejorPodio}°`}
                  </Text>
                  <Text fontSize="sm" color="gray.500" whiteSpace="nowrap">
                    Mejor Podio
                  </Text>
                </VStack>

                {/* Divisor vertical usando Box */}
                <Box h="40px" w="1px" bg="gray.600" />

                <VStack gap={1}>
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
                w={{ base: "100%", md: "auto" }}
                color="green.400"
                borderColor="green.600"
              >
                <HStack gap={2}>
                  <FaEdit />
                  <Text color="green.400">Editar Perfil</Text>
                </HStack>
              </Button>
            </Flex>
          </Flex>
        </Box>

        {/* HISTORIAL DE COMPETENCIAS */}
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

          <VStack align="stretch" gap={4}>
            {(userProfile.competencias?.length || 0) > 0 ? (
              <Text color="gray.500" textAlign="center" py={4}>
                Competencias próximamente disponibles
              </Text>
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
                onClick={() => navigate("/")}
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