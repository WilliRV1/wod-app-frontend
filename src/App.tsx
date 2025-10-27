import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage';
import LoginPage from './pages/LoginPage';
import CompetitionDetailPage from "./pages/CompetitionDetailPage"
import { ChakraProvider, defaultSystem, Box } from "@chakra-ui/react"; 
import Navbar from './components/NavBar';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Box minH="100vh" bg="gray.900" color="white">
        <Navbar />

        <Box
          as="main"
          pt="80px"
          w="100%"
        >
          <Box
            maxW="container.lg"
            mx="auto"
            px={5}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Login" element={<LoginPage />} />
              <Route path="/competitions/:id" element={<CompetitionDetailPage />}/>
            </Routes>
          </Box>
        </Box>
      </Box>
      
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#1A202C',
            color: '#fff',
          },
        }}
      />
    </ChakraProvider>
  );
}

export default App;