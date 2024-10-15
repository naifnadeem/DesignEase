import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Ensure this is set to true
  },
});