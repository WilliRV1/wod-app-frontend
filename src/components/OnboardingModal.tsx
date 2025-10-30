                  import { useState } from "react";
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Input,
  Progress,
  Flex,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import { DialogRoot, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogBackdrop } from "@chakra-ui/react";
import { completeUserProfile } from "../services/user.service";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  canSkip?: boolean;
}

export function OnboardingModal({ isOpen, onClose, canSkip = true }: OnboardingModalProps) {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Datos del formulario
  const [apellidos, setApellidos] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [nacionalidadOtro, setNacionalidadOtro] = useState("");
  const [paisSearch, setPaisSearch] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [ciudadSearch, setCiudadSearch] = useState("");
  const [nivel, setNivel] = useState<"Novato" | "Intermedio" | "RX">("Novato");
  const [boxAfiliado, setBoxAfiliado] = useState("");

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

  // Función para obtener países filtrados
  const getPaisesFiltrados = () => {
    if (paisSearch.trim() === "") {
      return PAISES.slice(0, 8); // Mostrar primeros 8 si no hay búsqueda
    }

    return PAISES.filter(pais =>
      pais.name.toLowerCase().includes(paisSearch.toLowerCase())
    ).slice(0, 8); // Limitar a 8 resultados
  };

  // Ciudades por país
  const CIUDADES_COLOMBIA = [
    "Bogotá", "Medellín", "Cali", "Barranquilla", "Cartagena", "Cúcuta", "Bucaramanga", "Pereira",
    "Santa Marta", "Ibagué", "Pasto", "Manizales", "Neiva", "Villavicencio", "Armenia", "Popayán",
    "Sincelejo", "Valledupar", "Montería", "Tunja", "Yopal", "Riohacha", "Quibdó", "Arauca",
    "Mocoa", "San Andrés", "Leticia", "Mitú", "Puerto Carreño", "Inírida"
  ];

  const CIUDADES_VENEZUELA = [
    "Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay", "Ciudad Bolívar", "Barcelona",
    "Puerto La Cruz", "Puerto Cabello", "Mérida", "San Cristóbal", "Barinas", "Ciudad Guayana",
    "Turmero", "Los Teques", "Punto Fijo", "Acarigua", "Araure", "Guanare", "Villa de Cura",
    "El Tigre", "Anaco", "Cantaura", "El Tocuyo", "Táriba", "Rubio", "Santa Bárbara del Zulia"
  ];

  const CIUDADES_ECUADOR = [
    "Quito", "Guayaquil", "Cuenca", "Santo Domingo", "Machala", "Durán", "Manta", "Portoviejo",
    "Eloy Alfaro", "Esmeraldas", "Ambato", "Riobamba", "Quevedo", "Loja", "Ibarra", "Milagro",
    "Babahoyo", "Montañita", "Salinas", "Tulcán", "Nueva Loja", "Jipijapa", "Rosa Zárate", "Santa Elena"
  ];

  // Función para obtener ciudades filtradas
  const getCiudadesFiltradas = () => {
    let ciudades = [];
    switch (nacionalidad) {
      case "Colombia":
        ciudades = CIUDADES_COLOMBIA;
        break;
      case "Venezuela":
        ciudades = CIUDADES_VENEZUELA;
        break;
      case "Ecuador":
        ciudades = CIUDADES_ECUADOR;
        break;
      default:
        return [];
    }

    if (ciudadSearch.trim() === "") {
      return []; // No mostrar nada si no hay búsqueda
    }

    return ciudades.filter(ciudad =>
      ciudad.toLowerCase().includes(ciudadSearch.toLowerCase())
    ).slice(0, 8); // Limitar a 8 resultados para mejor UX
  };

  const totalSteps = 4;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (canSkip) {
      onClose();
    }
  };

  const handleComplete = async () => {
    if (!currentUser) {
      toast.error("No se pudo obtener tu información de usuario");
      return;
    }

    setIsLoading(true);

    try {
      const token = await currentUser.getIdToken();

      await completeUserProfile(
        {
          apellidos: apellidos.trim() || undefined,
          nacionalidad: nacionalidad === "Otro" ? nacionalidadOtro.trim() : nacionalidad.trim() || undefined,
          ciudad: ciudad.trim() || undefined,
          nivel,
          boxAfiliado: boxAfiliado.trim() || undefined,
          onboardingStep: totalSteps
        },
        token
      );

      toast.success("¡Perfil completado! 🎉");
      onClose();

    } catch (error) {
      console.error("Error al completar perfil:", error);
      toast.error("Error al guardar tu información");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(e) => !e.open && canSkip && onClose()}
      size="lg"
    >
      <DialogBackdrop bg="blackAlpha.700" />
      <DialogContent
        bg="gray.800"
        borderColor="gray.700"
        borderWidth="2px"
        p={0}
      >
        <DialogHeader
          p={6}
          borderBottomWidth="1px"
          borderColor="gray.700"
        >
          <VStack align="stretch" gap={3}>
            <Heading size="lg" color="white">
              Completa tu perfil
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Paso {currentStep} de {totalSteps}
            </Text>
            <Progress.Root value={progressPercentage} colorScheme="green">
              <Progress.Track bg="gray.700">
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
          </VStack>
        </DialogHeader>

        <DialogBody p={6}>
          <VStack gap={5} align="stretch">
            {/* PASO 1: Apellidos */}
            {currentStep === 1 && (
              <Box>
                <Heading size="md" mb={3} color="white">
                  ¿Cuál es tu apellido?
                </Heading>
                <Text color="gray.400" mb={4} fontSize="sm">
                  Ayuda a otros atletas a identificarte mejor
                </Text>
                <Field.Root>
                  <Input
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder="Ej: García López"
                    size="lg"
                    bg="gray.900"
                    borderColor="gray.600"
                    _hover={{ borderColor: "green.500" }}
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                    }}
                    color="white"
                    autoFocus
                  />
                </Field.Root>
              </Box>
            )}

            {/* PASO 2: País */}
            {currentStep === 2 && (
              <Box>
                <Heading size="md" mb={3} color="white">
                  ¿De qué país eres?
                </Heading>
                <Text color="gray.400" mb={4} fontSize="sm">
                  Selecciona tu país de residencia
                </Text>
                <Box position="relative">
                  <Field.Root>
                    <Input
                      value={nacionalidad === "Otro" ? nacionalidadOtro : nacionalidad}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (nacionalidad === "Otro") {
                          setNacionalidadOtro(value);
                          // Si escriben un país que está en la lista, sugerirlo
                          const paisEncontrado = PAISES.find(pais =>
                            pais.name.toLowerCase() === value.toLowerCase()
                          );
                          if (paisEncontrado) {
                            setNacionalidad(paisEncontrado.code);
                            setNacionalidadOtro("");
                            setPaisSearch("");
                          }
                        } else {
                          setNacionalidad(value);
                          setPaisSearch(value);
                        }
                      }}
                      placeholder="Buscar país..."
                      size="lg"
                      bg="gray.900"
                      borderColor="gray.600"
                      _hover={{ borderColor: "green.500" }}
                      _focus={{
                        borderColor: "green.500",
                        boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                      }}
                      color="white"
                      autoComplete="off"
                    />
                  </Field.Root>

                  {((paisSearch && nacionalidad !== "Otro") || (!nacionalidad && !nacionalidadOtro)) && getPaisesFiltrados().length > 0 && (
                    <Box
                      position="absolute"
                      top="100%"
                      left="0"
                      right="0"
                      bg="gray.800"
                      border="1px solid"
                      borderColor="gray.600"
                      borderRadius="md"
                      boxShadow="lg"
                      zIndex="10"
                      maxH="200px"
                      overflowY="auto"
                      mt={1}
                    >
                      {getPaisesFiltrados().map((pais, index) => (
                        <Box
                          key={pais.code}
                          p={3}
                          cursor="pointer"
                          color="white"
                          _hover={{ bg: "gray.700" }}
                          onClick={() => {
                            setNacionalidad(pais.code);
                            setPaisSearch("");
                          }}
                          borderBottom={index < getPaisesFiltrados().length - 1 ? "1px solid" : "none"}
                          borderColor="gray.600"
                          display="flex"
                          alignItems="center"
                          gap={2}
                        >
                          <Text>{pais.flag}</Text>
                          <Text>{pais.name}</Text>
                        </Box>
                      ))}

                      <Box
                        p={3}
                        cursor="pointer"
                        color="white"
                        _hover={{ bg: "gray.700" }}
                        onClick={() => {
                          setNacionalidad("Otro");
                          setPaisSearch("");
                        }}
                        borderTop="1px solid"
                        borderColor="gray.600"
                        display="flex"
                        alignItems="center"
                        gap={2}
                      >
                        <Text>🌍</Text>
                        <Text>Otro país</Text>
                      </Box>
                    </Box>
                  )}

                  {nacionalidad === "Otro" && (
                    <Text color="gray.500" fontSize="xs" mt={2}>
                      Escribe el nombre completo de tu país
                    </Text>
                  )}
                </Box>
              </Box>
            )}

            {/* PASO 3: Ciudad */}
            {currentStep === 3 && (
              <Box>
                <Heading size="md" mb={3} color="white">
                  ¿En qué ciudad entrenas?
                </Heading>
                <Text color="gray.400" mb={4} fontSize="sm">
                  Opcional - Puedes agregarla después
                </Text>
                <VStack gap={3} align="stretch">
                  {(nacionalidad === "Colombia" || nacionalidad === "Venezuela" || nacionalidad === "Ecuador") ? (
                    <Box position="relative">
                      <Field.Root>
                        <Input
                          value={ciudad}
                          onChange={(e) => {
                            setCiudad(e.target.value);
                            setCiudadSearch(e.target.value);
                          }}
                          placeholder="Buscar ciudad..."
                          size="lg"
                          bg="gray.900"
                          borderColor="gray.600"
                          _hover={{ borderColor: "green.500" }}
                          _focus={{
                            borderColor: "green.500",
                            boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                          }}
                          color="white"
                          autoComplete="off"
                        />
                      </Field.Root>

                      {ciudadSearch && getCiudadesFiltradas().length > 0 && (
                        <Box
                          position="absolute"
                          top="100%"
                          left="0"
                          right="0"
                          bg="gray.800"
                          border="1px solid"
                          borderColor="gray.600"
                          borderRadius="md"
                          boxShadow="lg"
                          zIndex="10"
                          maxH="200px"
                          overflowY="auto"
                          mt={1}
                        >
                          {getCiudadesFiltradas().map((ciudadOption, index) => (
                            <Box
                              key={ciudadOption}
                              p={3}
                              cursor="pointer"
                              color="white"
                              _hover={{ bg: "gray.700" }}
                              onClick={() => {
                                setCiudad(ciudadOption);
                                setCiudadSearch("");
                              }}
                              borderBottom={index < getCiudadesFiltradas().length - 1 ? "1px solid" : "none"}
                              borderColor="gray.600"
                            >
                              {ciudadOption}
                            </Box>
                          ))}
                        </Box>
                      )}

                      <Text color="gray.500" fontSize="xs" mt={2}>
                        Escribe para buscar ciudades o el nombre completo si no está en la lista
                      </Text>
                    </Box>
                  ) : (
                    <Field.Root>
                      <Input
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        placeholder="Ej: Ciudad de México, Madrid..."
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
                  )}
                </VStack>
              </Box>
            )}

            {/* PASO 4: Nivel y Box */}
            {currentStep === 4 && (
              <VStack gap={5} align="stretch">
                <Box>
                  <Heading size="md" mb={3} color="white">
                    ¿Cuál es tu nivel en CrossFit?
                  </Heading>
                  <Text color="gray.400" mb={4} fontSize="sm">
                    Esto ayuda a encontrar parejas de tu nivel
                  </Text>
                  <Field.Root>
                    <NativeSelectRoot size="lg">
                      <NativeSelectField
                        value={nivel}
                        onChange={(e) => setNivel(e.target.value as any)}
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
                </Box>

                <Box>
                  <Heading size="md" mb={3} color="white">
                    ¿Dónde entrenas?
                  </Heading>
                  <Text color="gray.400" mb={4} fontSize="sm">
                    Opcional - Puedes agregarlo después
                  </Text>
                  <Field.Root>
                    <Input
                      value={boxAfiliado}
                      onChange={(e) => setBoxAfiliado(e.target.value)}
                      placeholder="Ej: CrossFit Cali"
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
                </Box>
              </VStack>
            )}
          </VStack>
        </DialogBody>

        <DialogFooter
          p={6}
          borderTopWidth="1px"
          borderColor="gray.700"
        >
          <Flex w="100%" gap={3}>
            <Button
              variant="outline"
              borderColor="gray.600"
              color="gray.300"
              onClick={currentStep === 1 && canSkip ? handleSkip : handlePrev}
              disabled={currentStep === 1 && !canSkip}
              flex={1}
              _hover={{ bg: "gray.700", borderColor: "gray.500" }}
            >
              {currentStep === 1 ? (canSkip ? "Saltar" : "") : "Atrás"}
            </Button>
            <Button
              bg="wodAccent.500"
              color="white"
              onClick={handleNext}
              flex={1}
              loading={isLoading && currentStep === totalSteps}
              _hover={{ bg: "wodAccent.600" }}
              disabled={
                (currentStep === 1 && !apellidos.trim()) ||
                (currentStep === 2 && !nacionalidad && !nacionalidadOtro.trim()) ||
                (currentStep === 3 && !ciudad.trim()) ||
                (currentStep === 4 && !nivel)
              }
            >
              {currentStep === totalSteps ? "Finalizar" : "Siguiente"}
            </Button>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default OnboardingModal;