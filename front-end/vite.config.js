import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteReact()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define:{
    __API_URL__: 'window.__backend_api_url',
  }
})
