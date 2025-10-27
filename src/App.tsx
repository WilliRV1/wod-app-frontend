import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import LoginPage from './pages/LoginPage';
import CompetitionDetailPage from "./pages/CompetitionDetailPage";
import CreateCompetitionPage from "./pages/CreateCompetitionPage";
import CreateBoxPage from "./pages/CreateBoxPage";
import { ChakraProvider, defaultSystem, Box } from "@chakra-ui/react"; 
import Navbar from './components/NavBar';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      
      <Navbar />

      {/* Contenedor principal de la página */}
      <Box
        as="main"
        pt="80px"
        w="100%"
        bg="gray.900"
        minH="100vh"
      >
        {/* Contenedor CENTRADO para tu contenido */}
        <Box
          maxW="container.lg"
          mx="auto"
          px={5}
        >
          {/* Rutas */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/competitions/:id" element={<CompetitionDetailPage />}/>
            <Route path="/create-competition" element={<CreateCompetitionPage />}/>
            <Route path="/create-box" element={<CreateBoxPage />}/>
          </Routes>
        </Box>
      </Box>
      
      <Toaster toastOptions={{
        duration: 2000,
      }}/>
    </ChakraProvider>
  );
}

export default App;