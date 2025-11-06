import { useState, useEffect } from 'react';
import { getAllCompetitions } from '../services/competition.service';
import { getUserProfile } from '../services/user.service';
import CompetitionCard, { type Competition } from "../components/CompetitionCard";
import { VStack, Spinner, Text, Heading, Box, Button, HStack } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import OnboardingModal from '../components/OnboardingModal';
import { sendNotification } from '../services/notification.service';

function HomePage() {
  const { currentUser } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para onboarding
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checkedProfile, setCheckedProfile] = useState(false);

  // Verificar si el usuario necesita completar su perfil
  useEffect(() => {
    const checkProfile = async () => {
      if (!currentUser || checkedProfile) return;

      try {
        const token = await currentUser.getIdToken();
        const { user } = await getUserProfile(token);
        
        // Mostrar onboarding si el perfil no está completo
        if (!user.profileCompleted && user.onboardingStep < 3) {
          // Esperar 2 segundos antes de mostrar el modal
          setTimeout(() => {
            setShowOnboarding(true);
          }, 2000);
        }
        
        setCheckedProfile(true);
      } catch (error) {
        console.error("Error al verificar perfil:", error);
        setCheckedProfile(true);
      }
    };

    checkProfile();
  }, [currentUser, checkedProfile]);

  // Cargar competiciones
  useEffect(() => {
    const loadCompetitions = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getAllCompetitions();

        if (data && Array.isArray(data.competitions)) {
          setCompetitions(data.competitions);
        } else {
          setCompetitions([]);
          setError("No se encontraron competiciones.");
        }

      } catch (err) {
        console.error("Error al cargar las competiciones:", err);
        setCompetitions([]);
        setError("Error al cargar las competiciones. Inténtalo más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCompetitions();
  }, []);

  if (isLoading) {
    return (
      <VStack justify="center" align="center" minHeight="80vh">
        <Spinner
          size="xl"
          color="green.400"
        />
        <Text mt={4} color="gray.400">Cargando competiciones...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack justify="center" align="center" minHeight="80vh">
        <Heading size="md" color="red.400">Error</Heading>
        <Text color="gray.400">{error}</Text>
      </VStack>
    );
  }

  if (competitions.length === 0) {
    return (
      <>
        <VStack justify="center" align="center" minHeight="80vh" gap={6}>
          <Heading size="md" color="gray.400">No hay competiciones disponibles</Heading>
          <Text color="gray.500">Vuelve a revisar más tarde.</Text>

          {/* Test notification button for demo */}
          {currentUser && (
            <Button
              colorScheme="green"
              variant="outline"
              onClick={() => sendNotification(
                'system',
                '¡Bienvenido a WOD Colombia!',
                'Tu primera notificación push. Las nuevas competiciones aparecerán aquí.',
                { url: '/' }
              )}
            >
              🔔 Probar Notificaciones
            </Button>
          )}
        </VStack>

        {/* Onboarding Modal */}
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          canSkip={true}
        />
      </>
    );
  }

  return (
    <>
      <Box w="100%" py={{ base: 4, md: 6 }}>
        <VStack align="stretch" gap={4}>
          {/* Welcome message with notification test */}
          {currentUser && competitions.length > 0 && (
            <HStack justify="space-between" align="center" w="100%" wrap="wrap" gap={4}>
              <Box>
                <Heading size="lg" color="white" mb={1}>
                  ¡Hola, {currentUser.email?.split('@')[0]}! 👋
                </Heading>
                <Text color="gray.400">
                  {competitions.length} competiciones disponibles esta semana
                </Text>
              </Box>
              <Button
                size="sm"
                variant="outline"
                colorScheme="green"
                onClick={() => sendNotification(
                  'competition',
                  '¡Nuevas competiciones disponibles!',
                  `Hay ${competitions.length} competiciones activas. ¡No te las pierdas!`,
                  { url: '/' }
                )}
              >
                🔔 Notificarme
              </Button>
            </HStack>
          )}

          {competitions.map((comp) => (
            <CompetitionCard
              key={comp._id}
              competition={comp}
            />
          ))}
        </VStack>
      </Box>

      {/* Onboarding Modal */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        canSkip={true}
      />
    </>
  );
}

export default HomePage;