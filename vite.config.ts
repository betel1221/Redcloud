import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Redcloud/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/zabbix': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/webhook': {
        target: 'http://127.0.0.1:5678',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
