// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // <-- Import your AuthProvider
import { ThemeProvider, CssBaseline } from '@mui/material'; // <-- Importa de MUI
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}> {/* Aplica el tema */}
      <CssBaseline /> {/* Resetea estilos base */}
      <BrowserRouter> 
        <AuthProvider> 
          <App /> 
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);