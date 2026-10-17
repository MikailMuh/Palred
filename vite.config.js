import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Palred',
        short_name: 'Palred',
        description: 'Harga pangan harian dari PIHPS Bank Indonesia, jastip pasar, dan paket bahan masak.',
        lang: 'id',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#fbf6ec',
        theme_color: '#1f4d3a',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        globIgnores: ['og-image.png'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Prices change daily: try the network first, fall back to the last copy when offline.
            urlPattern: ({ url }) => url.pathname === '/data/prices.json',
            handler: 'NetworkFirst',
            options: { cacheName: 'palred-prices', networkTimeoutSeconds: 4, expiration: { maxEntries: 1 } },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com' || url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'palred-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
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
