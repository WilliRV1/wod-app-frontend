import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import LoginPage from './pages/LoginPage';
import CompetitionDetailPage from "./pages/CompetitionDetailPage";
import CreateCompetitionPage from './pages/CreateCompetitionPage'; // Import CreateCompetitionPage
import CreateBoxPage from './pages/CreateBoxPage'; // <-- Import the new page
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
        // Use minHeight to ensure footer (if any) is pushed down, or content fills viewport
        minH="calc(100vh - 80px)" // Adjust 80px based on Navbar height
        pt="80px" // Same value as minH adjustment and Navbar height
        w="100%"
        bg="gray.900" // Apply a background color if desired
        color="white" // Default text color for children
      >
        {/* 3. Contenedor CENTRADO para tu contenido */}
        <Box
          maxW="container.lg" // Consistent width with Navbar
          mx="auto" // Centra el contenedor
          px={5}    // Padding idéntico al del Navbar
          pb={10} // Add some padding at the bottom
        >
          {/* Aquí viven tus páginas */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/competitions/:id" element={<CompetitionDetailPage />}/>
            <Route path="/create-competition" element={<CreateCompetitionPage />} />
            {/* --- NUEVA RUTA para crear Box --- */}
            <Route path="/create-box" element={<CreateBoxPage />} />
            {/* Add other routes here */}
          </Routes>
        </Box>
      </Box>
      <Toaster
        position="bottom-right" // Position the toasts
        toastOptions={{
          // Default options
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          // Options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
           error: {
            duration: 7000, // Longer duration for errors
          },
        }}
      />
    </ChakraProvider>
  );
}

export default App;
