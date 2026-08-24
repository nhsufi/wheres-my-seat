import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom domain (salam.nsufi.com) serves from the root, so base is '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
