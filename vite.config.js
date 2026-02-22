import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-i18n': ['i18next', 'react-i18next'],
          'vendor-clerk': ['@clerk/clerk-react'],
          'vendor-gsap': ['gsap'],
          'vendor-icons': ['react-icons']
        }
      }
    }
  },
  server: {
    proxy: {
      '/zoho-mail': {
        target: 'https://mail.zoho.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zoho-mail/, ''),
        secure: true,
        headers: {
          'Origin': 'https://mail.zoho.com'
        }
      }
    }
  }
})
