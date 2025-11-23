import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        gray: {
          50: { value: '#F7FAFC' },
          100: { value: '#EDF2F7' },
          200: { value: '#E2E8F0' },
          300: { value: '#CBD5E0' },
          400: { value: '#A0AEC0' },
          500: { value: '#718096' },
          600: { value: '#4A5568' },
          700: { value: '#2D3748' },
          800: { value: '#1A202C' },
          900: { value: '#0F1116' },
        },
        wodAccent: {
          500: { value: '#00D1A1' },
          600: { value: '#00AE87' },
          700: { value: '#008C6D' },
        },
        // Mapping green to wodAccent as per legacy theme
        green: {
          50: { value: '#E6FFFA' },
          100: { value: '#B2F5EA' },
          200: { value: '#81E6D9' },
          300: { value: '#4FD1C5' },
          400: { value: '#38B2AC' },
          500: { value: '#00D1A1' },
          600: { value: '#00AE87' },
          700: { value: '#008C6D' },
          800: { value: '#2C7A7B' },
          900: { value: '#234E52' },
        },
        red: {
          500: { value: '#E53E3E' },
          600: { value: '#C53030' },
          900: { value: '#3f1111' },
        },
        blue: {
          200: { value: '#90CDF4' },
          500: { value: '#3182CE' },
          900: { value: '#1A365D' },
        },
        yellow: {
          600: { value: '#D69E2E' },
          900: { value: '#5F4110' },
        },
      },
      fonts: {
        heading: { value: "'Inter', sans-serif" },
        body: { value: "'Inter', sans-serif" },
      },
    },
  },
  globalCss: {
    body: {
      bg: "gray.900",
      color: "gray.100",
    },
    a: {
      color: "wodAccent.500",
      _hover: {
        textDecoration: "underline",
        color: "wodAccent.600",
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
