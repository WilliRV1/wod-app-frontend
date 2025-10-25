// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // ¡Tema oscuro!
    primary: {
      main: '#A5D6A7', // Un verde similar al de tus ejemplos
    },
    background: {
      default: '#212121', // Fondo oscuro principal
      paper: '#333333', // Fondo para elementos como tarjetas
    },
  },
});

export default theme;