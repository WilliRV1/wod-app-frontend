import React, { useState, useEffect } from 'react';
import { createBattleRegistration, createPaymentPreference, openMercadoPagoCheckout } from '../services/mercadopago.service';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  SimpleGrid,
  Input,
  Textarea,
  Flex,
  Progress,
} from '@chakra-ui/react';
import toast from 'react-hot-toast';
import { Field } from '@chakra-ui/react';
import { FaCheck, FaCheckCircle, FaArrowRight, FaArrowLeft, FaTrophy, FaUsers } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

// Add these type definitions
type BattleRegistrationData = {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  whatsapp: string;
  category: "intermedio-male" | "intermedio-female" | "scaled-male" | "scaled-female";
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  medicalConditions: string;
  medications: string;
  waiverAccepted: boolean;
  imageAuthorized: boolean;
  amount: number;
};


// DATOS DE EJEMPLO (después vendrán del backend) - AÑADE ESTO
const CATEGORIES = [
  {
    id: 'intermedio-male',
    name: 'Intermedio Masculino',
    description: 'Para atletas con experiencia',
    requirements: [
      'Pull-ups sin ayuda',
      'HSPU o push-ups elevados',
      'Back Squat > 80kg',
      '6 meses - 2 años de CrossFit'
    ],
    spots: 12,
    total: 16,
    color: 'orange'
  },
  {
    id: 'intermedio-female',
    name: 'Intermedio Femenino',
    description: 'Para atletas con experiencia',
    requirements: [
      'Pull-ups con banda o ring rows',
      'Push-ups estrictos',
      'Back Squat > 60kg',
      '6 meses - 2 años de CrossFit'
    ],
    spots: 8,
    total: 16,
    color: 'orange'
  },
  {
    id: 'scaled-male',
    name: 'Scaled Masculino',
    description: 'Tu primer battle',
    requirements: [
      'Ring rows o pull-ups asistidos',
      'Push-ups (rodillas ok)',
      'Back Squat > 60kg',
      'Cualquier nivel de experiencia'
    ],
    spots: 14,
    total: 16,
    color: 'green'
  },
  {
    id: 'scaled-female',
    name: 'Scaled Femenino',
    description: 'Tu primer battle',
    requirements: [
      'Ring rows',
      'Push-ups inclinados',
      'Back Squat > 40kg',
      'Cualquier nivel de experiencia'
    ],
    spots: 10,
    total: 16,
    color: 'green'
  }
];

// AÑADE ESTO TAMBIÉN
const STEPS = ['Categoría', 'Datos', 'Médico', 'Pago', 'Confirmación'];

