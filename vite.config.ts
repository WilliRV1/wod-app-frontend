import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Importa el módulo 'path' de Node.js

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Agrega un alias para apuntar directamente a la carpeta generada
      'styled-system': path.resolve(__dirname, './styled-system'),
    },
  },
})
