import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Mudado para 5173 para liberar a porta 3000 para o seu backend
    strictPort: true, 
  }
})
