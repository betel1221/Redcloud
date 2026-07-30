import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  base: '/Redcloud/',
  plugins: [react(), basicSsl()],
  server: {
    https: true,
    port: 5173,
    host: true,
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
