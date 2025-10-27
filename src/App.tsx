import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import LoginPage from './pages/LoginPage';
import CompetitionDetailPage from "./pages/CompetitionDetailPage";
import CreateCompetitionPage from './pages/CreateCompetitionPage'; // Import CreateCompetitionPage
import CreateBoxPage from './pages/CreateBoxPage'; // <-- Import the new page
import { ChakraProvider, Box } from "@chakra-ui/react"; // Removed defaultSystem
import Navbar from './components/NavBar'; // Tu Navbar
import { Toaster } from 'react-hot-toast';
import customTheme from './theme'; // Import your custom theme

function App() {
  return (
    // Provide your custom theme to ChakraProvider
    <ChakraProvider theme={customTheme}>

      <Navbar />

      {/* 2. Contenedor principal de la página */}
      <Box
        as="main"
        // Use minHeight to ensure footer (if any) is pushed down, or content fills viewport
        minH="calc(100vh - 80px)" // Adjust 80px based on Navbar height
        pt="80px" // Same value as minH adjustment and Navbar height
        w="100%"
        // Background is now handled by theme's global styles
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
            background: '#363636', // Use theme token like customTheme.colors.gray[700] if preferred
            color: '#fff',       // Use theme token like customTheme.colors.gray[100] if preferred
          },
          // Options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green', // Or use customTheme.colors.wodAccent[500]
              secondary: 'black', // Or use customTheme.colors.gray[900]
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
