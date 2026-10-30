import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // The frontend calls /api/* on its own origin; the dev server forwards
    // them to the Express backend. changeOrigin stays off so the Host header
    // still matches the browser's Origin (the backend's CSRF origin check).
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
