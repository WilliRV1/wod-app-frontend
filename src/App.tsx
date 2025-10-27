import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import LoginPage from './pages/LoginPage';
import CompetitionDetailPage from "./pages/CompetitionDetailPage";
import CreateCompetitionPage from './pages/CreateCompetitionPage'; // Import CreateCompetitionPage
import CreateBoxPage from './pages/CreateBoxPage'; // <-- Import the new page
// Removed ChakraProviderProps import, not needed if not passing theme prop
import { ChakraProvider, Box } from "@chakra-ui/react";
import Navbar from './components/NavBar'; // Tu Navbar
import { Toaster } from 'react-hot-toast';
 
import customTheme from './theme';

function App() {
  // Removed providerProps constant

  return (
    // Removed the incorrect theme prop / spread props
    <ChakraProvider value="customTheme">

      <Navbar />

      {/* 2. Contenedor principal de la página */}
      <Box
        as="main"
        minH="calc(100vh - 80px)"
        pt="80px"
        w="100%"
        color="white" // Global styles should handle background now
      >
        {/* 3. Contenedor CENTRADO para tu contenido */}
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
            {/* Add other routes here */}
          </Routes>
        </Box>
      </Box>
      <Toaster
        position="bottom-right"
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
            iconTheme: {
              primary: '#00D1A1', // Your wodAccent.500 color
              secondary: '#0F1116', // Your gray.900 color
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

