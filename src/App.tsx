import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, Box } from "@chakra-ui/react";
import { defaultSystem } from "@chakra-ui/react";
import Navbar from './components/NavBar';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import ProfilePage from "./pages/ProfilePage";
import WODMATCHBATTLEPage from "./pages/WODMATCHBATTLEPage";
import BattleRegistrationPage from "./pages/BattleRegistrationPage";
import { initializeNotifications } from './services/notification.service';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  // Initialize notifications on app start
  React.useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <ChakraProvider value={defaultSystem}>
      <AuthProvider>
        {/* Contenedor principal con fondo oscuro */}
        <Box
          minH="100vh"
          w="100%"
          bg="gray.900"
          color="white"
        >
          {/* Navbar */}
          <Navbar />

          {/* Contenedor principal de la página */}
          <Box
            as="main"
            minH="100vh"
            pt={{ base: "60px", md: "80px" }}
            w="100%"
            bg="gray.900"
          >
            {/* Contenedor CENTRADO para tu contenido */}
            <Box
              maxW="container.xl"
              mx="auto"
              px={{ base: 4, md: 6, lg: 8 }}
              pb={10}
            >
              {/* Rutas - Solo WODMATCH BATTLE */}
              <Routes>
                {/* Página principal - WODMATCH BATTLE */}
                <Route path="/" element={<WODMATCHBATTLEPage />} />
                
                {/* Rutas de WODMATCH BATTLE */}
                <Route path="/battle" element={<WODMATCHBATTLEPage />} />
                <Route path="/battle/register" element={<BattleRegistrationPage />} />
                
                {/* Login (mantenemos para autenticación) */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Perfil de usuario (mantenemos básico) */}
                <Route path="/profile/:uid" element={<ProfilePage />} />
                
                {/* Redireccionar todas las demás rutas a WODMATCH BATTLE */}
                <Route path="/competitions" element={<Navigate to="/" replace />} />
                <Route path="/competitions/:id" element={<Navigate to="/" replace />} />
                <Route path="/create-competition" element={<Navigate to="/" replace />} />
                <Route path="/create-box" element={<Navigate to="/" replace />} />
                <Route path="/edit-profile" element={<Navigate to="/" replace />} />
                <Route path="/notifications" element={<Navigate to="/" replace />} />
                <Route path="/my-competitions" element={<Navigate to="/" replace />} />
                <Route path="/settings" element={<Navigate to="/" replace />} />
                
                {/* Catch-all route - redirige a WODMATCH BATTLE */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
          </Box>
        </Box>

        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#065f46',
                color: '#fff',
              },
            },
            error: {
              duration: 7000,
              style: {
                background: '#991b1b',
                color: '#fff',
              },
            },
          }}
        />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;