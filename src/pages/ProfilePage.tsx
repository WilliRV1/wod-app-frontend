

import React, { useEffect, useState, useMemo } from "react";
// Imports de React Router
import { useNavigate } from "react-router-dom";

// 1. Importa las INSTANCIAS (auth, db) desde tu archivo central
import { auth, db } from "../firebase"; // <-- Ajusta esta ruta si es necesario

// 2. Importa las FUNCIONES que usas
import { 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged, 
  type User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  onSnapshot, 
  type DocumentData 
} from 'firebase/firestore';

// ... (El resto de tus imports de Chakra, etc.)

// Imports de Chakra UI
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Avatar,
  VStack,
  HStack,
  Center,
  Spinner,
  IconButton,
  Link,
  Separator // Usar Separator en lugar de Divider
} from "@chakra-ui/react";

import { useColorModeValue } from "../components/ui/color-mode"
// Imports de utilidades e íconos
import { toast } from 'react-hot-toast';
import { FaInstagram, FaShareAlt, FaEdit, FaTimesCircle } from "react-icons/fa";
import { IoBarbellOutline } from "react-icons/io5";

// --- DECLARACIONES DE VARIABLES GLOBALES (DE CANVAS) ---
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string | undefined;

// --- INTERFACE Y VALORES INICIALES (FUERA DEL COMPONENTE) ---
interface UserData extends DocumentData {
  _id?: string;
  firebaseUid: string;
  nombre: string;
  apellidos: string;
  email: string;
  nivel: 'Novato' | 'Intermedio' | 'RX';
  boxAfiliado: string;
  competenciasIds: string[];
  pais: string;
  ciudad: string;
  mejorPodio: number;
  fotoUrl?: string;
}

const INITIAL_USER_PROFILE: Omit<UserData, 'firebaseUid' | 'email' | 'nombre' | 'apellidos'> = {
    nivel: "Novato",
    boxAfiliado: "Sin afiliar",
    competenciasIds: [],
    pais: "Desconocido",
    ciudad: "Desconocida",
    mejorPodio: 999,
    fotoUrl: undefined,
};


const getProfileDocRef = (userId: string, appId: string) =>
  doc(db, "artifacts", appId, "users", userId, "profile", "data");


