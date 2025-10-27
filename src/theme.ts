import { extendBaseTheme, type ChakraTheme } from '@chakra-ui/react';
// Importa las utilidades para definir estilos de componentes si las necesitas más adelante
// import { defineStyleConfig, defineStyle } from '@chakra-ui/react';
// O desde styled-system si defines estilos más complejos
import type { StyleFunctionProps } from '@chakra-ui/styled-system';

// 1. Configuración de estilo global (Dark Mode)
// No necesita un tipo específico, es parte del objeto theme
const config = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

// 2. Colores personalizados (sin cambios)
const colors = {
    // Colores de fondo y superficie (Dark Mode)
    gray: {
        50: '#F7FAFC', // Añade tonos más claros si los necesitas
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
        50: '#E6FFFA', // Ejemplo de tono claro
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
    // Color de alerta/peligro (sin cambios)
    red: {
        // ... (puedes definir más tonos si los necesitas)
        500: '#E53E3E',
        900: '#3f1111' // Ejemplo para fondo de error
    }
};

// 3. Configuración tipográfica (sin cambios)
const fonts = {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
};

// 4. Estilos globales (ligeramente ajustado)
const styles = {
    global: (props: StyleFunctionProps) => ({ // Tipar props aquí
        body: {
            bg: 'gray.900', // Usa el token de color definido
            color: 'gray.100', // Usa un token de color claro
        },
        a: {
            color: 'wodAccent.500', // Usa tu color de acento
            _hover: {
                textDecoration: 'underline',
                color: 'wodAccent.600',
            }
        }
    }),
};

// 5. Estilos de componentes (estructura v3)
const components = {
    // Ejemplo para Button (puedes añadir más componentes)
    Button: {
        variants: {
            // Estilo para la variante 'solid' cuando colorScheme es 'green'
            solid: (props: StyleFunctionProps) => {
                if (props.colorScheme === 'green') {
                    return {
                        bg: 'wodAccent.500', // Tu color de acento
                        color: 'gray.900',   // Texto oscuro para contraste
                        _hover: {
                            bg: 'wodAccent.600', // Color hover
                            _disabled: { // Asegura que el estilo disabled no interfiera
                                bg: 'wodAccent.500'
                            }
                        },
                         _disabled: { // Estilo cuando está deshabilitado
                             bg: 'gray.700 !important', // Usa !important si es necesario sobreescribir
                             color: 'gray.500 !important',
                             opacity: 0.6,
                             cursor: 'not-allowed',
                         }
                    };
                }
                 if (props.colorScheme === 'red') { // Ejemplo para colorScheme red
                     return {
                          bg: 'red.500',
                          color: 'white',
                           _hover: {
                               bg: 'red.600',
                                _disabled: { bg: 'red.500' }
                           },
                           _disabled: {
                                bg: 'gray.700 !important',
                                color: 'gray.500 !important',
                                opacity: 0.6,
                                cursor: 'not-allowed',
                           }
                     };
                 }
                // Devuelve un objeto vacío o los estilos por defecto si no es 'green'
                return {};
            },
             outline: (props: StyleFunctionProps) => ({
                 borderColor: props.colorScheme === 'green' ? 'wodAccent.500' : undefined,
                 color: props.colorScheme === 'green' ? 'wodAccent.500' : undefined,
                 _hover: {
                     bg: props.colorScheme === 'green' ? 'rgba(0, 209, 161, 0.1)' : undefined, // Fondo ligero en hover
                 },
                   _disabled: { // Estilo cuando está deshabilitado
                       borderColor: 'gray.700 !important',
                       color: 'gray.500 !important',
                       opacity: 0.6,
                       cursor: 'not-allowed',
                   }
             }),
        },
         baseStyle: { // Estilos base para todos los botones
            fontWeight: 'semibold', // Ejemplo
         }
    },
    // Puedes definir estilos para otros componentes aquí
    // LinkBox: defineStyleConfig({ ... }), // Usando defineStyleConfig
    // Card: createMultiStyleConfigHelpers(['container', 'body', 'header', 'footer']).defineMultiStyleConfig({ ... }) // Para partes múltiples
};

// 6. Unir la configuración usando extendBaseTheme
const customTheme = extendBaseTheme({
    config,
    colors,
    fonts,
    styles,
    components,
    // Puedes añadir otras secciones como semanticTokens si los necesitas
}) as ChakraTheme; // Asegura el tipo final

export default customTheme;
