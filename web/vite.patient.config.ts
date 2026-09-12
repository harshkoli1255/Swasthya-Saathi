import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Development/Demo Patient Portal Web Surface (Port 5173)
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_APP_SURFACE': JSON.stringify('patient'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    cors: true,
    allowedHosts: [
      'tion-supports-transaction-explaining.trycloudflare.com',
      'lover-bacon-deposits-edit.trycloudflare.com',
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
