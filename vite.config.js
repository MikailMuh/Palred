import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Dev only: the daily bot commits prices.json to main, so read the deployed copy.
      '/data/prices.json': {
        target: 'https://palred.vercel.app',
        changeOrigin: true,
      },
    },
  },
})