// ===========================================
// --- COMPONENTE PRINCIPAL: ProfilePage ---
// ===========================================
const ProfilePage = () => {
  
  // --- HOOKS Y ESTADO (DENTRO DEL COMPONENTE) ---
  const navigate = useNavigate();
  
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const appId = useMemo(() => typeof __app_id !== 'undefined' ? __app_id : 'default-app-id', []);

  // Colores para el tema oscuro
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const containerBg = useColorModeValue("gray.50", "gray.900");

  // 4. AUTENTICACIÓN Y ESCUCHA DE CAMBIOS
  useEffect(() => {
    // 4.1. Intentar iniciar sesión con el token inicial
    const signIn = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Error signing in:", error);
      }
    };
    signIn();

    // 4.2. Establecer el listener de Auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // 5. CARGA Y SINCRONIZACIÓN DEL PERFIL DE FIRESTORE (Real-time)
  useEffect(() => {
    if (loadingAuth || !firebaseUser) {
      if (!loadingAuth && !firebaseUser) {
        // Si la autenticación terminó y no hay usuario, redirige
        navigate("/login");
      }
      return;
    }

    const userId = firebaseUser.uid;
    const profileRef = getProfileDocRef(userId, appId);

    const unsubscribeProfile = onSnapshot(profileRef, async (docSnap) => {
      if (docSnap.exists()) {
        // Perfil encontrado, cargarlo
        setUserProfile(docSnap.data() as UserData);
        setLoadingProfile(false);
      } else {
        // Perfil no encontrado, crearlo con datos base
        const newProfile: UserData = {
            ...INITIAL_USER_PROFILE,
            firebaseUid: userId,
            email: firebaseUser.email || "No registrado",
            nombre: "Usuario", // Valores por defecto
            apellidos: "Nuevo",
            nivel: "Novato",
            boxAfiliado: "",
            competenciasIds: [],
            pais: "",
            ciudad: "",
            mejorPodio: 0
        };
        
        try {
          // Intenta crear el documento
          await setDoc(profileRef, newProfile);
          setUserProfile(newProfile);
            toast.success("Perfil creado.");
        } catch (e) {
          console.error("Error creating profile:", e);
          toast.error("Error de perfil.");
          setUserProfile(null); // Marcar como fallido
        } finally {
          setLoadingProfile(false);
        }
      }
    }, (error) => {
      console.error("Error listening to profile data:", error);
      toast.error("Error de conexión.");
      setLoadingProfile(false);
    });

    return () => unsubscribeProfile();
  }, [firebaseUser, loadingAuth, appId, navigate]); // Dependencias clave

  
  // 6. ESTADOS DE CARGA Y ERROR (DENTRO DEL COMPONENTE)
  if (loadingAuth || loadingProfile) {
    return (
      <Center h="100vh" bg={containerBg}>
        <VStack>
          <Spinner size="xl" color="green.500"  />
          <Text color="gray.400">Cargando perfil...</Text>
        </VStack>
      </Center>
    );
  }

  if (!userProfile || !firebaseUser) {
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
  
  // Helper para mostrar la bandera de forma simple (usando Emojis)
  const getFlag = (country: string) => {
    switch(country.toLowerCase()) {
      case 'colombia': return '🇨🇴';
      case 'chile': return '🇨🇱';
      case 'mexico': return '🇲🇽';
      default: return '🌎';
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
      <VStack maxW="container.md" mx="auto">

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
            <VStack >
              <Avatar.Root
                size="xl"
                bg="green.500"
                color="white"
                border="4px solid"
                borderColor="green.500"
                boxShadow="xl"
              />
              <Avatar.Fallback name={`${userProfile.nombre} ${userProfile.apellidos}`} />
              <Avatar.Image src={userProfile.fotoUrl} />
              <HStack>
                <Link href="https://www.instagram.com">
                  <IconButton
                    aria-label="Instagram"
                    variant="ghost"
                    colorPalette="green"
                    rounded="full"
                  >
                    <FaInstagram/>
                  </IconButton>
                </Link>
                <Link href="https://www.instagram.com">
                <IconButton
                  aria-label="Compartir" 
                  variant="ghost" 
                  colorPalette="green"
                  rounded="full"
                >
                  <FaShareAlt/>
                </IconButton>
                </Link>
              </HStack>
              <Text fontSize="xs" color="gray.500">ID: {firebaseUser.uid.substring(0, 8)}...</Text>
            </VStack>

            {/* Centro: Información Personal y Estadísticas */}
            <Flex direction="column" flex={1} minW="0">
              <Heading 
                fontSize={{ base: "xl", md: "2xl" }} 
                color="white" 
                mb={1}
                
              >
                {userProfile.nombre} {userProfile.apellidos}
              </Heading>
              
              <Text fontSize="md" color="gray.400" mb={2}>
                {getFlag(userProfile.pais)} {userProfile.ciudad}
              </Text>
              
              <Text 
                fontSize="sm" 
                color="gray.400" 
                mb={4} 
                fontWeight="medium"
              >
                Box Afiliado: {userProfile.boxAfiliado}
              </Text>

              <HStack mb={4}>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color="green.400">
                    {userProfile.competenciasIds.length}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Competencias
                  </Text>
                </VStack>
                
                <Center height="40px">
                  <Separator orientation="vertical" borderColor="gray.600" />
                </Center>
                
                <VStack >
                  <Text fontSize="2xl" fontWeight="bold" color="green.400">
                    {userProfile.mejorPodio === 999 ? 'N/A' : `${userProfile.mejorPodio}°`}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Mejor Podio
                  </Text>
                </VStack>
                
                <Center height="40px">
                  <Separator orientation="vertical" borderColor="gray.600" />
                </Center>

                <VStack >
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
              
              >
                <FaEdit /> Editar Perfil
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
            {userProfile.competenciasIds.length > 0 ? (
                // Aquí deberías mapear la lista de IDs para obtener los datos reales de la competencia
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
                  <HStack>
                    <Center 
                      w="50px" 
                      h="50px" 
                      borderRadius="full" 
                      bg="green.500"
                      color="white"
                      fontSize="2xl"
                      shadow="lg"
                    >
                      <IoBarbellOutline />
                    </Center>
                    <VStack align="start">
                      <Text fontWeight="bold" color="white" fontSize="md">
                        Barbell Challenge (Ejemplo)
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        SCALED MASCULINO
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        04/05/2025
                      </Text>
                    </VStack>
                  </HStack>
                  <VStack>
                    <Text fontSize="3xl" fontWeight="extrabold" color="green.300">
                      26°
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Posición
                    </Text>
                  </VStack>
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
                  size="sm">
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


