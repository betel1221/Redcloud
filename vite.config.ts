import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Redcloud/',
  plugins: [react()],
  server: {
    allowedHosts: true,
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
        target: 'http://localhost:5678',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('n8n proxy error:', err);
          });
        },
      }
    }
  }
})