// Build: 20260909155500
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // Generate a service worker automatically (caches all build output)
      strategies: 'generateSW',
      includeAssets: ['favicon.svg', 'favicon.png', 'logo.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'],
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        // Cache everything from the build
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff2}'],
        // Network-first for navigation (always load latest HTML)
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        // Cache Supabase API responses for 1 day
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Black FX — The Traders Backtesting and Journal Platform',
        short_name: 'Black FX',
        description: 'Black FX — The ultimate backtesting and journal platform for professional traders.',
        theme_color: '#0d0f1a',
        background_color: '#0d0f1a',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['finance', 'business', 'productivity'],
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            url: '/dashboard',
            icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
      },
      devOptions: {
        enabled: false, // disable in dev to avoid SW conflicts
      },
    }),
  ],
  server: {
    proxy: {
      '/api/forexfactory': {
        target: 'https://nfs.faireconomy.media',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/forexfactory/, ''),
      },
    },
  },
})

