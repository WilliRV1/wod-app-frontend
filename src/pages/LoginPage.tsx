import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { registerUserProfile } from "../services/user.service";

import {
  Box,
  Button,
  Container,
  Flex,
  VStack,
  Input,
  Text,
  Heading,
  Link,
} from "@chakra-ui/react";

import { Field } from "@chakra-ui/react";
import { NativeSelectRoot, NativeSelectField } from "@chakra-ui/react";
import { Card } from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  
  // Estados para login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados para registro
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [nivel, setNivel] = useState<"Novato" | "Intermedio" | "RX">("Novato");
  const [boxAfiliado, setBoxAfiliado] = useState("");
  
  // Estados de UI
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      // 1. Crear cuenta en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Usuario creado en Firebase:", user.uid);

      // 2. Crear perfil en MongoDB (simplificado)
      await registerUserProfile({
        firebaseUid: user.uid,
        email: user.email || email,
        nombre,
        apellidos,
        nivel,
        boxAfiliado: boxAfiliado.trim() || undefined
      });

      setMessage("¡Registro completo! Redirigiendo...");
      setTimeout(() => navigate("/"), 1500);
      
    } catch (error: any) {
      console.error("Error en Registro:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("El correo electrónico ya está registrado.");
      } else if (error.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else {
        setError("Error al registrar. Verifica tus datos e intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Usuario inició sesión:", userCredential.user.uid);
      setMessage(`¡Bienvenido de nuevo!`);
      setTimeout(() => navigate("/"), 1000);
    } catch (firebaseError: any) {
      console.error("Error en Firebase Auth (Login):", firebaseError);
      if (
        firebaseError.code === "auth/invalid-credential" ||
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/wrong-password"
      ) {
        setError("Correo electrónico o contraseña incorrectos.");
      } else {
        setError("Error al iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={20}>
      <Card.Root
        bg="gray.800"
        borderColor="gray.700"
        borderWidth="1px"
        shadow="2xl"
        borderRadius="lg"
      >
        <Card.Body p={8}>
          <VStack gap={6} align="stretch">
            {/* Header */}
            <Box textAlign="center">
              <Heading
                size="2xl"
                mb={2}
                bgGradient="linear(to-r, green.300, green.500)"
                bgClip="text"
              >
                {isRegistering ? "Crear Cuenta" : "Bienvenido"}
              </Heading>
              <Text color="gray.400">
                {isRegistering
                  ? "Únete a la comunidad WOD"
                  : "Inicia sesión para continuar"}
              </Text>
            </Box>

            {/* Form */}
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
              <VStack gap={4}>
                {isRegistering && (
                  <>
                    {/* Nombre */}
                    <Field.Root w="100%" required>
                      <Field.Label color="gray.300">
                        Nombre <Text as="span" color="red.400">*</Text>
                      </Field.Label>
                      <Input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Juan"
                        required
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

                    {/* Apellidos */}
                    <Field.Root w="100%" required>
                      <Field.Label color="gray.300">
                        Apellidos <Text as="span" color="red.400">*</Text>
                      </Field.Label>
                      <Input
                        type="text"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        placeholder="Pérez García"
                        required
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

                    {/* Nivel */}
                    <Field.Root w="100%" required>
                      <Field.Label color="gray.300">
                        Nivel de CrossFit <Text as="span" color="red.400">*</Text>
                      </Field.Label>
                      <Field.HelperText color="gray.500" fontSize="xs" mb={1}>
                        Selecciona tu nivel actual de entrenamiento
                      </Field.HelperText>
                      <NativeSelectRoot>
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
                          <option value="Novato">🌱 Novato - Menos de 6 meses</option>
                          <option value="Intermedio">💪 Intermedio - 6 meses a 2 años</option>
                          <option value="RX">🔥 RX - Más de 2 años</option>
                        </NativeSelectField>
                      </NativeSelectRoot>
                    </Field.Root>

                    {/* Box Afiliado (Opcional) */}
                    <Field.Root w="100%">
                      <Field.Label color="gray.300">
                        ¿En qué Box entrenas? (Opcional)
                      </Field.Label>
                      <Field.HelperText color="gray.500" fontSize="xs" mb={1}>
                        Puedes dejarlo vacío y agregarlo después
                      </Field.HelperText>
                      <Input
                        type="text"
                        value={boxAfiliado}
                        onChange={(e) => setBoxAfiliado(e.target.value)}
                        placeholder="Ej: CrossFit Cali"
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
                  </>
                )}

                {/* Email */}
                <Field.Root w="100%" required>
                  <Field.Label color="gray.300">
                    Correo Electrónico <Text as="span" color="red.400">*</Text>
                  </Field.Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    bg="gray.900"
                    borderColor="gray.600"
                    _hover={{ borderColor: "green.500" }}
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                    }}
                    color="white"
                    placeholder="tu@email.com"
                  />
                </Field.Root>

                {/* Contraseña */}
                <Field.Root w="100%" required>
                  <Field.Label color="gray.300">
                    Contraseña <Text as="span" color="red.400">*</Text>
                  </Field.Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    bg="gray.900"
                    borderColor="gray.600"
                    _hover={{ borderColor: "green.500" }}
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                    }}
                    color="white"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <Field.HelperText color="gray.500" fontSize="xs" mt={1}>
                    Mínimo 6 caracteres
                  </Field.HelperText>
                </Field.Root>

                {/* Mensajes de Error/Éxito */}
                {error && (
                  <Box
                    w="100%"
                    p={3}
                    bg="red.900"
                    borderRadius="md"
                    borderColor="red.500"
                    borderWidth="1px"
                  >
                    <Text color="red.200" fontSize="sm">
                      ⚠️ {error}
                    </Text>
                  </Box>
                )}
                {message && (
                  <Box
                    w="100%"
                    p={3}
                    bg="green.900"
                    borderRadius="md"
                    borderColor="green.500"
                    borderWidth="1px"
                  >
                    <Text color="green.200" fontSize="sm">
                      ✅ {message}
                    </Text>
                  </Box>
                )}

                {/* Botón de Submit */}
                <Button
                  type="submit"
                  width="100%"
                  colorScheme="green"
                  size="lg"
                  mt={2}
                  loading={isLoading}
                  _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                  transition="all 0.2s"
                >
                  {isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
                </Button>
              </VStack>
            </form>

            {/* Toggle Login/Register */}
            <Flex
              justify="center"
              align="center"
              gap={2}
              pt={4}
              borderTopWidth="1px"
              borderColor="gray.700"
              mt={6}
            >
              <Text color="gray.400" fontSize="sm">
                {isRegistering
                  ? "¿Ya tienes cuenta?"
                  : "¿No tienes cuenta?"}
              </Text>
              <Link
                color="green.400"
                fontWeight="semibold"
                fontSize="sm"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError(null);
                  setMessage(null);
                }}
                _hover={{ color: "green.300", textDecoration: "underline" }}
                cursor="pointer"
              >
                {isRegistering ? "Inicia Sesión" : "Regístrate"}
              </Link>
            </Flex>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Container>
  );
}

export default LoginPage;