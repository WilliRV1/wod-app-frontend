import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FaTrophy,
  FaBolt,
  FaClock,
  FaMapMarkerAlt,
  FaDollarSign,
  FaChevronDown,
} from 'react-icons/fa';

// Datos del evento
const BATTLE_DATA = {
  nombre: "WOD MATCH Battle #1",
  fecha: "2026-03-15",
  fechaFin: "2026-03-16",
  lugar: "CrossFit Coach Piperubio",
  ciudad: "Cali, Valle del Cauca",
  direccion: "Calle XX #XX-XX, Cali",
  precio: 90000,
  precioEarlyBird: 80000,
  earlyBirdHasta: "2026-01-31",
  cuposTotal: 64,
  cuposDisponibles: 52,
  categorias: [
    { nombre: "Intermedio Masculino", cupos: 16, ocupados: 4, color: "orange" },
    { nombre: "Intermedio Femenino", cupos: 16, ocupados: 3, color: "orange" },
    { nombre: "Scaled Masculino", cupos: 16, ocupados: 2, color: "green" },
    { nombre: "Scaled Femenino", cupos: 16, ocupados: 3, color: "green" }
  ],
  premios: {
    primero: 400000,
    segundo: 200000,
    tercero: 100000
  }
};

function WODMatchBattleLanding() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [isEarlyBird, setIsEarlyBird] = useState(false);
  const [showStickyButton, setShowStickyButton] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const calculateCountdown = () => {
      const eventDate = new Date(BATTLE_DATA.fecha).getTime();
      const earlyBirdDate = new Date(BATTLE_DATA.earlyBirdHasta).getTime();
      const now = new Date().getTime();
      
      setIsEarlyBird(now < earlyBirdDate);
      
      const distance = eventDate - now;

      if (distance > 0) {
        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000);

    // Scroll listener para el botón sticky
    const handleScroll = () => {
      setShowStickyButton(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const cuposRestantes = BATTLE_DATA.cuposDisponibles;
  const precio = isEarlyBird ? BATTLE_DATA.precioEarlyBird : BATTLE_DATA.precio;

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: 'smooth'
    });
  };

  return (
    <Box minH="100vh" bg="gray.900">
      {/* Botón sticky para registro */}
      {showStickyButton && (
        <Box
          position="fixed"
          bottom="6"
          left="50%"
          transform="translateX(-50%)"
          zIndex="1000"
          bg="green.500"
          borderRadius="full"
          boxShadow="0 0 30px rgba(0, 209, 161, 0.6)"
          _hover={{
            bg: "green.600",
            transform: "translateX(-50%) translateY(-2px)",
            boxShadow: "0 0 40px rgba(0, 209, 161, 0.8)"
          }}
          transition="all 0.3s"
        >
          <Button
            size="lg"
            bg="transparent"
            color="white"
            borderRadius="full"
            px={6}
            py={6}
            onClick={() => navigate('/battle/register')}
          >
            <HStack gap={2}>
              <FaBolt />
              <Text fontWeight="bold">REGISTRARME AHORA</Text>
            </HStack>
          </Button>
        </Box>
      )}

      {/* HERO SECTION */}
      <Box
        ref={heroRef}
        position="relative"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgGradient="linear(to-b, gray.900, gray.800)"
        overflow="hidden"
        pt="80px" // Espacio para el navbar
      >
        {/* Video de fondo */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          opacity="0.4"
          zIndex="0"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.3)'
            }}
          >
            <source
              src="https://assets.codepen.io/3364143/7b5d3d346a4d41647e4c0e8c66c8484b.mp4"
              type="video/mp4"
            />
            {/* Fallback image si el video no carga */}
          </video>
          {/* Fallback image */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="linear-gradient(45deg, #1a202c 0%, #2d3748 100%)"
            opacity="0.8"
          />
        </Box>

        {/* Efecto de glow */}
        <Box
          position="absolute"
          top="20%"
          left="50%"
          w="600px"
          h="600px"
          bg="green.500"
          opacity="0.15"
          filter="blur(150px)"
          transform="translateX(-50%)"
          borderRadius="full"
          zIndex="1"
        />

        <Container maxW="container.xl" position="relative" zIndex="2">
          <VStack gap={8} textAlign="center">
            {/* Badge inaugural */}
            <Badge
              colorScheme="green"
              fontSize="md"
              px={6}
              py={2}
              borderRadius="full"
              textTransform="uppercase"
              letterSpacing="wider"
              boxShadow="0 0 20px rgba(0, 209, 161, 0.3)"
              bg="green.600"
            >
              🔥 Evento Inaugural
            </Badge>

            {/* Logo/Título */}
            <VStack gap={4}>
              <Heading
                fontSize={{ base: "4xl", md: "6xl", lg: "8xl" }}
                fontWeight="black"
                bgGradient="linear(to-r, green.300, green.500, green.300)"
                bgClip="text"
                letterSpacing="tight"
                lineHeight="1"
                textShadow="0 0 30px rgba(0, 209, 161, 0.5)"
              >
                WOD MATCH
                <br />
                BATTLE
              </Heading>
              
              <Text
                fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                color="gray.300"
                fontWeight="semibold"
                maxW="800px"
                textShadow="0 2px 4px rgba(0,0,0,0.5)"
              >
                El primer torneo bracket 1vs1 de CrossFit en Colombia
              </Text>
            </VStack>

            {/* Info rápida */}
            <Flex
              gap={{ base: 4, md: 8 }}
              flexWrap="wrap"
              justify="center"
              fontSize={{ base: "md", md: "lg" }}
              color="gray.300"
              textShadow="0 1px 2px rgba(0,0,0,0.5)"
            >
              <HStack gap={2}>
                <FaMapMarkerAlt color="#00D1A1" />
                <Text>{BATTLE_DATA.ciudad}</Text>
              </HStack>
              <HStack gap={2}>
                <FaClock color="#00D1A1" />
                <Text>
                  {new Date(BATTLE_DATA.fecha).toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'short'
                  })} - {new Date(BATTLE_DATA.fechaFin).toLocaleDateString('es-CO', {
                    day: 'numeric',
                    month: 'short'
                  })}
                </Text>
              </HStack>
              <HStack gap={2}>
                <FaDollarSign color="#00D1A1" />
                <Text>
                  ${precio.toLocaleString('es-CO')} COP
                </Text>
              </HStack>
            </Flex>

            {/* CTA Principal */}
            <VStack gap={4} w="100%" maxW="600px" pt={6}>
              {isEarlyBird && (
                <Box
                  bg="orange.900"
                  borderColor="orange.500"
                  borderWidth="2px"
                  p={4}
                  borderRadius="lg"
                  w="100%"
                  boxShadow="0 0 20px rgba(237, 137, 54, 0.3)"
                >
                  <Text color="orange.200" fontSize="sm" fontWeight="bold">
                    🎯 EARLY BIRD ACTIVO - Ahorra $10.000
                  </Text>
                  <Text color="orange.100" fontSize="xs" mt={1}>
                    Válido hasta {new Date(BATTLE_DATA.earlyBirdHasta).toLocaleDateString('es-CO')}
                  </Text>
                </Box>
              )}

              <Button
                size="xl"
                h={{ base: "60px", md: "80px" }}
                fontSize={{ base: "xl", md: "2xl" }}
                w="100%"
                bg="green.500"
                color="white"
                onClick={() => navigate('/battle/register')}
                _hover={{
                  bg: "green.600",
                  transform: "translateY(-4px)",
                  shadow: "0 0 50px rgba(0, 209, 161, 0.6)",
                }}
                transition="all 0.3s"
                boxShadow="0 0 30px rgba(0, 209, 161, 0.4)"
              >
                <HStack>
                  <FaBolt size={28} />
                  <Text>REGISTRARME AHORA</Text>
                </HStack>
              </Button>

              {/* Contador de cupos */}
              <Flex
                justify="space-between"
                align="center"
                w="100%"
                p={5}
                bg="gray.800"
                borderRadius="lg"
                borderWidth="2px"
                borderColor={cuposRestantes < 20 ? "red.500" : "gray.700"}
                boxShadow="0 4px 12px rgba(0,0,0,0.3)"
              >
                <Text fontSize="lg" color="gray.300" fontWeight="medium">
                  Cupos disponibles:
                </Text>
                <Badge
                  colorScheme={cuposRestantes < 20 ? "red" : "green"}
                  fontSize="xl"
                  px={5}
                  py={2}
                  fontWeight="bold"
                >
                  {cuposRestantes}/{BATTLE_DATA.cuposTotal}
                </Badge>
              </Flex>
            </VStack>

            {/* Countdown */}
            {countdown.days > 0 && (
              <Box
                mt={8}
                p={8}
                bg="gray.800"
                borderRadius="2xl"
                borderWidth="2px"
                borderColor="green.500"
                boxShadow="0 0 30px rgba(0, 209, 161, 0.2)"
              >
                <Text fontSize="lg" color="gray.400" mb={6} fontWeight="bold">
                  COMIENZA EN:
                </Text>
                <HStack gap={{ base: 4, md: 8 }} justify="center">
                  <VStack gap={1}>
                    <Text fontSize={{ base: "4xl", md: "6xl" }} fontWeight="black" color="green.400">
                      {countdown.days}
                    </Text>
                    <Text fontSize="sm" color="gray.500" textTransform="uppercase">DÍAS</Text>
                  </VStack>
                  <Text fontSize="5xl" color="gray.600">:</Text>
                  <VStack gap={1}>
                    <Text fontSize={{ base: "4xl", md: "6xl" }} fontWeight="black" color="green.400">
                      {countdown.hours}
                    </Text>
                    <Text fontSize="sm" color="gray.500" textTransform="uppercase">HORAS</Text>
                  </VStack>
                  <Text fontSize="5xl" color="gray.600">:</Text>
                  <VStack gap={1}>
                    <Text fontSize={{ base: "4xl", md: "6xl" }} fontWeight="black" color="green.400">
                      {countdown.minutes}
                    </Text>
                    <Text fontSize="sm" color="gray.500" textTransform="uppercase">MIN</Text>
                  </VStack>
                </HStack>
              </Box>
            )}


          </VStack>
        </Container>
      </Box>

      {/* Resto del contenido se mantiene igual */}
      {/* ¿QUÉ ES UN BATTLE? */}
      <Box bg="gray.900" py={20} id="que-es">
        <Container maxW="container.xl">
          <VStack gap={12}>
            <Heading
              size="2xl"
              color="white"
              textAlign="center"
            >
              ¿Qué es un Battle? 🥊
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w="100%">
              <Box
                bg="gray.800"
                p={8}
                borderRadius="xl"
                borderWidth="2px"
                borderColor="gray.700"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  borderColor: "green.500",
                  transform: "translateY(-8px)",
                  shadow: "2xl"
                }}
              >
                <Text fontSize="6xl" mb={4}>⚔️</Text>
                <Heading size="lg" color="green.400" mb={4}>
                  1 vs 1
                </Heading>
                <Text color="gray.300" lineHeight="1.8">
                  Compites directamente contra otro atleta. No más esperas en heats de 20 personas. Tu rival, el WOD, y tú.
                </Text>
              </Box>

              <Box
                bg="gray.800"
                p={8}
                borderRadius="xl"
                borderWidth="2px"
                borderColor="gray.700"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  borderColor: "green.500",
                  transform: "translateY(-8px)",
                  shadow: "2xl"
                }}
              >
                <Text fontSize="6xl" mb={4}>🏆</Text>
                <Heading size="lg" color="green.400" mb={4}>
                  Bracket
                </Heading>
                <Text color="gray.300" lineHeight="1.8">
                  Formato de eliminación directa estilo torneo. Ganas y avanzas. Pierdes y sales. Simple y emocionante.
                </Text>
              </Box>

              <Box
                bg="gray.800"
                p={8}
                borderRadius="xl"
                borderWidth="2px"
                borderColor="gray.700"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  borderColor: "green.500",
                  transform: "translateY(-8px)",
                  shadow: "2xl"
                }}
              >
                <Text fontSize="6xl" mb={4}>⚡</Text>
                <Heading size="lg" color="green.400" mb={4}>
                  Acción Pura
                </Heading>
                <Text color="gray.300" lineHeight="1.8">
                  Cada match importa. Sin tiempos muertos. Tu familia y amigos pueden seguirlo en vivo. Adrenalina de principio a fin.
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* CATEGORÍAS */}
      <Box bg="gray.850" py={20} id="categorias">
        <Container maxW="container.xl">
          <VStack gap={12}>
            <Heading size="2xl" color="white" textAlign="center">
              Categorías Disponibles
            </Heading>

            <VStack gap={6} w="100%">
              {BATTLE_DATA.categorias.map((cat) => {
                const disponibles = cat.cupos - cat.ocupados;
                const porcentaje = (cat.ocupados / cat.cupos) * 100;

                return (
                  <Box
                    key={cat.nombre}
                    bg="gray.800"
                    p={8}
                    borderRadius="xl"
                    borderWidth="2px"
                    borderColor={disponibles < 5 ? "red.500" : "gray.700"}
                    transition="all 0.3s"
                    _hover={{
                      borderColor: "green.500",
                      transform: "translateX(8px)"
                    }}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      flexWrap="wrap"
                      gap={6}
                    >
                      <VStack align="start" gap={3}>
                        <HStack gap={3}>
                          <Heading size="lg" color="white">
                            {cat.nombre}
                          </Heading>
                          {disponibles < 5 && (
                            <Badge colorScheme="red" fontSize="md" px={3} py={1}>
                              ¡CASI LLENO!
                            </Badge>
                          )}
                        </HStack>
                        <Text fontSize="md" color="gray.400">
                          {cat.ocupados}/{cat.cupos} atletas registrados
                        </Text>
                      </VStack>

                      <VStack align="end" gap={3}>
                        <Text
                          fontSize="3xl"
                          fontWeight="black"
                          color={disponibles < 5 ? "red.400" : "green.400"}
                        >
                          {disponibles} cupos
                        </Text>
                        <Box w="250px" h="12px" bg="gray.700" borderRadius="full" overflow="hidden">
                          <Box
                            w={`${porcentaje}%`}
                            h="100%"
                            bg={disponibles < 5 ? "red.500" : "green.500"}
                            transition="width 0.3s"
                          />
                        </Box>
                      </VStack>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* PREMIOS */}
      <Box bg="gray.900" py={20} id="premios">
        <Container maxW="container.xl">
          <VStack gap={12}>
            <Heading size="2xl" color="white" textAlign="center">
              Premios en Efectivo 💰
            </Heading>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={8} w="100%">
              <Box
                bg="gray.800"
                borderWidth="4px"
                borderColor="yellow.500"
                borderRadius="xl"
                p={10}
                textAlign="center"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  top="-50%"
                  left="-50%"
                  w="200%"
                  h="200%"
                  bg="yellow.500"
                  opacity="0.05"
                  filter="blur(80px)"
                />
                <Text fontSize="7xl" mb={4}>🥇</Text>
                <Heading size="xl" color="yellow.400" mb={4}>
                  1er Lugar
                </Heading>
                <Text fontSize="5xl" fontWeight="black" color="white">
                  ${BATTLE_DATA.premios.primero.toLocaleString('es-CO')}
                </Text>
                <Text fontSize="md" color="gray.400" mt={2}>COP</Text>
              </Box>

              <Box
                bg="gray.800"
                borderWidth="4px"
                borderColor="gray.400"
                borderRadius="xl"
                p={10}
                textAlign="center"
              >
                <Text fontSize="7xl" mb={4}>🥈</Text>
                <Heading size="xl" color="gray.300" mb={4}>
                  2do Lugar
                </Heading>
                <Text fontSize="5xl" fontWeight="black" color="white">
                  ${BATTLE_DATA.premios.segundo.toLocaleString('es-CO')}
                </Text>
                <Text fontSize="md" color="gray.400" mt={2}>COP</Text>
              </Box>

              <Box
                bg="gray.800"
                borderWidth="4px"
                borderColor="orange.600"
                borderRadius="xl"
                p={10}
                textAlign="center"
              >
                <Text fontSize="7xl" mb={4}>🥉</Text>
                <Heading size="xl" color="orange.400" mb={4}>
                  3er Lugar
                </Heading>
                <Text fontSize="5xl" fontWeight="black" color="white">
                  ${BATTLE_DATA.premios.tercero.toLocaleString('es-CO')}
                </Text>
                <Text fontSize="md" color="gray.400" mt={2}>COP</Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* FAQ */}
      <Box bg="gray.850" py={20} id="faq">
        <Container maxW="container.lg">
          <VStack gap={12}>
            <Heading size="2xl" color="white" textAlign="center">
              Preguntas Frecuentes
            </Heading>

            <VStack gap={6} w="100%">
              <Box
                bg="gray.800"
                p={8}
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.700"
                w="100%"
              >
                <Text fontWeight="bold" color="green.400" fontSize="lg" mb={3}>
                  ¿Cómo funciona el formato de eliminación?
                </Text>
                <Text color="gray.300" lineHeight="1.8">
                  Compites 1v1 en WODs cortos e intensos. El ganador de cada match avanza a la siguiente ronda. Es como un torneo deportivo: pierdes y quedas fuera (o vas al bracket de perdedores si hacemos doble eliminación).
                </Text>
              </Box>

              <Box
                bg="gray.800"
                p={8}
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.700"
                w="100%"
              >
                <Text fontWeight="bold" color="green.400" fontSize="lg" mb={3}>
                  ¿Qué nivel necesito para Intermedio?
                </Text>
                <Text color="gray.300" lineHeight="1.8">
                  6 meses a 2 años de experiencia en CrossFit. Debes poder hacer pull-ups sin ayuda y movimientos RX con pesos moderados. Si dudas, escríbenos y te asesoramos.
                </Text>
              </Box>

              <Box
                bg="gray.800"
                p={8}
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.700"
                w="100%"
              >
                <Text fontWeight="bold" color="green.400" fontSize="lg" mb={3}>
                  ¿Cuánto dura el evento?
                </Text>
                <Text color="gray.300" lineHeight="1.8">
                  <strong>Sábado:</strong> 9am - 6pm (Octavos de final y Cuartos de final)
                  <br />
                  <strong>Domingo:</strong> 9am - 3pm (Semifinales, Final + Premiación)
                </Text>
              </Box>

              <Box
                bg="gray.800"
                p={8}
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.700"
                w="100%"
              >
                <Text fontWeight="bold" color="green.400" fontSize="lg" mb={3}>
                  ¿Cuándo se revelan los WODs?
                </Text>
                <Text color="gray.300" lineHeight="1.8">
                  Los WODs se revelarán <strong>1 semana antes del evento</strong> para que puedas practicar y llegar en tu mejor forma. El bracket con tu rival se sortea 2 semanas antes.
                </Text>
              </Box>
            </VStack>
          </VStack>
        </Container>
      </Box>

      {/* CTA FINAL */}
      <Box bg="gray.900" py={20}>
        <Container maxW="container.md">
          <Box
            bg="gray.800"
            p={12}
            borderRadius="2xl"
            borderWidth="3px"
            borderColor="green.500"
            textAlign="center"
            boxShadow="0 0 50px rgba(0, 209, 161, 0.3)"
          >
            <VStack gap={8}>
              <Text fontSize="6xl">🔥</Text>
              <Heading size="3xl" color="white">
                ¿Listo para el reto?
              </Heading>
              <Text fontSize="xl" color="gray.300">
                {cuposRestantes} cupos restantes. No te quedes fuera de la historia.
              </Text>
              
              <Button
                size="xl"
                h="80px"
                fontSize="2xl"
                px={12}
                bg="green.500"
                color="white"
                onClick={() => navigate('/battle/register')}
                _hover={{
                  bg: "green.600",
                  transform: "translateY(-4px)",
                  shadow: "0 0 50px rgba(0, 209, 161, 0.6)",
                }}
                transition="all 0.3s"
              >
                <HStack>
                  <FaTrophy size={28} />
                  <Text>REGISTRARME AHORA</Text>
                </HStack>
              </Button>

              {isEarlyBird && (
                <Text fontSize="sm" color="orange.300">
                  💰 Early Bird activo - Ahorra $10.000
                </Text>
              )}
            </VStack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default WODMatchBattleLanding;