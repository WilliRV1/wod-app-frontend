// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // <-- Import your AuthProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* Router needs to be outside AuthProvider if AuthProvider uses hooks like useNavigate */}
      <AuthProvider> {/* AuthProvider wraps App */}
        <App /> 
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);