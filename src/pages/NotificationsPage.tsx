import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Card,
  Input,
  Tabs,
  Center,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { FaArrowLeft, FaBell, FaTrash, FaCheck } from "react-icons/fa";
import {
  loadNotificationHistory,
  markNotificationAsRead,
  clearNotificationHistory,
  loadNotificationPreferences,
  saveNotificationPreferences,
  requestNotificationPermission,
  getNotificationPermission,
  areNotificationsSupported,
  sendNotification,
} from "../services/notification.service";
import type { NotificationPreferences, PushNotification } from "../services/notification.service";
import toast from "react-hot-toast";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    loadData();
    checkNotificationPermission();
  }, [currentUser, navigate]);

  const loadData = () => {
    try {
      const history = loadNotificationHistory();
      const prefs = loadNotificationPreferences();

      setNotifications(history);
      setPreferences(prefs);
    } catch (error) {
      console.error("Error loading notification data:", error);
      toast.error("Error al cargar las notificaciones");
    } finally {
      setLoading(false);
    }
  };

  const checkNotificationPermission = () => {
    setNotificationPermission(getNotificationPermission());
  };

  const handleRequestPermission = async () => {
    try {
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        toast.success("¡Notificaciones activadas! 🎉");
      } else {
        toast.error("Permiso de notificaciones denegado");
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
      toast.error("Error al solicitar permisos");
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleClearHistory = () => {
    clearNotificationHistory();
    setNotifications([]);
    toast.success("Historial de notificaciones limpiado");
  };

  const handleSavePreferences = async () => {
    if (!preferences) return;

    setSaving(true);
    try {
      saveNotificationPreferences(preferences);
      toast.success("Preferencias guardadas");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Error al guardar preferencias");
    } finally {
      setSaving(false);
    }
  };

  const handleTestNotification = () => {
    sendNotification(
      'system',
      '¡Notificación de prueba!',
      'Esta es una notificación de prueba para verificar que todo funciona correctamente.',
      { url: '/notifications' }
    );
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    if (!preferences) return;

    setPreferences({
      ...preferences,
      [key]: value
    });
  };

  const updateQuietHours = (field: 'start' | 'end', value: string) => {
    if (!preferences) return;

    setPreferences({
      ...preferences,
      quietHours: {
        ...preferences.quietHours,
        [field]: value
      }
    });
  };

  if (loading) {
    return (
      <Center h="100vh" bg="gray.900">
        <VStack gap={4}>
          <Spinner size="xl" color="green.500" />
          <Text color="gray.400">Cargando notificaciones...</Text>
        </VStack>
      </Center>
    );
  }

  if (!preferences) {
    return (
      <Center h="100vh" bg="gray.900">
        <VStack gap={4}>
          <Text color="gray.400">Error al cargar preferencias</Text>
          <Button colorScheme="green" onClick={() => navigate("/profile")}>
            Volver al perfil
          </Button>
        </VStack>
      </Center>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Box minH="100vh" bg="gray.900" pt="80px" pb={10}>
      <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 6, lg: 8 }}>
        <VStack gap={6} align="stretch">
          {/* Header */}
          <Flex justify="space-between" align="center">
            <Button
              variant="ghost"
              color="gray.400"
              _hover={{ color: "green.400", bg: "gray.700" }}
              onClick={() => navigate(`/profile/${currentUser?.uid}`)}
            >
              <FaArrowLeft style={{ marginRight: '8px' }} />
              Volver al perfil
            </Button>
            <Heading size="lg" color="white">
              Centro de Notificaciones
            </Heading>
            <Box w="120px" />
          </Flex>

          {/* Notification Permission Alert */}
          {!areNotificationsSupported() && (
            <Box p={4} bg="orange.900" borderRadius="md" border="1px solid" borderColor="orange.600">
              <Flex align="start" gap={3}>
                <Text fontSize="lg">⚠️</Text>
                <Box>
                  <Text fontWeight="bold" color="orange.200">Navegador no compatible</Text>
                  <Text color="orange.100" fontSize="sm">
                    Tu navegador no soporta notificaciones push. Prueba con Chrome, Firefox o Edge.
                  </Text>
                </Box>
              </Flex>
            </Box>
          )}

          {areNotificationsSupported() && notificationPermission === 'denied' && (
            <Box p={4} bg="red.900" borderRadius="md" border="1px solid" borderColor="red.600">
              <Flex align="start" gap={3}>
                <Text fontSize="lg">🚫</Text>
                <Box>
                  <Text fontWeight="bold" color="red.200">Notificaciones bloqueadas</Text>
                  <Text color="red.100" fontSize="sm">
                    Las notificaciones están bloqueadas. Habilítalas en la configuración de tu navegador.
                  </Text>
                </Box>
              </Flex>
            </Box>
          )}

          {areNotificationsSupported() && notificationPermission === 'default' && (
            <Box p={4} bg="blue.900" borderRadius="md" border="1px solid" borderColor="blue.600">
              <Flex align="start" gap={3}>
                <Text fontSize="lg">🔔</Text>
                <Box flex={1}>
                  <Text fontWeight="bold" color="blue.200">Activar notificaciones</Text>
                  <Text color="blue.100" fontSize="sm" mb={3}>
                    Recibe notificaciones de nuevas competiciones y recordatorios importantes.
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="green"
                    onClick={handleRequestPermission}
                  >
                    Activar
                  </Button>
                </Box>
              </Flex>
            </Box>
          )}

          {/* Tabs */}
          <Tabs.Root defaultValue="history" colorScheme="green">
            <Tabs.List bg="gray.800" borderColor="gray.700">
              <Tabs.Trigger value="history" color="gray.300">
                Historial
                {unreadCount > 0 && (
                  <Badge ml={2} colorScheme="green" variant="solid">
                    {unreadCount}
                  </Badge>
                )}
              </Tabs.Trigger>
              <Tabs.Trigger value="preferences" color="gray.300">
                Preferencias
              </Tabs.Trigger>
              <Tabs.Trigger value="test" color="gray.300">
                Probar
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="history" pt={6}>
              <VStack gap={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Heading size="md" color="white">
                    Historial de Notificaciones
                  </Heading>
                  {notifications.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme="red"
                      onClick={handleClearHistory}
                    >
                      <FaTrash style={{ marginRight: '6px' }} />
                      Limpiar
                    </Button>
                  )}
                </Flex>

                {notifications.length === 0 ? (
                  <Card.Root bg="gray.800" borderColor="gray.700">
                    <Card.Body textAlign="center" py={12}>
                      <FaBell size={48} color="#4A5568" />
                      <Text color="gray.400" mt={4}>
                        No tienes notificaciones aún
                      </Text>
                      <Text color="gray.500" fontSize="sm">
                        Las nuevas notificaciones aparecerán aquí
                      </Text>
                    </Card.Body>
                  </Card.Root>
                ) : (
                  <VStack gap={3} align="stretch">
                    {notifications.map((notification) => (
                      <Card.Root
                        key={notification.id}
                        bg={notification.read ? "gray.800" : "gray.750"}
                        borderColor={notification.read ? "gray.700" : "green.600"}
                        borderWidth={notification.read ? 1 : 2}
                      >
                        <Card.Body>
                          <Flex justify="space-between" align="start" gap={4}>
                            <VStack align="start" gap={2} flex={1}>
                              <Flex align="center" gap={2}>
                                <Badge
                                  colorScheme={
                                    notification.type === 'competition' ? 'green' :
                                    notification.type === 'reminder' ? 'orange' :
                                    notification.type === 'match' ? 'blue' :
                                    notification.type === 'update' ? 'purple' : 'gray'
                                  }
                                  variant="subtle"
                                >
                                  {notification.type === 'competition' ? '🏆' :
                                   notification.type === 'reminder' ? '⏰' :
                                   notification.type === 'match' ? '🤝' :
                                   notification.type === 'update' ? '📢' : 'ℹ️'}
                                </Badge>
                                <Text fontSize="sm" color="gray.400">
                                  {notification.timestamp.toLocaleDateString('es-CO')}
                                </Text>
                              </Flex>
                              <Heading size="sm" color="white">
                                {notification.title}
                              </Heading>
                              <Text color="gray.300" fontSize="sm">
                                {notification.body}
                              </Text>
                            </VStack>
                            {!notification.read && (
                              <IconButton
                                size="sm"
                                variant="ghost"
                                colorScheme="green"
                                onClick={() => handleMarkAsRead(notification.id)}
                                aria-label="Marcar como leída"
                              >
                                <FaCheck />
                              </IconButton>
                            )}
                          </Flex>
                        </Card.Body>
                      </Card.Root>
                    ))}
                  </VStack>
                )}
              </VStack>
            </Tabs.Content>

            <Tabs.Content value="preferences" pt={6}>
              <VStack gap={6} align="stretch">
                <Heading size="md" color="white">
                  Preferencias de Notificación
                </Heading>

                <Card.Root bg="gray.800" borderColor="gray.700">
                  <Card.Body>
                    <VStack gap={4} align="stretch">
                      <Heading size="sm" color="white">
                        Tipos de Notificación
                      </Heading>

                      {[
                        { key: 'newCompetitions', label: 'Nuevas competiciones cercanas', icon: '🏆' },
                        { key: 'competitionReminders', label: 'Recordatorios de mis competencias', icon: '⏰' },
                        { key: 'partnerMatches', label: 'Matches en Partner Finder', icon: '🤝' },
                        { key: 'competitionUpdates', label: 'Actualizaciones de competencias', icon: '📢' },
                        { key: 'weeklySummary', label: 'Resumen semanal por email', icon: '📧' },
                      ].map(({ key, label, icon }) => (
                        <Flex key={key} justify="space-between" align="center">
                          <HStack>
                            <Text>{icon}</Text>
                            <Text color="gray.300">{label}</Text>
                          </HStack>
                          <input
                            type="checkbox"
                            checked={preferences[key as keyof NotificationPreferences] as boolean}
                            onChange={(e) => updatePreference(key as keyof NotificationPreferences, e.target.checked)}
                            style={{
                              width: '16px',
                              height: '16px',
                              accentColor: '#00D1A1'
                            }}
                          />
                        </Flex>
                      ))}
                    </VStack>
                  </Card.Body>
                </Card.Root>

                <Card.Root bg="gray.800" borderColor="gray.700">
                  <Card.Body>
                    <VStack gap={4} align="stretch">
                      <Heading size="sm" color="white">
                        Horarios y Restricciones
                      </Heading>

                      <Flex justify="space-between" align="center">
                        <Text color="gray.300">Horas de silencio</Text>
                        <input
                          type="checkbox"
                          checked={preferences.quietHours.enabled}
                          onChange={(e) => updatePreference('quietHours', {
                            ...preferences.quietHours,
                            enabled: e.target.checked
                          })}
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#00D1A1'
                          }}
                        />
                      </Flex>

                      {preferences.quietHours.enabled && (
                        <HStack gap={4}>
                          <Box flex={1}>
                            <Text color="gray.400" fontSize="sm" mb={1}>Desde</Text>
                            <Input
                              type="time"
                              value={preferences.quietHours.start}
                              onChange={(e) => updateQuietHours('start', e.target.value)}
                              size="sm"
                              bg="gray.900"
                              borderColor="gray.600"
                            />
                          </Box>
                          <Box flex={1}>
                            <Text color="gray.400" fontSize="sm" mb={1}>Hasta</Text>
                            <Input
                              type="time"
                              value={preferences.quietHours.end}
                              onChange={(e) => updateQuietHours('end', e.target.value)}
                              size="sm"
                              bg="gray.900"
                              borderColor="gray.600"
                            />
                          </Box>
                        </HStack>
                      )}

                      <Flex justify="space-between" align="center">
                        <Text color="gray.300">Solo fines de semana</Text>
                        <input
                          type="checkbox"
                          checked={preferences.weekendsOnly}
                          onChange={(e) => updatePreference('weekendsOnly', e.target.checked)}
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#00D1A1'
                          }}
                        />
                      </Flex>

                      <Flex justify="space-between" align="center">
                        <Text color="gray.300">Solo días de competencia</Text>
                        <input
                          type="checkbox"
                          checked={preferences.competitionDaysOnly}
                          onChange={(e) => updatePreference('competitionDaysOnly', e.target.checked)}
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: '#00D1A1'
                          }}
                        />
                      </Flex>
                    </VStack>
                  </Card.Body>
                </Card.Root>

                <Button
                  colorScheme="green"
                  onClick={handleSavePreferences}
                  loading={saving}
                  alignSelf="flex-end"
                >
                  Guardar Preferencias
                </Button>
              </VStack>
            </Tabs.Content>

            <Tabs.Content value="test" pt={6}>
              <VStack gap={6} align="stretch">
                <Heading size="md" color="white">
                  Probar Notificaciones
                </Heading>

                <Card.Root bg="gray.800" borderColor="gray.700">
                  <Card.Body>
                    <VStack gap={4} align="stretch">
                      <Text color="gray.300">
                        Envía una notificación de prueba para verificar que todo funciona correctamente.
                      </Text>
                      <Button
                        colorScheme="green"
                        onClick={handleTestNotification}
                        alignSelf="flex-start"
                      >
                        <FaBell style={{ marginRight: '8px' }} />
                        Enviar Notificación de Prueba
                      </Button>
                    </VStack>
                  </Card.Body>
                </Card.Root>
              </VStack>
            </Tabs.Content>
          </Tabs.Root>
        </VStack>
      </Box>
    </Box>
  );
};

export default NotificationsPage;