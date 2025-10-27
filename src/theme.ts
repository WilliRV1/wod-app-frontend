import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// 1. Configuración de estilo global (Dark Mode)
const config: ThemeConfig = {
    // Mantener el modo oscuro como predeterminado
    initialColorMode: 'dark', 
    useSystemColorMode: false,
};

// 2. Colores personalizados
const colors = {
    // Colores de fondo y superficie (Dark Mode)
    gray: {
        900: '#0F1116', // Fondo extra oscuro
        800: '#1A202C', // Fondo de superficies/Navbar
        700: '#2D3748',
    },
    // Definimos un color de acento "WOD" (un verde/lima energético)
    wodAccent: {
        500: '#00D1A1', // Un verde-agua vibrante (acción principal)
        600: '#00AE87', // Hover
        700: '#008C6D',
    },
    // Mapeamos los colores de Chakra para usar nuestro acento donde antes estaba "green"
    green: {
        500: '#00D1A1',
        600: '#00AE87',
    },
    // Color de alerta/peligro
    red: {
        500: '#E53E3E',
    }
};

// 3. Configuración tipográfica
const fonts = {
    // Usamos una fuente sans-serif legible y robusta para la marca
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
};

// 4. Unir la configuración en el tema final
const customTheme = extendTheme({ 
    config, 
    colors, 
    fonts,
    styles: {
        global: {
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
        },
    },
    components: {
        Button: {
            variants: {
                solid: (props) => ({
                    ...(props.colorScheme === 'green' && {
                        bg: 'wodAccent.500',
                        _hover: {
                            bg: 'wodAccent.600',
                        },
                        color: 'gray.900' 
                    })
                })
            }
        },
        LinkBox: {
             baseStyle: {
                bg: 'gray.800', 
                borderColor: 'gray.700'
            }
        },
    }
});

export default customTheme;