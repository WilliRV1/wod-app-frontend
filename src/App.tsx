import './App.css'; // Mantenemos los estilos básicos
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/homepage';
import LoginPage from './pages/LoginPage';


function App() {
  return (
    <>
    <div>
      <nav>
        <ul>
          <li>
            <Link to = "/"> Inicio</Link>
            <Link to = "/Login"> Login </Link>
          </li>
        </ul>
      </nav>
   
      <Routes>
      <Route path = "/" element= {<HomePage/>}/>
      <Route path = "/Login" element= {<LoginPage/>}/>
      </Routes>
      </div>
    </>
  );
}

export default App;