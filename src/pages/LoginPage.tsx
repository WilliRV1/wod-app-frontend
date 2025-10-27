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
  Stack, // Import Stack if you use it for layout
} from "@chakra-ui/react";

import { Field } from "@chakra-ui/react"; // Correct import for Field
import { RadioGroup } from "@chakra-ui/react"; // Correct import for RadioGroup
import { Card } from "@chakra-ui/react"; // Correct import for Card


import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [rol, setRol] = useState<"atleta" | "dueño_box">("atleta");
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Usuario creado en Firebase:", user.uid);

      await registerUserProfile({
        firebaseUid: user.uid,
        email: user.email || email,
        nombre,
        apellidos,
        rol,
      });

      setMessage("¡Registro completo! Redirigiendo...");
       if (rol === 'dueño_box') {
            setTimeout(() => navigate("/create-box"), 1500);
       } else {
            setTimeout(() => navigate("/"), 1500);
       }
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
        borderRadius="lg" // Ensure consistent styling
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
                    <Field.Root w="100%">
                      <Field.Label color="gray.300">Nombre</Field.Label>
                      <Input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        bg="gray.900"
                        borderColor="gray.600"
                        _hover={{ borderColor: "green.500" }}
                        _focus={{
                          borderColor: "green.500",
                          boxShadow:
                            "0 0 0 1px var(--chakra-colors-green-500)",
                        }}
                        color="white"
                      />
                    </Field.Root>

                    <Field.Root w="100%">
                      <Field.Label color="gray.300">Apellidos</Field.Label>
                      <Input
                        type="text"
                        value={apellidos}
                        onChange={(e) => setApellidos(e.target.value)}
                        required
                        bg="gray.900"
                        borderColor="gray.600"
                        _hover={{ borderColor: "green.500" }}
                        _focus={{
                          borderColor: "green.500",
                          boxShadow:
                            "0 0 0 1px var(--chakra-colors-green-500)",
                        }}
                        color="white"
                      />
                    </Field.Root>

                    {/* Selector de Rol using RadioGroup */}
                    <Field.Root w="100%">
                        <Field.Label color="gray.300">¿Qué eres?</Field.Label>
                        <RadioGroup.Root
                            value={rol}
                            onValueChange={(details) => setRol(details.value as 'atleta' | 'dueño_box')}
                            // Add console.log here for debugging if needed
                            // onValueChange={(details) => { console.log("Radio changed:", details.value); setRol(details.value as 'atleta' | 'dueño_box'); }}
                        >
                            <Flex gap={6} mt={2}> {/* Use Flex for layout */}
                                <RadioGroup.Item value="atleta" id="atleta-radio">
                                    <RadioGroup.ItemControl />
                                    <RadioGroup.ItemText color="white" ml={2}>Atleta</RadioGroup.ItemText>
                                </RadioGroup.Item>
                                <RadioGroup.Item value="dueño_box" id="owner-radio">
                                    <RadioGroup.ItemControl />
                                    <RadioGroup.ItemText color="white" ml={2}>Dueño de Box</RadioGroup.ItemText>
                                </RadioGroup.Item>
                            </Flex>
                        </RadioGroup.Root>
                        <Field.HelperText color="gray.500" fontSize="sm" mt={2}>
                             {rol === 'atleta'
                                 ? 'Podrás inscribirte a competencias y crear eventos comunitarios.'
                                 : 'Serás redirigido para crear tu Box después del registro.'} {/* Updated helper text */}
                        </Field.HelperText>
                    </Field.Root>
                  </>
                )}

                <Field.Root w="100%">
                  <Field.Label color="gray.300">Correo Electrónico</Field.Label>
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

                <Field.Root w="100%">
                  <Field.Label color="gray.300">Contraseña</Field.Label>
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
                  />
                </Field.Root>

                {/* Mensajes */}
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
                      {error}
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
                      {message}
                    </Text>
                  </Box>
                )}

                <Button
                  type="submit"
                  width="100%"
                  colorScheme="green"
                  size="lg"
                  mt={2}
                  loading={isLoading} // Correct prop name
                  _hover={{ transform: "translateY(-2px)", shadow: "lg" }}
                  transition="all 0.2s"
                >
                  {isRegistering ? "Crear Cuenta" : "Iniciar Sesión"}
                </Button>
              </VStack>
            </form>

            {/* Alternar entre login/register */}
            <Flex
              justify="center"
              align="center"
              gap={2}
              pt={4}
              borderTopWidth="1px"
              borderColor="gray.700"
              mt={6} // Added margin top for spacing
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
                  // Optionally clear fields when switching
                  // setEmail('');
                  // setPassword('');
                  // setNombre('');
                  // setApellidos('');
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

