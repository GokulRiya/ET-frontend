
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      manifest: {
        name: 'Expenslytic – Expense Tracker',
        short_name: 'Expenslytic',
        description: 'Track, manage, and analyze your daily expenses with Expenslytic.',

        theme_color: '#2563eb',
        background_color: '#ffffff',

        display: 'standalone',
        start_url: '/',
        scope: '/',

        icons: [
          {
            src: '/public/assets/icon-192.webp',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/public/assets/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/public/assets/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,woff2}'
        ],

        cleanupOutdatedCaches: true,

        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60
              }
            }
          }
        ]
      }
    })
  ]
})
