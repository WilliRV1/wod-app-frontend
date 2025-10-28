import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import LoginPage from './pages/LoginPage';
import CompetitionDetailPage from "./pages/CompetitionDetailPage";
import CreateCompetitionPage from './pages/CreateCompetitionPage';
import CreateBoxPage from './pages/CreateBoxPage';
import { ChakraProvider, defaultSystem, Box } from "@chakra-ui/react";
import Navbar from './components/NavBar';
import { Toaster } from 'react-hot-toast';

function App() {
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
          pt="80px"
          w="100%"
          bg="gray.900"
        >
          {/* Contenedor CENTRADO para tu contenido */}
          <Box
            maxW="container.lg"
            mx="auto"
            px={5}
            pb={10}
          >
            {/* Aquí viven tus páginas */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/competitions/:id" element={<CompetitionDetailPage />}/>
              <Route path="/create-competition" element={<CreateCompetitionPage />} />
              <Route path="/create-box" element={<CreateBoxPage />} />
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
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
          error: {
            duration: 7000,
          },
        }}
      />
    </ChakraProvider>
  );
}

export default App;