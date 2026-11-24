import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Any request to /api/... is forwarded to the Express server on port 3000
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})