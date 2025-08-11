import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // ⚠️ Penting untuk routing di Vercel
  build: {
    outDir: 'dist', // Folder output (default Vite)
    emptyOutDir: true, // Bersihkan folder dist sebelum build
  },
  server: {
    open: true // Buka browser otomatis saat dev
  }
})