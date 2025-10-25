import './App.css';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'; // Importa useNavigate
import HomePage from './pages/homepage';
import LoginPage from './pages/LoginPage';
import { useAuth } from "./contexts/AuthContext";  // <-- Importa el hook
import { auth } from './firebase'; // Importa auth para logout
import { signOut } from 'firebase/auth'; // Importa signOut

function App() {
  const { currentUser, loadingAuth } = useAuth(); // <-- Usa el hook
  const navigate = useNavigate(); // Hook para redirigir

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Usuario deslogueado");
      navigate('/login'); // Redirige al login después de logout
    } catch (error) {
      console.error("Error al hacer logout:", error);
    }
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/"> Inicio</Link>
          </li>
          <li>
            {/* --- LÓGICA CONDICIONAL --- */}
            {loadingAuth ? (
              <span> Cargando...</span> // Muestra mientras verifica
            ) : currentUser ? (
              <>
                {/* Si está logueado */}
                <span> Hola, {currentUser.email} </span>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              // Si NO está logueado
              <Link to="/Login"> Login </Link>
            )}
            {/* --- FIN LÓGICA --- */}
          </li>
        </ul>
      </nav>
      <hr/>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;