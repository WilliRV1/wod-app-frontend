import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import LoginPage from './pages/LoginPage';
import CompetitionDetailPage from "./pages/CompetitionDetailPage"
import { ChakraProvider, defaultSystem, Box } from "@chakra-ui/react"; 
import Navbar from './components/NavBar'; // Tu Navbar
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      
      <Navbar />

      {/* 2. Contenedor principal de la página */}
      <Box
        as="main"

        pt="80px" // <--- Ajusta este valor si tu Navbar es más alta
        w="100%"
      >
        {/* 3. Contenedor CENTRADO para tu contenido */}
        <Box
          // =========================================================
          // ▼▼▼ ¡ESTE VALOR DEBE SER IDÉNTICO AL DE TU NAVBAR! ▼▼▼
          maxW="container.lg" // (Prueba "container.md" si sigue sin alinear)
          // =========================================================
          mx="auto" // Centra el contenedor
          px={5}    // Padding idéntico al del Navbar
        >
          {/* Aquí viven tus páginas */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/competitions/:id" element={<CompetitionDetailPage />}/>
          </Routes>
        </Box>
      </Box>
      <Toaster toastOptions={{
          // Duración por defecto para todas las alertas
          duration: 2000, // 3 segundos
        }}/>
    </ChakraProvider>
  );
}

export default App;