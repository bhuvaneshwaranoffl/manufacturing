import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // "host: true" makes the dev server listen on your PC's network
    // address (not just localhost), so your phone can reach it over WiFi.
    host: true,
    port: 5173,
  },
})