function BattleRegistration() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<"intermedio-male" | "intermedio-female" | "scaled-male" | "scaled-female">("intermedio-male");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [, setIsLoading] = useState(false); // Add missing state
  
  // Define precio as a constant
  const precio = 90000;

  const [formData, setFormData] = useState({
    // Datos personales
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    whatsapp: '',
    
    // Contacto de emergencia
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    
    // Médico
    medicalConditions: '',
    medications: '',
    
    // Waivers
    waiverAccepted: false,
    imageAuthorized: false
  });

  // AÑADE ESTE EFFECT PARA PRE-LLENAR DATOS DEL USUARIO
  useEffect(() => {
    if (currentUser && currentUser.email) {
      setFormData(prev => ({
        ...prev,
        email: currentUser.email || '',
      }));
    }
  }, [currentUser]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0: // Categoría
        if (!selectedCategory) newErrors.category = 'Selecciona una categoría';
        break;
      
      case 1: // Datos personales
        if (!formData.firstName.trim()) newErrors.firstName = 'Nombre requerido';
        if (!formData.lastName.trim()) newErrors.lastName = 'Apellido requerido';
        if (!formData.birthDate) newErrors.birthDate = 'Fecha requerida';
        if (!formData.email.trim()) newErrors.email = 'Email requerido';
        if (!formData.whatsapp.trim()) newErrors.whatsapp = 'WhatsApp requerido';
        
        // Validar formato email
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'Email inválido';
        }
        
        // Validar edad (mayor de 18)
        if (formData.birthDate) {
          const birthDate = new Date(formData.birthDate);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 18) {
            newErrors.birthDate = 'Debes ser mayor de 18 años';
          }
        }
        break;
      
      case 2: // Médico
        if (!formData.emergencyName.trim()) newErrors.emergencyName = 'Nombre requerido';
        if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Teléfono requerido';
        if (!formData.waiverAccepted) newErrors.waiver = 'Debes aceptar el waiver';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // MODIFICA LA FUNCIÓN handleNext
  const handleNext = () => {
    // Verificar autenticación en el paso 0
    if (currentStep === 0 && !currentUser) {
      navigate('/login', { 
        state: { 
          from: '/battle/register',
          message: 'Inicia sesión para completar tu registro en WODMATCH BATTLE'
        }
      });
      return;
    }

    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayment = async () => {
  if (!currentUser) {
    toast.error("Debes iniciar sesión");
    navigate('/login', {
      state: {
        from: '/battle/register',
        message: 'Inicia sesión para completar tu inscripción'
      }
    });
    return;
  }
  setIsLoading(true);

  try {
    // PASO 1: Crear el registro en la base de datos
    const loadingToast = toast.loading("Creando tu registro...");
    
    const token = await currentUser.getIdToken();
    const registrationData: BattleRegistrationData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      birthDate: formData.birthDate,
      email: formData.email,
      whatsapp: formData.whatsapp,
      category: selectedCategory,
      emergencyName: formData.emergencyName,
      emergencyPhone: formData.emergencyPhone,
      emergencyRelation: formData.emergencyRelation,
      medicalConditions: formData.medicalConditions,
      medications: formData.medications,
      waiverAccepted: formData.waiverAccepted,
      imageAuthorized: formData.imageAuthorized,
      amount: precio
    };

    const { registration } = await createBattleRegistration(registrationData, token);

console.log("✅ Registro creado:", registration);
    toast.dismiss(loadingToast);
    toast.success("Registro creado");

    // PASO 2: Crear preferencia de pago en MercadoPago
    const paymentToast = toast.loading("Preparando pago...");

    const preference = await createPaymentPreference(
      registration.id,
      {
        amount: precio,
        title: `WOD MATCH BATTLE - ${getCategoryData()?.name}`,
        description: `Inscripción Temporada 1 - ${formData.firstName} ${formData.lastName}`,
        payer: {
          name: formData.firstName,
          surname: formData.lastName,
          email: formData.email,
          phone: formData.whatsapp
        }
      }
    );

    console.log("✅ Preferencia creada:", preference.id);
    toast.dismiss(paymentToast);

    // PASO 3: Redirigir a MercadoPago
    toast.success("Redirigiendo a MercadoPago...");

    // Guardar el registration ID en localStorage para recuperarlo después
    localStorage.setItem('pending_battle_registration', registration.id);
    localStorage.setItem('pending_registration_code', registration.code);

    // Abrir checkout de MercadoPago
    await openMercadoPagoCheckout(preference.id);

  } catch (error: any) {
    console.error("Error al procesar pago:", error);
    toast.error(error.message || "Error al procesar el pago. Intenta de nuevo.");
  } finally {
    setIsLoading(false);
    // Cerrar cualquier toast de loading
    toast.dismiss();
  }
};

  const getCategoryData = () => {
    return CATEGORIES.find(c => c.id === selectedCategory);
  };

  // AÑADE UN INDICADOR DE USUARIO LOGUEADO EN EL PASO 0
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // CATEGORÍA
        return (
          <VStack gap={8} align="stretch">
            <Box textAlign="center">
              <Heading size="2xl" color="white" mb={3}>
                Elige tu categoría
              </Heading>
              <Text color="gray.400" fontSize="lg">
                Selecciona según tus habilidades actuales
              </Text>
              
              {/* Indicador de WODMATCH BATTLE */}
              <Box
                mt={4}
                p={3}
                bg="orange.900"
                borderColor="orange.500"
                borderWidth="1px"
                borderRadius="md"
                display="inline-block"
              >
                <Text color="orange.200" fontSize="sm" fontWeight="medium">
                  🥊 Registro para WODMATCH BATTLE
                </Text>
              </Box>

              {/* AÑADE ESTE INDICADOR DE AUTENTICACIÓN */}
              {currentUser && (
                <Box
                  mt={4}
                  p={3}
                  bg="green.900"
                  borderColor="green.500"
                  borderWidth="1px"
                  borderRadius="md"
                  display="inline-block"
                >
                  <Text color="green.200" fontSize="sm" fontWeight="medium">
                    ✅ Conectado como: {currentUser.email}
                  </Text>
                </Box>
              )}
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
              {CATEGORIES.map((category) => {
                const isSelected = selectedCategory === category.id;
                const disponibles = category.total - category.spots;
                
                return (
                  <Box
                    key={category.id}
                    bg={isSelected ? "gray.800" : "gray.850"}
                    borderWidth="3px"
                    borderColor={isSelected ? "green.500" : "gray.700"}
                    borderRadius="xl"
                    p={6}
                    cursor="pointer"
                    onClick={() => setSelectedCategory(category.id as any)}
                    transition="all 0.2s"
                    _hover={{
                      borderColor: "green.500",
                      transform: "translateY(-4px)",
                      shadow: "2xl"
                    }}
                    position="relative"
                  >
                    {isSelected && (
                      <Box
                        position="absolute"
                        top={4}
                        right={4}
                        color="green.400"
                      >
                        <FaCheckCircle size={28} />
                      </Box>
                    )}

                    <VStack align="start" gap={4}>
                      <HStack justify="space-between" w="100%">
                        <Badge
                          colorScheme={disponibles < 5 ? "red" : category.color}
                          fontSize="sm"
                          px={3}
                          py={1}
                        >
                          {disponibles} cupos disponibles
                        </Badge>
                      </HStack>

                      <Heading size="lg" color="white">
                        {category.name}
                      </Heading>

                      <Text color="gray.400" fontSize="sm">
                        {category.description}
                      </Text>

                      <Box w="100%" pt={2}>
                        <Text fontSize="xs" color="gray.500" mb={2} fontWeight="bold">
                          REQUISITOS:
                        </Text>
                        <VStack align="start" gap={1}>
                          {category.requirements.map((req, i) => (
                            <HStack key={i} gap={2}>
                              <Text color="green.400" fontSize="lg">•</Text>
                              <Text color="gray.400" fontSize="sm">{req}</Text>
                            </HStack>
                          ))}
                        </VStack>
                      </Box>
                    </VStack>
                  </Box>
                );
              })}
            </SimpleGrid>

            {errors.category && (
              <Box
                bg="red.900"
                borderColor="red.500"
                borderWidth="2px"
                borderRadius="md"
                p={4}
                textAlign="center"
              >
                <Text color="red.200" fontWeight="bold">
                  {errors.category}
                </Text>
              </Box>
            )}
          </VStack>
        );

      case 1: // DATOS PERSONALES
        return (
          <VStack gap={8} align="stretch" maxW="700px" mx="auto">
            <Box textAlign="center">
              <Heading size="2xl" color="white" mb={3}>
                Datos del atleta
              </Heading>
              <Text color="gray.400" fontSize="lg">
                Información básica para tu inscripción
              </Text>
              
              {/* AÑADE ESTE INDICADOR TAMBIÉN EN EL PASO 1 */}
              {currentUser && (
                <Box
                  mt={4}
                  p={3}
                  bg="green.900"
                  borderColor="green.500"
                  borderWidth="1px"
                  borderRadius="md"
                  display="inline-block"
                >
                  <Text color="green.200" fontSize="sm" fontWeight="medium">
                    ✅ Conectado como: {currentUser.email}
                  </Text>
                </Box>
              )}
            </Box>

            <Box bg="gray.800" p={8} borderRadius="xl" borderWidth="1px" borderColor="gray.700">
              <VStack gap={6} align="stretch">
                {/* Nombre y Apellido */}
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                  <Field.Root invalid={!!errors.firstName}>
                    <Field.Label color="gray.300" fontSize="md">
                      Nombre <Text as="span" color="red.400">*</Text>
                    </Field.Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Juan"
                      size="lg"
                      bg="gray.900"
                      borderColor="gray.600"
                      _hover={{ borderColor: "green.500" }}
                      _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px #00D1A1" }}
                      color="white"
                    />
                    {errors.firstName && (
                      <Text color="red.400" fontSize="sm" mt={1}>{errors.firstName}</Text>
                    )}
                  </Field.Root>

                  <Field.Root invalid={!!errors.lastName}>
                    <Field.Label color="gray.300" fontSize="md">
                      Apellido <Text as="span" color="red.400">*</Text>
                    </Field.Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Pérez"
                      size="lg"
                      bg="gray.900"
                      borderColor="gray.600"
                      _hover={{ borderColor: "green.500" }}
                      _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px #00D1A1" }}
                      color="white"
                    />
                    {errors.lastName && (
                      <Text color="red.400" fontSize="sm" mt={1}>{errors.lastName}</Text>
                    )}
                  </Field.Root>
                </SimpleGrid>

                {/* Fecha y Email */}
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                  <Field.Root invalid={!!errors.birthDate}>
                    <Field.Label color="gray.300" fontSize="md">
                      Fecha de nacimiento <Text as="span" color="red.400">*</Text>
                    </Field.Label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      size="lg"
                      bg="gray.900"
                      borderColor="gray.600"
                      _hover={{ borderColor: "green.500" }}
                      _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px #00D1A1" }}
                      color="white"
                      max={new Date().toISOString().split('T')[0]}
                    />
                    {errors.birthDate && (
                      <Text color="red.400" fontSize="sm" mt={1}>{errors.birthDate}</Text>
                    )}
                  </Field.Root>

                  <Field.Root invalid={!!errors.email}>
                    <Field.Label color="gray.300" fontSize="md">
                      Email <Text as="span" color="red.400">*</Text>
                    </Field.Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="juan@ejemplo.com"
                      size="lg"
                      bg="gray.900"
                      borderColor="gray.600"
                      _hover={{ borderColor: "green.500" }}
                      _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px #00D1A1" }}
                      color="white"
                    />
                    {errors.email && (
                      <Text color="red.400" fontSize="sm" mt={1}>{errors.email}</Text>
                    )}
                  </Field.Root>
                </SimpleGrid>

                {/* WhatsApp */}
                <Field.Root invalid={!!errors.whatsapp}>
                  <Field.Label color="gray.300" fontSize="md">
                    WhatsApp <Text as="span" color="red.400">*</Text>
                  </Field.Label>
                  <Input
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    placeholder="+57 300 123 4567"
                    size="lg"
                    bg="gray.900"
                    borderColor="gray.600"
                    _hover={{ borderColor: "green.500" }}
                    _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px #00D1A1" }}
                    color="white"
                  />
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    Te enviaremos actualizaciones del evento por WhatsApp
                  </Text>
                  {errors.whatsapp && (
                    <Text color="red.400" fontSize="sm" mt={1}>{errors.whatsapp}</Text>
                  )}
                </Field.Root>
              </VStack>
            </Box>
          </VStack>
        );

      case 2: // MÉDICO + WAIVER
        return (
          <VStack gap={8} align="stretch" maxW="700px" mx="auto">
            <Box textAlign="center">
              <Heading size="2xl" color="white" mb={3}>
                Información médica
              </Heading>
              <Text color="gray.400" fontSize="lg">
                Para tu seguridad durante el evento
              </Text>
            </Box>

            {/* Contacto de Emergencia */}
            <Box bg="gray.800" p={8} borderRadius="xl" borderWidth="1px" borderColor="gray.700">
              <Heading size="lg" color="green.400" mb={6}>
                🚨 Contacto de emergencia
              </Heading>
              
              <VStack gap={6} align="stretch">
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                  <Field.Root invalid={!!errors.emergencyName}>
                    <Field.Label color="gray.300">
                      Nombre completo <Text as="span" color="red.400">*</Text>
                    </Field.Label>
                    <Input
                      value={formData.emergencyName}
                      onChange={(e) => handleInputChange('emergencyName', e.target.value)}
                      placeholder="María López"
                      size="lg"
                      bg="gray.900"
                      borderColor="gray.600"
                      _hover={{ borderColor: "green.500" }}
                      _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px #00D1A1" }}
                      color="white"
                    />
                    {errors.emergencyName && (
                      <Text color="red.400" fontSize="sm" mt={1}>{errors.emergencyName}</Text>
                    )}
                  </Field.Root>

                  <Field.Root invalid={!!errors.emergencyPhone}>
                    <Field.Label color="gray.300">
                      Teléfono <Text as="span" color="red.400">*</Text>
                    </Field.Label>
                    <Input
                      value={formData.emergencyPhone}
                      onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                      placeholder="+57 300 123 4567"
                      size="lg"
                      bg="gray.900"
                      borderColor="gray.600"
                      _hover={{ borderColor: "green.500" }}
                      _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px #00D1A1" }}
                      color="white"
                    />
                    {errors.emergencyPhone && (
                      <Text color="red.400" fontSize="sm" mt={1}>{errors.emergencyPhone}</Text>
                    )}
                  </Field.Root>
                </SimpleGrid>

                <Field.Root>
                  <Field.Label color="gray.300">Parentesco</Field.Label>
                  <Input
                    value={formData.emergencyRelation}
                    onChange={(e) => handleInputChange('emergencyRelation', e.target.value)}
                    placeholder="Madre, Esposo, Hermano, etc."
                    size="lg"
                    bg="gray.900"
                    borderColor="gray.600"
                    _hover={{ borderColor: "green.500" }}
                    _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px #00D1A1" }}
                    color="white"
                  />
                </Field.Root>
              </VStack>
            </Box>

            {/* Información Médica */}
            <Box bg="gray.800" p={8} borderRadius="xl" borderWidth="1px" borderColor="gray.700">
              <Heading size="lg" color="green.400" mb={6}>
                ⚕️ Condiciones médicas
              </Heading>
              
              <VStack gap={6} align="stretch">
                <Field.Root>
                  <Field.Label color="gray.300">
                    ¿Tienes alguna condición médica relevante?
                  </Field.Label>
                  <Textarea
                    value={formData.medicalConditions}
                    onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                    placeholder="Asma, alergias, lesiones recientes, etc. (opcional)"
                    rows={3}
                    bg="gray.900"
                    borderColor="gray.600"
                    _hover={{ borderColor: "green.500" }}
                    _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px #00D1A1" }}
                    color="white"
                  />
                  <Text fontSize="xs" color="gray.500" mt={2}>
                    Esta información es confidencial y solo para emergencias
                  </Text>
                </Field.Root>

                <Field.Root>
                  <Field.Label color="gray.300">
                    ¿Tomas algún medicamento regularmente?
                  </Field.Label>
                  <Input
                    value={formData.medications}
                    onChange={(e) => handleInputChange('medications', e.target.value)}
                    placeholder="Ninguno / Lista de medicamentos (opcional)"
                    size="lg"
                    bg="gray.900"
                    borderColor="gray.600"
                    _hover={{ borderColor: "green.500" }}
                    _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px #00D1A1" }}
                    color="white"
                  />
                </Field.Root>
              </VStack>
            </Box>

            {/* Waiver */}
            <Box bg="gray.800" p={8} borderRadius="xl" borderWidth="1px" borderColor="gray.700">
              <Heading size="lg" color="green.400" mb={6}>
                📋 Términos y condiciones
              </Heading>

              <Box
                bg="gray.900"
                p={6}
                borderRadius="md"
                maxH="250px"
                overflowY="auto"
                mb={6}
                borderWidth="1px"
                borderColor="gray.700"
              >
                <Text fontSize="sm" color="gray.300" lineHeight="1.8">
                  <strong>WAIVER DE RESPONSABILIDAD - WOD MATCH BATTLE</strong>
                  <br /><br />
                  Al participar en este evento, yo <strong>{formData.firstName} {formData.lastName}</strong> declaro que:
                  <br /><br />
                  1. <strong>Estado de salud:</strong> Estoy en condiciones físicas adecuadas para competir en CrossFit de alta intensidad.
                  <br /><br />
                  2. <strong>Riesgos:</strong> Entiendo que el CrossFit involucra riesgos inherentes de lesiones.
                  <br /><br />
                  3. <strong>Responsabilidad:</strong> Libero de toda responsabilidad a los organizadores, jueces, y venue por lesiones o daños durante el evento.
                  <br /><br />
                  4. <strong>Emergencias:</strong> Autorizo tratamiento médico de emergencia si es necesario.
                  <br /><br />
                  5. <strong>Reglamento:</strong> Me comprometo a seguir todas las reglas y decisiones de los jueces.
                </Text>
              </Box>

              <VStack gap={4} align="start">
                <HStack
                  gap={3}
                  align="start"
                  p={4}
                  bg={formData.waiverAccepted ? "green.900" : "gray.900"}
                  borderRadius="md"
                  borderWidth="2px"
                  borderColor={formData.waiverAccepted ? "green.500" : errors.waiver ? "red.500" : "gray.700"}
                  w="100%"
                  cursor="pointer"
                  onClick={() => handleInputChange('waiverAccepted', !formData.waiverAccepted)}
                  transition="all 0.2s"
                >
                  <Box
                    w="24px"
                    h="24px"
                    borderRadius="md"
                    borderWidth="2px"
                    borderColor={formData.waiverAccepted ? "green.400" : "gray.600"}
                    bg={formData.waiverAccepted ? "green.500" : "transparent"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    {formData.waiverAccepted && <FaCheck color="white" size={14} />}
                  </Box>
                  <Text color="white" fontSize="sm" fontWeight="medium">
                    He leído y acepto los términos del waiver <Text as="span" color="red.400">*</Text>
                  </Text>
                </HStack>

                {errors.waiver && (
                  <Text color="red.400" fontSize="sm">{errors.waiver}</Text>
                )}

                <HStack
                  gap={3}
                  align="start"
                  p={4}
                  bg={formData.imageAuthorized ? "green.900" : "gray.900"}
                  borderRadius="md"
                  borderWidth="2px"
                  borderColor={formData.imageAuthorized ? "green.500" : "gray.700"}
                  w="100%"
                  cursor="pointer"
                  onClick={() => handleInputChange('imageAuthorized', !formData.imageAuthorized)}
                  transition="all 0.2s"
                >
                  <Box
                    w="24px"
                    h="24px"
                    borderRadius="md"
                    borderWidth="2px"
                    borderColor={formData.imageAuthorized ? "green.400" : "gray.600"}
                    bg={formData.imageAuthorized ? "green.500" : "transparent"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    {formData.imageAuthorized && <FaCheck color="white" size={14} />}
                  </Box>
                  <VStack align="start" gap={1}>
                    <Text color="white" fontSize="sm" fontWeight="medium">
                      Autorizo el uso de mi imagen
                    </Text>
                    <Text color="gray.500" fontSize="xs">
                      Para fotos/videos en redes sociales del evento (opcional)
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        );

      case 3: // PAGO
        const categoryData = getCategoryData();
        return (
          <VStack gap={8} align="stretch" maxW="600px" mx="auto">
            <Box textAlign="center">
              <Heading size="2xl" color="white" mb={3}>
                ¡Estás a un paso!
              </Heading>
              <Text color="gray.400" fontSize="lg">
                Confirma tu inscripción con el pago
              </Text>
            </Box>

            {/* Resumen */}
            <Box bg="gray.800" p={8} borderRadius="xl" borderWidth="2px" borderColor="green.500">
              <Heading size="lg" color="white" mb={6}>
                📋 Resumen de inscripción
              </Heading>
              
              <VStack gap={4} align="stretch">
                <Flex justify="space-between" align="center">
                  <Text color="gray.400">Evento</Text>
                  <Text color="white" fontWeight="bold">WOD Match Battle #1</Text>
                </Flex>

                <Flex justify="space-between" align="center">
                  <Text color="gray.400">Categoría</Text>
                  <Badge colorScheme="green" fontSize="md" px={3} py={1}>
                    {categoryData?.name}
                  </Badge>
                </Flex>

                <Flex justify="space-between" align="center">
                  <Text color="gray.400">Atleta</Text>
                  <Text color="white">{formData.firstName} {formData.lastName}</Text>
                </Flex>

                <Flex justify="space-between" align="center">
                  <Text color="gray.400">Email</Text>
                  <Text color="white" fontSize="sm">{formData.email}</Text>
                </Flex>

                <Box h="1px" bg="gray.700" my={2} />

                <Flex justify="space-between" align="center">
                  <Text color="white" fontSize="xl" fontWeight="bold">TOTAL</Text>
                  <Text color="green.400" fontSize="2xl" fontWeight="bold">
                    $90.000 COP
                  </Text>
                </Flex>
              </VStack>
            </Box>

            {/* Métodos de pago */}
            <Box bg="gray.800" p={8} borderRadius="xl" borderWidth="1px" borderColor="gray.700">
              <Heading size="lg" color="white" mb={6}>
                💳 Método de pago
              </Heading>

              <VStack gap={4}>
                <Button
                  w="100%"
                  h="70px"
                  colorScheme="green"
                  fontSize="xl"
                  onClick={handlePayment}
                  _hover={{
                    transform: "translateY(-2px)",
                    shadow: "2xl"
                  }}
                >
                  <HStack>
                    <Text>💳</Text>
                    <Text>Pagar con MercadoPago</Text>
                  </HStack>
                </Button>
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  PSE • Tarjetas • Nequi • Daviplata • Efecty
                </Text>

                <Box
                  w="100%"
                  p={6}
                  bg="blue.900"
                  borderRadius="md"
                  borderWidth="2px"
                  borderColor="blue.500"
                >
                  <VStack gap={3} align="start">
                    <Text color="blue.200" fontWeight="bold">
                      💡 ¿Prefieres transferencia bancaria?
                    </Text>
                    <Text color="blue.100" fontSize="sm">
                      Haz tu transferencia y envía el comprobante para validación manual (24-48h)
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor="blue.400"
                      color="blue.300"
                      onClick={() => alert('Bancolombia - Ahorros\n123456789\nTitular: WOD Match Battle\nReferencia: WM-' + Math.random().toString(36).substr(2, 9).toUpperCase())}
                    >
                      Ver datos bancarios
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </VStack>
        );

      case 4: // CONFIRMACIÓN
        const code = 'WM-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        return (
          <VStack gap={8} align="stretch" maxW="600px" mx="auto" textAlign="center">
            <Box>
              <Text fontSize="7xl" mb={4}>🎉</Text>
              <Heading size="3xl" color="white" mb={4}>
                ¡Estás DENTRO!
              </Heading>
              <Text color="gray.300" fontSize="xl">
                Tu Fighter Card está lista
              </Text>
            </Box>

            {/* Fighter Card */}
            <Box
              bg="gray.800"
              borderRadius="2xl"
              borderWidth="3px"
              borderColor="green.500"
              p={8}
              boxShadow="0 0 40px rgba(0, 209, 161, 0.3)"
            >
              <VStack gap={6}>
                <Box
                  w="120px"
                  h="120px"
                  borderRadius="full"
                  bg="green.500"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  color="white"
                  fontSize="4xl"
                  fontWeight="bold"
                  boxShadow="0 0 30px rgba(0, 209, 161, 0.5)"
                >
                  {formData.firstName?.charAt(0)}{formData.lastName?.charAt(0)}
                </Box>

                <VStack gap={2}>
                  <Heading size="xl" color="white">
                    {formData.firstName} {formData.lastName}
                  </Heading>
                  <Text color="green.400" fontSize="lg">
                    {getCategoryData()?.name}
                  </Text>
                  <Badge
                    colorScheme="green"
                    fontSize="lg"
                    px={4}
                    py={2}
                    borderRadius="full"
                  >
                    {code}
                  </Badge>
                </VStack>
              </VStack>
            </Box>

            {/* Próximos pasos */}
            <Box bg="gray.800" p={8} borderRadius="xl" borderWidth="1px" borderColor="gray.700">
              <Heading size="lg" color="white" mb={6}>
                📅 Próximos pasos
              </Heading>
              
              <VStack gap={4} align="start">
                <HStack gap={3}>
                  <Box color="green.400">
                    <FaCheck size={20} />
                  </Box>
                  <Text color="gray.300">
                    <strong>Revisa tu email</strong> - Confirmación enviada
                  </Text>
                </HStack>

                <HStack gap={3}>
                  <Box color="green.400">
                    <FaCheck size={20} />
                  </Box>
                  <Text color="gray.300">
                    <strong>Únete al grupo</strong> - Link en el email
                  </Text>
                </HStack>

                <HStack gap={3}>
                  <Box color="green.400">
                    <FaCheck size={20} />
                  </Box>
                  <Text color="gray.300">
                    <strong>Bracket reveal</strong> - 20 Enero 2026
                  </Text>
                </HStack>

                <HStack gap={3}>
                  <Box color="green.400">
                    <FaCheck size={20} />
                  </Box>
                  <Text color="gray.300">
                    <strong>WODs revelados</strong> - 1 semana antes
                  </Text>
                </HStack>
              </VStack>
            </Box>

            {/* BOTONES ACTUALIZADOS - Ahora llevan al bracket */}
            <HStack gap={4} justify="center" mt={8}>
              <Button
                size="lg"
                colorScheme="green"
                onClick={() => navigate('/battle/bracket')}
                _hover={{
                  transform: "translateY(-2px)",
                  shadow: "xl"
                }}
                transition="all 0.2s"
              >
                <HStack>
                  <FaTrophy />
                  <Text>Ver Bracket en Vivo</Text>
                </HStack>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                colorScheme="gray"
                onClick={() => navigate('/wodmatch-battle')}
              >
                <HStack>
                  <FaUsers />
                  <Text>Volver al Evento</Text>
                </HStack>
              </Button>
            </HStack>

            {/* Información adicional sobre el bracket */}
            <Box
              mt={6}
              p={6}
              bg="blue.900"
              borderRadius="xl"
              borderWidth="2px"
              borderColor="blue.500"
            >
              <VStack gap={3} textAlign="center">
                <Text color="blue.200" fontWeight="bold" fontSize="lg">
                  🏆 Bracket en Vivo
                </Text>
                <Text color="blue.100" fontSize="sm">
                  Podrás seguir el progreso del torneo, ver tus próximos oponentes y los resultados en tiempo real
                </Text>
                <Text color="blue.200" fontSize="xs" fontWeight="medium">
                  Disponible a partir del 20 de Enero 2026
                </Text>
              </VStack>
            </Box>
          </VStack>
        );

      default:
        return null;
    }
  };

  return (
    <Box minH="100vh" bg="gray.900" py={8}>
      <Container maxW="container.xl">
        {/* Progress Header */}
        <Box mb={12}>
          <HStack justify="center" mb={6} flexWrap="wrap" gap={2}>
            {STEPS.map((step, index) => (
              <React.Fragment key={step}>
                <HStack gap={3}>
                  <Box
                    w="50px"
                    h="50px"
                    borderRadius="full"
                    bg={index <= currentStep ? "green.500" : "gray.700"}
                    color="white"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                    fontSize="lg"
                    transition="all 0.3s"
                    boxShadow={index === currentStep ? "0 0 20px rgba(0, 209, 161, 0.5)" : "none"}
                  >
                    {index < currentStep ? <FaCheck size={20} /> : index + 1}
                  </Box>
                  <Text
                    color={index <= currentStep ? "green.400" : "gray.600"}
                    fontWeight={index === currentStep ? "bold" : "normal"}
                    display={{ base: "none", md: "block" }}
                    fontSize="lg"
                  >
                    {step}
                  </Text>
                </HStack>
                {index < STEPS.length - 1 && (
                  <Box
                    w={{ base: "20px", md: "60px" }}
                    h="3px"
                    bg={index < currentStep ? "green.500" : "gray.700"}
                    transition="all 0.3s"
                  />
                )}
              </React.Fragment>
            ))}
          </HStack>
          
          <Progress.Root
            value={(currentStep / (STEPS.length - 1)) * 100}
            max={100}
            colorPalette="green"
            size="sm"
          >
            <Progress.Track bg="gray.700">
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        </Box>  

        {/* Step Content */}
        <Box minH="500px">
          {renderStepContent()}
        </Box>

        {/* Navigation */}
        {currentStep < STEPS.length - 1 && (
          <Flex
            justify="space-between"
            mt={12}
            pt={8}
            borderTopWidth="1px"
            borderColor="gray.700"
          >
            <Button
              variant="outline"
              colorScheme="gray"
              size="lg"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              <HStack>
                <FaArrowLeft />
                <Text>Anterior</Text>
              </HStack>
            </Button>
            <Button
              colorScheme="green"
              size="lg"
              onClick={currentStep === 3 ? handlePayment : handleNext}
              _hover={{
                transform: "translateY(-2px)",
                shadow: "xl"
              }}
            >
              <HStack>
                <Text>{currentStep === 3 ? 'Ir a pago' : 'Siguiente'}</Text>
                <FaArrowRight />
              </HStack>
            </Button>
          </Flex>
        )}
      </Container>
    </Box>
  );
}

export default BattleRegistration;