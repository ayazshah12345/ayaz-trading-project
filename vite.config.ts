// Build: 20260907153755
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
      includeAssets: ['favicon.svg', 'logo.jpg', 'icon-512.jpg'],
      workbox: {
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
        name: 'Trading Aura — Professional Trading Platform',
        short_name: 'Trading Aura',
        description: 'Track trades, backtest strategies, and analyze your performance with Trading Aura.',
        theme_color: '#0d0f1a',
        background_color: '#0d0f1a',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['finance', 'business', 'productivity'],
        icons: [
          {
            src: '/icon-512.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Dashboard',
            short_name: 'Dashboard',
            url: '/dashboard',
            icons: [{ src: '/icon-512.jpg', sizes: '512x512' }],
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

