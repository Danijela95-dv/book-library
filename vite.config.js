import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative paths so the built app works on any host or sub-folder
  base: './',
  plugins: [react()],
})
