import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
   server: {
    port: 3000, // 👈 Vite will now run on port 3000
    strictPort: true, // 👈 prevents Vite from switching if 3000 is busy
  },
})