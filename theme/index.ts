// src/theme/index.ts
import { createSystem, defaultConfig } from "@chakra-ui/react"

const customConfig = {
  ...defaultConfig,
  theme: {
    tokens: {
      colors: {
        brand: {
          primary: { value: '#00b894' },
          dark: { value: '#0a0e27' },
        }
      },
      fonts: {
        heading: { value: 'Inter, system-ui, sans-serif' },
        body: { value: 'Inter, system-ui, sans-serif' },
      }
    }
  }
}

export const system = createSystem(customConfig)