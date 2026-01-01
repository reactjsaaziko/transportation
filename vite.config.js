import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  assetsInclude: ['**/*.svg'],
  build: {
    assetsInlineLimit: 0, // Don't inline assets, keep them as separate files
  },
  server: {
    fs: {
      strict: false
    }
  }
})
