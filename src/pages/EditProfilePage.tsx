import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
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
  Spinner,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import { FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

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

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, loadingAuth } = useAuth();

  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    nivel: "Novato" as "Novato" | "Intermedio" | "RX",
    boxAfiliado: "",
    nacionalidad: "",
    ciudad: "",
  });

  // Colores para modo oscuro
  const cardBg = "gray.800";
  const textColor = "gray.200";
  const containerBg = "gray.900";

  // Lista de países con banderas
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
        const user = data.user;
        setUserProfile(user);

        // Initialize form with current data
        setFormData({
          nombre: user.nombre || "",
          apellidos: user.apellidos || "",
          nivel: user.nivel || "Novato",
          boxAfiliado: user.boxAfiliado || "",
          nacionalidad: user.nacionalidad || "",
          ciudad: user.ciudad || "",
        });

      } catch (error: any) {
        console.error("Error al cargar perfil:", error);
        toast.error("No se pudo cargar tu perfil");
        navigate("/profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [currentUser, loadingAuth, navigate, toast]);

  const handleSave = async () => {
    if (!currentUser || !userProfile) return;

    setSaving(true);
    try {
      const token = await currentUser.getIdToken();

      const updateData = {
        nombre: formData.nombre.trim(),
        apellidos: formData.apellidos.trim(),
        nivel: formData.nivel,
        boxAfiliado: formData.boxAfiliado.trim(),
        nacionalidad: formData.nacionalidad.trim() || undefined,
        ciudad: formData.ciudad.trim() || undefined,
      };

      await updateUserProfile(userProfile._id!, updateData, token);

      toast.success("Tu perfil ha sido actualizado exitosamente");

      navigate(`/profile/${currentUser.uid}`);

    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      toast.error("No se pudo actualizar tu perfil");
    } finally {
      setSaving(false);
    }
  };

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
          <Text color={textColor} fontSize="xl">
            Error al cargar el perfil.
          </Text>
          <Button colorScheme="green" onClick={() => navigate(`/profile/${currentUser.uid}`)}>
            Volver al perfil
          </Button>
        </VStack>
      </Center>
    );
  }

  return (
    <Box
      minH="100vh"
      bg={containerBg}
      pt="120px"
      pb={10}
      px={{ base: 4, md: 8 }}
    >
      <VStack maxW="container.md" mx="auto" gap={6}>
        {/* Header */}
        <Flex w="100%" justify="space-between" align="center">
          <Button
            variant="ghost"
            color="gray.400"
            _hover={{ color: "green.400", bg: "gray.700" }}
            onClick={() => navigate(`/profile/${currentUser.uid}`)}
          >
            <FaArrowLeft style={{ marginRight: '8px' }} />
            Volver al perfil
          </Button>
          <Heading size="lg" color="white">
            Editar Perfil
          </Heading>
          <Box w="120px" /> {/* Spacer for centering */}
        </Flex>

        {/* Form Card */}
        <Box
          w="100%"
          bg={cardBg}
          p={{ base: 6, md: 8 }}
          borderRadius="xl"
          shadow="2xl"
          border="1px solid"
          borderColor="gray.700"
        >
          <VStack gap={6} align="stretch">
            {/* Información Personal */}
            <Box>
              <Heading size="md" mb={4} color="white">
                Información Personal
              </Heading>
              <VStack gap={4} align="stretch">
                <Field.Root>
                  <Field.Label color="gray.300">Nombre</Field.Label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Tu nombre"
                    size="lg"
                    bg="gray.900"
                    borderColor="gray.600"
                    _hover={{ borderColor: "green.500" }}
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                    }}
                    color="white"
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label color="gray.300">Apellidos</Field.Label>
                  <Input
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    placeholder="Tus apellidos"
                    size="lg"
                    bg="gray.900"
                    borderColor="gray.600"
                    _hover={{ borderColor: "green.500" }}
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                    }}
                    color="white"
                  />
                </Field.Root>
              </VStack>
            </Box>

            {/* Ubicación */}
            <Box>
              <Heading size="md" mb={4} color="white">
                Ubicación
              </Heading>
              <VStack gap={4} align="stretch">
                <Field.Root>
                  <Field.Label color="gray.300">País</Field.Label>
                  <NativeSelectRoot size="lg">
                    <NativeSelectField
                      value={formData.nacionalidad}
                      onChange={(e) => setFormData({ ...formData, nacionalidad: e.target.value })}
                      bg="gray.900"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "green.500" }}
                      _focus={{
                        borderColor: "green.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                      }}
                    >
                      <option value="" style={{ backgroundColor: '#1A202C', color: 'white' }}>
                        Seleccionar país
                      </option>
                      {PAISES.map((pais) => (
                        <option
                          key={pais.code}
                          value={pais.code}
                          style={{ backgroundColor: '#1A202C', color: 'white' }}
                        >
                          {pais.flag} {pais.name}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field.Root>

                <Field.Root>
                  <Field.Label color="gray.300">Ciudad</Field.Label>
                  <Input
                    value={formData.ciudad}
                    onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                    placeholder="Tu ciudad"
                    size="lg"
                    bg="gray.900"
                    borderColor="gray.600"
                    _hover={{ borderColor: "green.500" }}
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                    }}
                    color="white"
                  />
                </Field.Root>
              </VStack>
            </Box>

            {/* Información de CrossFit */}
            <Box>
              <Heading size="md" mb={4} color="white">
                Información de CrossFit
              </Heading>
              <VStack gap={4} align="stretch">
                <Field.Root>
                  <Field.Label color="gray.300">Nivel</Field.Label>
                  <NativeSelectRoot size="lg">
                    <NativeSelectField
                      value={formData.nivel}
                      onChange={(e) => setFormData({ ...formData, nivel: e.target.value as any })}
                      bg="gray.900"
                      borderColor="gray.600"
                      color="white"
                      _hover={{ borderColor: "green.500" }}
                      _focus={{
                        borderColor: "green.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                      }}
                    >
                      <option value="Novato" style={{ backgroundColor: '#1A202C', color: 'white' }}>🌱 Novato - Menos de 6 meses</option>
                      <option value="Intermedio" style={{ backgroundColor: '#1A202C', color: 'white' }}>💪 Intermedio - 6 meses a 2 años</option>
                      <option value="RX" style={{ backgroundColor: '#1A202C', color: 'white' }}>🔥 RX - Más de 2 años</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field.Root>

                <Field.Root>
                  <Field.Label color="gray.300">Box Afiliado</Field.Label>
                  <Input
                    value={formData.boxAfiliado}
                    onChange={(e) => setFormData({ ...formData, boxAfiliado: e.target.value })}
                    placeholder="Nombre de tu box"
                    size="lg"
                    bg="gray.900"
                    borderColor="gray.600"
                    _hover={{ borderColor: "green.500" }}
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                    }}
                    color="white"
                  />
                </Field.Root>
              </VStack>
            </Box>

            {/* Botones de acción */}
            <HStack gap={4} pt={4}>
              <Button
                variant="outline"
                borderColor="gray.600"
                color="gray.300"
                _hover={{ bg: "gray.700", borderColor: "gray.500" }}
                onClick={() => navigate("/profile")}
                flex={1}
              >
                Cancelar
              </Button>
              <Button
                bg="wodAccent.500"
                color="white"
                _hover={{ bg: "wodAccent.600" }}
                onClick={handleSave}
                loading={saving}
                flex={1}
              >
                Guardar Cambios
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default EditProfilePage;