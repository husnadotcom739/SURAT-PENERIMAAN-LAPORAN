import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/SURAT-PENERIMAAN-LAPORAN/', // WAJIB sesuai nama repository
})