import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import LoginPage from './pages/LoginPage';
import CompetitionDetailPage from "./pages/CompetitionDetailPage";
import CreateCompetitionPage from './pages/CreateCompetitionPage';
import CreateBoxPage from './pages/CreateBoxPage';
import { ChakraProvider, defaultSystem, Box } from "@chakra-ui/react";
import Navbar from './components/NavBar';
import { Toaster } from 'react-hot-toast';
import ProfilePage from "./pages/ProfilePage"
import EditProfilePage from "./pages/EditProfilePage"
import NotificationsPage from "./pages/NotificationsPage"
import { initializeNotifications } from './services/notification.service';

function App() {
  // Initialize notifications on app start
  React.useEffect(() => {
    initializeNotifications();
  }, []);

  return (
    <ChakraProvider value={defaultSystem}>
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
          pt={{ base: "60px", md: "80px" }}  // Responsive navbar height
          w="100%"
          bg="gray.900"
        >
          {/* Contenedor CENTRADO para tu contenido */}
          <Box
            maxW="container.xl"  // Más grande que lg
            mx="auto"
            px={{ base: 4, md: 6, lg: 8 }}  // Responsive padding
            pb={10}
          >
            {/* Aquí viven tus páginas */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/competitions/:id" element={<CompetitionDetailPage />}/>
              <Route path="/create-competition" element={<CreateCompetitionPage />} />
              <Route path="/create-box" element={<CreateBoxPage />} />
              <Route path="/profile/:uid" element={<ProfilePage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
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
    </ChakraProvider>
  );
}

export default App;