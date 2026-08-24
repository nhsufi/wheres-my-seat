import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// Custom domain (salam.nsufi.com) serves from the root, so base is '/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
