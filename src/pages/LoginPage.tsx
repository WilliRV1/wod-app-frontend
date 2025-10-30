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
import { Card } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function LoginPage() {
  const navigate = useNavigate();
  
  // Estados para login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados para registro SIMPLIFICADO (solo nombre)
  const [nombre, setNombre] = useState("");
  
  // Estados de UI
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ===== REGISTRO RÁPIDO (Solo 3 campos) =====
  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // 1. Crear cuenta en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      
      toast.loading("Creando tu perfil...", { id: "register" });

      // 2. Crear perfil en MongoDB (SIMPLIFICADO)
      await registerUserProfile({
        firebaseUid: user.uid,
        email: user.email || email,
        nombre: nombre.trim()
      });

      toast.success("¡Registro completo! Bienvenido 🎉", { id: "register" });
      
      // Redirigir a onboarding opcional
      setTimeout(() => navigate("/"), 1000);
      
    } catch (error: any) {
      console.error("Error en Registro:", error);
      
      if (error.code === "auth/email-already-in-use") {
        toast.error("El correo electrónico ya está registrado.");
      } else if (error.code === "auth/weak-password") {
        toast.error("La contraseña debe tener al menos 6 caracteres.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("El correo electrónico no es válido.");
      } else {
        toast.error("Error al registrar. Verifica tus datos.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ===== LOGIN =====
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("¡Bienvenido de nuevo! 👋");
      setTimeout(() => navigate("/"), 1000);
    } catch (firebaseError: any) {
      console.error("Error en Login:", firebaseError);
      
      if (
        firebaseError.code === "auth/invalid-credential" ||
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/wrong-password"
      ) {
        toast.error("Correo electrónico o contraseña incorrectos.");
      } else {
        toast.error("Error al iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxW={{ base: "100%", sm: "400px", md: "500px" }}  // Responsive max width
      py={{ base: 10, md: 20 }}  // Responsive padding
      px={{ base: 4, md: 0 }}   // Responsive horizontal padding
    >
      <Card.Root
        bg="gray.800"
        borderColor="gray.700"
        borderWidth="1px"
        shadow="2xl"
        borderRadius="lg"
      >
        <Card.Body p={{ base: 6, md: 8 }}>  {/* Responsive padding */}
          <VStack gap={6} align="stretch">
            {/* Header */}
            <Box textAlign="center">
              <Heading
                size={{ base: "xl", md: "2xl" }}  // Responsive heading
                mb={2}
                bgGradient="linear(to-r, green.300, green.500)"
                bgClip="text"
              >
                {isRegistering ? "Únete a WOD" : "Bienvenido"}
              </Heading>
              <Text color="gray.400">
                {isRegistering
                  ? "Regístrate en segundos"
                  : "Inicia sesión para continuar"}
              </Text>
            </Box>

            {/* Form */}
            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
              <VStack gap={4}>
                {/* REGISTRO: Solo nombre */}
                {isRegistering && (
                  <Field.Root w="100%" required>
                    <Field.Label color="gray.300">
                      ¿Cómo te llamas? <Text as="span" color="red.400">*</Text>
                    </Field.Label>
                    <Input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Juan"
                      required
                      size={{ base: "lg", md: "md" }}  // Responsive size
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
                    <Field.HelperText color="gray.500" fontSize="xs" mt={1}>
                      Puedes completar tu apellido después
                    </Field.HelperText>
                  </Field.Root>
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
                    size={{ base: "lg", md: "md" }}
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
                    size={{ base: "lg", md: "md" }}
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

                {/* Mensaje informativo para registro */}
                {isRegistering && (
                  <Box
                    w="100%"
                    p={3}
                    bg="green.900"
                    borderRadius="md"
                    borderColor="green.500"
                    borderWidth="1px"
                  >
                    <Text color="green.200" fontSize="sm">
                      ✨ Solo 3 campos. ¡Completa tu perfil después!
                    </Text>
                  </Box>
                )}

                {/* Botón de Submit */}
                <Button
                  type="submit"
                  width="100%"
                  colorScheme="green"
                  size={{ base: "lg", md: "md" }}  // Responsive size
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
                  setNombre("");
                  setEmail("");
                  setPassword("");
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