import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg'],
  build: {
    assetsInlineLimit: 0, // Don't inline assets, keep them as separate files
    outDir: 'dist',
  },
  server: {
    port: 3070,
    host: true,
    fs: {
      strict: false
    }
  }
})
