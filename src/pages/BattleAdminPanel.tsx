// src/pages/BattleAdminPanel.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Table,
  Spinner,
  SimpleGrid,
} from '@chakra-ui/react';
import { NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import { FaArrowLeft, FaCheckCircle, FaClock, FaTimesCircle, FaDownload } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { getAllBattleRegistrations } from '../services/mercadopago.service';
import toast from 'react-hot-toast';

interface Registration {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  whatsapp: string;
  category: string;
  registrationCode: string;
  status: string;
  payment: {
    status: string;
    amount: number;
    paidAt?: Date;
  };
  createdAt: Date;
}

interface Stats {
  total: number;
  confirmed: number;
  pending: number;
  byCategory: {
    [key: string]: number;
  };
}

function BattleAdminPanel() {
  const navigate = useNavigate();
  const { currentUser, loadingAuth } = useAuth(); // 👈 OBTENEMOS loadingAuth
  
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  useEffect(() => {
    console.log("🔍 BattleAdminPanel - Estado actual:", {
      loadingAuth,
      currentUser: currentUser?.email,
      hasUser: !!currentUser
    });

    // NO hacer nada mientras está cargando la autenticación
    if (loadingAuth) {
      console.log("⏳ Auth todavía cargando...");
      return;
    }

    // Si ya terminó de cargar y no hay usuario, redirigir
    if (!currentUser) {
      console.log("❌ No hay usuario después de carga - redirigiendo a login");
      navigate('/login');
      return;
    }

    // Si hay usuario y ya terminó de cargar, cargar datos
    console.log("✅ Usuario autenticado - cargando registros");
    loadRegistrations();
  }, [currentUser, loadingAuth, categoryFilter, statusFilter, paymentFilter]); // 👈 AGREGAMOS loadingAuth

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const token = await currentUser!.getIdToken();
      
      const filters: any = {};
      if (categoryFilter) filters.category = categoryFilter;
      if (statusFilter) filters.status = statusFilter;
      if (paymentFilter) filters.paymentStatus = paymentFilter;

      const data = await getAllBattleRegistrations(token, filters);
      
      setRegistrations(data.registrations);
      setStats(data.stats);
      
    } catch (error) {
      console.error('Error al cargar registros:', error);
      toast.error('Error al cargar registros');
    } finally {
      setLoading(false);
    }
  };

  // 👈 AGREGAR: Mostrar loading mientras auth está cargando
  if (loadingAuth) {
    return (
      <Container maxW="container.xl" py={20}>
        <VStack gap={4}>
          <Spinner size="xl" color="green.500" />
          <Text color="gray.400">Verificando autenticación...</Text>
        </VStack>
      </Container>
    );
  }

  const getCategoryName = (code: string) => {
    const names: any = {
      'intermedio-male': 'Intermedio Masculino',
      'intermedio-female': 'Intermedio Femenino',
      'scaled-male': 'Scaled Masculino',
      'scaled-female': 'Scaled Femenino'
    };
    return names[code] || code;
  };

  const getStatusBadge = (status: string) => {
    const config: any = {
      'confirmed': { color: 'green', text: 'Confirmado' },
      'pending_payment': { color: 'orange', text: 'Pendiente Pago' },
      'cancelled': { color: 'red', text: 'Cancelado' },
    };
    const c = config[status] || { color: 'gray', text: status };
    return <Badge colorScheme={c.color}>{c.text}</Badge>;
  };

  const getPaymentBadge = (status: string) => {
    const config: any = {
      'approved': { color: 'green', icon: FaCheckCircle, text: 'Pagado' },
      'pending': { color: 'orange', icon: FaClock, text: 'Pendiente' },
      'rejected': { color: 'red', icon: FaTimesCircle, text: 'Rechazado' },
    };
    const c = config[status] || { color: 'gray', text: status };
    const Icon = c.icon;
    return (
      <HStack gap={1}>
        {Icon && <Icon size={12} />}
        <Badge colorScheme={c.color}>{c.text}</Badge>
      </HStack>
    );
  };

  const exportToCSV = () => {
    const headers = ['Código', 'Nombre', 'Email', 'WhatsApp', 'Categoría', 'Estado', 'Pago', 'Monto', 'Fecha'];
    const rows = registrations.map(r => [
      r.registrationCode,
      `${r.firstName} ${r.lastName}`,
      r.email,
      r.whatsapp,
      getCategoryName(r.category),
      r.status,
      r.payment.status,
      r.payment.amount,
      new Date(r.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registros-battle-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={20}>
        <VStack gap={4}>
          <Spinner size="xl" color="green.500" />
          <Text color="gray.400">Cargando panel admin...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Box minH="100vh" bg="gray.900" py={8}>
      <Container maxW="container.xl">
        <VStack gap={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <Button
              variant="ghost"
              color="gray.400"
              _hover={{ color: "green.400", bg: "gray.700" }}
              onClick={() => navigate('/battle')}
            >
              <FaArrowLeft style={{ marginRight: '8px' }} />
              Volver al evento
            </Button>
            
            <Heading size="xl" color="white">
              Panel Admin - Battle
            </Heading>
            
            <Button
              colorScheme="green"
              size="sm"
              onClick={exportToCSV}
            >
              <FaDownload style={{ marginRight: '6px' }} />
              Exportar CSV
            </Button>
          </HStack>

          {/* Estadísticas */}
          {stats && (
            <SimpleGrid columns={{ base: 1, md: 4 }} gap={6}>
              <Box bg="gray.800" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.700">
                <Text fontSize="3xl" fontWeight="bold" color="green.400">
                  {stats.total}
                </Text>
                <Text color="gray.400">Total Registros</Text>
              </Box>
              
              <Box bg="gray.800" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.700">
                <Text fontSize="3xl" fontWeight="bold" color="green.400">
                  {stats.confirmed}
                </Text>
                <Text color="gray.400">Confirmados</Text>
              </Box>
              
              <Box bg="gray.800" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.700">
                <Text fontSize="3xl" fontWeight="bold" color="orange.400">
                  {stats.pending}
                </Text>
                <Text color="gray.400">Pendientes</Text>
              </Box>
              
              <Box bg="gray.800" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.700">
                <Text fontSize="3xl" fontWeight="bold" color="blue.400">
                  ${(stats.confirmed * 90000).toLocaleString('es-CO')}
                </Text>
                <Text color="gray.400">Ingresos COP</Text>
              </Box>
            </SimpleGrid>
          )}

          {/* Por Categoría */}
          {stats && (
            <Box bg="gray.800" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.700">
              <Heading size="md" mb={4} color="white">
                Registros por Categoría
              </Heading>
              <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
                {Object.entries(stats.byCategory).map(([key, value]) => (
                  <Box key={key}>
                    <Text fontSize="2xl" fontWeight="bold" color="green.400">
                      {value}
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      {getCategoryName(key)}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}

          {/* Filtros */}
          <Box bg="gray.800" p={6} borderRadius="xl" borderWidth="1px" borderColor="gray.700">
            <Heading size="md" mb={4} color="white">
              Filtros
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <Box>
                <Text color="gray.400" fontSize="sm" mb={2}>Categoría</Text>
                <NativeSelectRoot>
                  <NativeSelectField
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    bg="gray.900"
                    borderColor="gray.600"
                    color="white"
                  >
                    <option value="">Todas</option>
                    <option value="intermedio-male">Intermedio Masculino</option>
                    <option value="intermedio-female">Intermedio Femenino</option>
                    <option value="scaled-male">Scaled Masculino</option>
                    <option value="scaled-female">Scaled Femenino</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </Box>

              <Box>
                <Text color="gray.400" fontSize="sm" mb={2}>Estado</Text>
                <NativeSelectRoot>
                  <NativeSelectField
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    bg="gray.900"
                    borderColor="gray.600"
                    color="white"
                  >
                    <option value="">Todos</option>
                    <option value="confirmed">Confirmado</option>
                    <option value="pending_payment">Pendiente Pago</option>
                    <option value="cancelled">Cancelado</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </Box>

              <Box>
                <Text color="gray.400" fontSize="sm" mb={2}>Pago</Text>
                <NativeSelectRoot>
                  <NativeSelectField
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    bg="gray.900"
                    borderColor="gray.600"
                    color="white"
                  >
                    <option value="">Todos</option>
                    <option value="approved">Aprobado</option>
                    <option value="pending">Pendiente</option>
                    <option value="rejected">Rechazado</option>
                  </NativeSelectField>
                </NativeSelectRoot>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Tabla de Registros */}
          <Box bg="gray.800" borderRadius="xl" borderWidth="1px" borderColor="gray.700" overflowX="auto">
            <Table.Root size="sm">
              <Table.Header>
                <Table.Row bg="gray.750">
                  <Table.ColumnHeader color="gray.400">Código</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.400">Nombre</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.400">Email</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.400">WhatsApp</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.400">Categoría</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.400">Estado</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.400">Pago</Table.ColumnHeader>
                  <Table.ColumnHeader color="gray.400">Monto</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {registrations.map((reg) => (
                  <Table.Row key={reg._id} _hover={{ bg: "gray.750" }}>
                    <Table.Cell color="green.400" fontWeight="bold">
                      {reg.registrationCode}
                    </Table.Cell>
                    <Table.Cell color="white">
                      {reg.firstName} {reg.lastName}
                    </Table.Cell>
                    <Table.Cell color="gray.400" fontSize="sm">
                      {reg.email}
                    </Table.Cell>
                    <Table.Cell color="gray.400" fontSize="sm">
                      {reg.whatsapp}
                    </Table.Cell>
                    <Table.Cell color="gray.300">
                      {getCategoryName(reg.category)}
                    </Table.Cell>
                    <Table.Cell>
                      {getStatusBadge(reg.status)}
                    </Table.Cell>
                    <Table.Cell>
                      {getPaymentBadge(reg.payment.status)}
                    </Table.Cell>
                    <Table.Cell color="white" fontWeight="medium">
                      ${reg.payment.amount.toLocaleString('es-CO')}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>

          {registrations.length === 0 && (
            <Box textAlign="center" py={12}>
              <Text color="gray.400" fontSize="lg">
                No hay registros con los filtros seleccionados
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}

export default BattleAdminPanel;