import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  publicDir: 'static', // Files that are served as they are (models, textures, draco decoders)
  server: {
    host: true, // Open to local network and display URL
    open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1500, // three.js is large, but it is only loaded lazily when a level starts
  },
})
