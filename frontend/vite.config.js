import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev: the React app runs on :5173 and proxies /api to the backend on :8080
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:8080' } },
})
