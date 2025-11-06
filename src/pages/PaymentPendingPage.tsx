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
import { FaClock, FaHome } from 'react-icons/fa';

function PaymentPendingPage() {
  const navigate = useNavigate();

  return (
    <Box minH="100vh" bg="gray.900" py={20}>
      <Container maxW="container.md">
        <VStack gap={8} textAlign="center">
          {/* Ícono de pendiente */}
          <Box
            w="120px"
            h="120px"
            borderRadius="full"
            bg="orange.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 0 50px rgba(237, 137, 54, 0.5)"
          >
            <FaClock size={60} color="white" />
          </Box>

          {/* Mensaje principal */}
          <VStack gap={3}>
            <Heading size="2xl" color="white">
              Pago Pendiente
            </Heading>
            <Text fontSize="lg" color="gray.300">
              Tu pago está siendo procesado
            </Text>
          </VStack>

          {/* Información */}
          <Box bg="gray.800" p={8} borderRadius="xl" w="100%">
            <VStack gap={4}>
              <Text color="gray.300" fontSize="lg">
                Estamos esperando la confirmación de tu banco
              </Text>
              <Text color="gray.400">
                Recibirás un email cuando el pago sea aprobado (generalmente en menos de 24 horas)
              </Text>
            </VStack>
          </Box>

          {/* Botón */}
          <Button
            size="lg"
            colorScheme="green"
            w="100%"
            onClick={() => navigate('/')}
          >
            <HStack>
              <FaHome />
              <Text>Volver al inicio</Text>
            </HStack>
          </Button>

          <Text fontSize="sm" color="gray.500">
            Si tienes dudas, contáctanos por WhatsApp
          </Text>
        </VStack>
      </Container>
    </Box>
  );
}


export { PaymentPendingPage };