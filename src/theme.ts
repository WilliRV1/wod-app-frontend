// Removed incorrect imports for v3: extendBaseTheme, ChakraTheme, StyleFunctionProps
import { extendTheme } from '@chakra-ui/react'; // Use extendTheme if needed for basic structure

// 1. Configuración de estilo global (Dark Mode)
const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

// 2. Colores personalizados
const colors = {
    // Colores de fondo y superficie (Dark Mode)
    gray: {
        50: '#F7FAFC',
        100: '#EDF2F7',
        200: '#E2E8F0',
        300: '#CBD5E0',
        400: '#A0AEC0',
        500: '#718096',
        600: '#4A5568',
        700: '#2D3748', // Usado para bordes/superficies
        800: '#1A202C', // Usado para superficies/Navbar
        900: '#0F1116', // Fondo principal
    },
    // Definimos un color de acento "WOD"
    wodAccent: {
        500: '#00D1A1', // Acción principal
        600: '#00AE87', // Hover
        700: '#008C6D',
    },
    // Mapeamos los colores de Chakra para usar nuestro acento donde antes estaba "green"
    green: {
        50: '#E6FFFA',
        100: '#B2F5EA',
        200: '#81E6D9',
        300: '#4FD1C5',
        400: '#38B2AC',
        500: '#00D1A1', // Tu acento principal
        600: '#00AE87', // Tu acento hover
        700: '#008C6D', // Tu acento más oscuro
        800: '#2C7A7B',
        900: '#234E52',
    },
    // Color de alerta/peligro
    red: {
        500: '#E53E3E',
        600: '#C53030', // Added hover variant
        900: '#3f1111'
    },
    blue: { // Added blue for info messages
        200: '#90CDF4',
        500: '#3182CE',
        900: '#1A365D'
    },
    yellow: { // Added yellow for warning messages
        600: '#D69E2E',
        900: '#5F4110'
    }
};

// 3. Configuración tipográfica
const fonts = {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
};

// 4. Estilos globales
const styles = {
    // Removed unused 'props' parameter
    global: () => ({
        body: {
            bg: 'gray.900',
            color: 'gray.100',
        },
        a: {
            color: 'wodAccent.500',
            _hover: {
                textDecoration: 'underline',
                color: 'wodAccent.600',
            }
        }
    }),
};

// 5. Component Styles (Simplified or Removed for v3/Park UI basic usage)
// NOTE: Deep component style overrides like this are less common in Park UI.
// You often apply styles via props directly or through CSS variables/recipes.
// If you specifically NEED component variants, the structure might differ.
// Removing this section for now to fix build errors. Add back carefully if needed.
// const components = { ... };

// 6. Unir la configuración
// Use extendTheme if you need the structure, otherwise just export the object.
// We'll use extendTheme to maintain a familiar structure.
const customTheme = extendTheme({
    config,
    colors,
    fonts,
    styles,
    // components, // Removed components section for now
});

export default customTheme;
