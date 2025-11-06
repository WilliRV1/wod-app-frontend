import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
} from '@chakra-ui/react';
import { FaTimesCircle, FaRedo, FaHome } from 'react-icons/fa';

function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.900" py={20}>
      <Container maxW="container.md">
        <VStack gap={8} textAlign="center">
          {/* Ícono de error */}
          <Box
            w="120px"
            h="120px"
            borderRadius="full"
            bg="red.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 0 50px rgba(229, 62, 62, 0.5)"
          >
            <FaTimesCircle size={60} color="white" />
          </Box>

          {/* Mensaje principal */}
          <VStack gap={3}>
            <Heading size="2xl" color="white">
              Pago Rechazado
            </Heading>
            <Text fontSize="lg" color="gray.300">
              Tu pago no pudo ser procesado
            </Text>
          </VStack>

          {/* Razones comunes */}
          <Box bg="gray.800" p={8} borderRadius="xl" w="100%">
            <Heading size="md" mb={4} color="white">
              Razones comunes
            </Heading>
            <VStack align="start" gap={2}>
              <Text color="gray.400">• Fondos insuficientes</Text>
              <Text color="gray.400">• Datos de tarjeta incorrectos</Text>
              <Text color="gray.400">• Tarjeta rechazada por el banco</Text>
              <Text color="gray.400">• Límite de compra excedido</Text>
            </VStack>
          </Box>

          {/* Botones */}
          <HStack gap={4} w="100%">
            <Button
              flex={1}
              size="lg"
              colorScheme="green"
              onClick={() => navigate('/battle/register')}
            >
              <HStack>
                <FaRedo />
                <Text>Intentar de nuevo</Text>
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
                <Text>Volver al inicio</Text>
              </HStack>
            </Button>
          </HStack>

          <Text fontSize="sm" color="gray.500">
            ¿Necesitas ayuda? Contáctanos por WhatsApp
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}

export default PaymentFailurePage;