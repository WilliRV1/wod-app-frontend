# WODMATCH BATTLE - Frontend

**WODMATCH BATTLE** es una plataforma web diseñada para la gestión y visualización de competencias de CrossFit en tiempo real. Este proyecto nace de la necesidad de centralizar la experiencia de competencia, permitiendo a los atletas registrarse, ver sus brackets y seguir los resultados en vivo.

Este repositorio contiene el **Frontend** de la aplicación, desarrollado con tecnologías modernas para asegurar una experiencia de usuario fluida y reactiva.

## 🏆 Cumplimiento con la Rúbrica del Proyecto Final

Este proyecto ha sido desarrollado siguiendo los lineamientos de la rúbrica de entrega, cumpliendo con los siguientes puntos:

### 1. Plataforma Web y Propuesta Gráfica
- **Fidelidad Gráfica**: La interfaz ha sido construida siguiendo la propuesta de diseño (Figma/Adobe), utilizando **Chakra UI** para mantener una estética profesional y consistente (Modo oscuro, paleta de colores verde/gris).
- **Navegación**: Implementación de menús públicos y privados, con rutas protegidas para usuarios autenticados y administradores.

### 2. Estructura del Proyecto
El código está organizado bajo una arquitectura modular y escalable:
- **`src/contexts`**: Manejo de estado global (ej. `AuthContext` para la sesión del usuario).
- **`src/hooks`**: Lógica reutilizable encapsulada en Custom Hooks.
- **`src/pages`**: Vistas principales de la aplicación (`LoginPage`, `WODMATCHBATTLEPage`, etc.).
- **`src/components`**: Componentes reutilizables e independientes (`NavBar`, `BracketView`).
- **`src/services`**: Comunicación con APIs y servicios externos (Firebase, Backend).

### 3. Funcionalidades Avanzadas
- **Comunicación en Tiempo Real**: Uso de **Socket.io** para actualizar los brackets de competencia y resultados instantáneamente sin recargar la página.
- **Estructuras de Datos Complejas**: Visualización dinámica de brackets de torneo (`BracketView`), manejando rondas, enfrentamientos y ganadores de forma lógica.
- **Autenticación Real**: Sistema de Login y Registro seguro utilizando **Firebase Authentication**.

### 4. Tecnologías Utilizadas
- **Frontend**: React + TypeScript + Vite
- **Estilos**: Chakra UI + Emotion
- **Tiempo Real**: Socket.io Client
- **HTTP Client**: Axios

---

## 📋 Información de Entrega

### Propuesta Gráfica
El diseño original y los prototipos se encuentran en:


### Despliegue (Deployment)
La aplicación se encuentra desplegada y funcional en:
- **Frontend (Netlify/Vercel):** [Enlace al Frontend](https://wod-app-frontend-hvax.vercel.app/) 
- **Backend (Vercel/Render):** [Enlace al Backend](https://wod-competitions-app.onrender.com) 

--
