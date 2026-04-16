import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Full-Stack-Web-Application/',
  plugins: [react()],
})