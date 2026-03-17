import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/SURAT-PENERIMAAN-LAPORAN/', // Samakan dengan nama repository GitHub kamu
})
