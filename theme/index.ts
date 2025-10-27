import { createSystem, defaultConfig } from "@chakra-ui/react"

const customConfig = {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e6f9f5' },
          100: { value: '#b3ede0' },
          200: { value: '#80e1cb' },
          300: { value: '#4dd5b6' },
          400: { value: '#26c9a1' },
          500: { value: '#00b894' },
          600: { value: '#00a080' },
          700: { value: '#00886b' },
          800: { value: '#006b54' },
          900: { value: '#004d3d' },
        }
      }
    }
  }
}

export const system = createSystem(defaultConfig, customConfig)