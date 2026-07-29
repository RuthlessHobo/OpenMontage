import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Kairova Solar is a fictional demonstration brand.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
