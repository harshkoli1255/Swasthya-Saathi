import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Development/Demo Doctor OPD Workstation Web Surface (Port 5174)
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_SURFACE': JSON.stringify('doctor'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5174,
    cors: true,
    allowedHosts: [
      'made-relations-fiscal-medicare.trycloudflare.com',
      '.trycloudflare.com',
    ],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
