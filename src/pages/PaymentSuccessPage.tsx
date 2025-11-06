// src/pages/PaymentSuccessPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Badge,
  Spinner,
} from '@chakra-ui/react';
import { FaCheckCircle, FaTrophy, FaHome } from 'react-icons/fa';
import { checkPaymentStatus } from '../services/mercadopago.service';
import toast from 'react-hot-toast';

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [registrationCode, setRegistrationCode] = useState<string | null>(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Obtener IDs de los query params de MercadoPago
      const paymentId = searchParams.get('payment_id');
      const collectionId = searchParams.get('collection_id');
      
      // O del localStorage si viene directo
      const pendingCode = localStorage.getItem('pending_registration_code');

      if (paymentId || collectionId) {
        // Verificar con el backend
        const { registration } = await checkPaymentStatus(paymentId || collectionId || '');
        
        if (registration) {
          setRegistrationCode(registration.code);
          
          // Limpiar localStorage
          localStorage.removeItem('pending_battle_registration');
          localStorage.removeItem('pending_registration_code');
        }
      } else if (pendingCode) {
        // Usar el código pendiente
        setRegistrationCode(pendingCode);
      }

      setLoading(false);
      toast.success('¡Pago aprobado! 🎉');

    } catch (error) {
      console.error('Error verificando pago:', error);
      setLoading(false);
      toast.error('Error al verificar el pago');
    }
  };

  if (loading) {
    return (
      <Container maxW="container.md" py={20}>
        <VStack gap={6}>
          <Spinner size="xl" color="green.500" />
          <Text color="gray.400">Verificando tu pago...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Box minH="100vh" bg="gray.900" py={20}>
      <Container maxW="container.md">
        <VStack gap={8} textAlign="center">
          {/* Ícono de éxito */}
          <Box
            w="120px"
            h="120px"
            borderRadius="full"
            bg="green.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 0 50px rgba(0, 209, 161, 0.5)"
          >
            <FaCheckCircle size={60} color="white" />
          </Box>

          {/* Mensaje principal */}
          <VStack gap={3}>
            <Heading size="3xl" color="white">
              ¡Estás DENTRO!
            </Heading>
            <Text fontSize="xl" color="gray.300">
              Tu pago ha sido procesado exitosamente
            </Text>
          </VStack>

          {/* Fighter Card */}
          {registrationCode && (
            <Box
              bg="gray.800"
              borderWidth="3px"
              borderColor="green.500"
              borderRadius="2xl"
              p={8}
              boxShadow="0 0 40px rgba(0, 209, 161, 0.3)"
              w="100%"
            >
              <VStack gap={4}>
                <Text fontSize="sm" color="gray.400" textTransform="uppercase">
                  Tu Fighter Code
                </Text>
                <Badge
                  colorScheme="green"
                  fontSize="2xl"
                  px={6}
                  py={3}
                  borderRadius="full"
                >
                  {registrationCode}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  Guarda este código - lo necesitarás el día del evento
                </Text>
              </VStack>
            </Box>
          )}

          {/* Próximos pasos */}
          <Box bg="gray.800" p={8} borderRadius="xl" w="100%">
            <Heading size="lg" mb={6} color="white">
              📅 Próximos pasos
            </Heading>
            
            <VStack gap={4} align="start">
              <HStack gap={3}>
                <Box color="green.400">
                  <FaCheckCircle size={20} />
                </Box>
                <Text color="gray.300">
                  <strong>Revisa tu email</strong> - Confirmación enviada
                </Text>
              </HStack>

              <HStack gap={3}>
                <Box color="green.400">
                  <FaCheckCircle size={20} />
                </Box>
                <Text color="gray.300">
                  <strong>Únete al grupo de WhatsApp</strong> - Link en el email
                </Text>
              </HStack>

              <HStack gap={3}>
                <Box color="green.400">
                  <FaCheckCircle size={20} />
                </Box>
                <Text color="gray.300">
                  <strong>WODs revelados</strong> - 1 semana antes del evento
                </Text>
              </HStack>

              <HStack gap={3}>
                <Box color="green.400">
                  <FaCheckCircle size={20} />
                </Box>
                <Text color="gray.300">
                  <strong>Bracket Reveal</strong> - 2 semanas antes
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Botones de acción */}
          <HStack gap={4} w="100%">
            <Button
              flex={1}
              size="lg"
              colorScheme="green"
              onClick={() => navigate('/battle')}
            >
              <HStack>
                <FaTrophy />
                <Text>Ver Evento</Text>
              </HStack>
            </Button>
            
            <Button
              flex={1}
              size="lg"
              variant="outline"
              colorScheme="gray"
              onClick={() => navigate('/')}
            >
              <HStack>
                <FaHome />
                <Text>Inicio</Text>
              </HStack>
            </Button>
          </HStack>

          {/* Info adicional */}
          <Box
            mt={6}
            p={6}
            bg="blue.900"
            borderRadius="xl"
            borderWidth="2px"
            borderColor="blue.500"
            w="100%"
          >
            <VStack gap={3} textAlign="center">
              <Text color="blue.200" fontWeight="bold" fontSize="lg">
                💪 ¿Listo para entrenar?
              </Text>
              <Text color="blue.100" fontSize="sm">
                Los WODs se revelarán 1 semana antes. ¡Empieza a prepararte!
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default PaymentSuccessPage;