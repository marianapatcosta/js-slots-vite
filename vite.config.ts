import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
const path = require('path');

export default defineConfig({
  base: 'js-slots-vite',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    VitePWA({
      base: '/js-slots-vite/',
      scope: '/js-slots-vite/',
      srcDir: 'src',
      filename: 'sw.ts',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      strategies: 'injectManifest',
      registerType: 'autoUpdate',
      manifest: {
        name: 'JS Slots',
        short_name: 'JS Slots',
        theme_color: '#06080f',
        description:
          'JS Slot Machine is a regular slot machine game that has the logos of main JS-related tools as symbols.',
        start_url: '/js-slots-vite',
        display: 'standalone',
        background_color: '#06080f',
        icons: [
          {
            src: 'images/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'images/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'images/apple-touch-icon.png',
            type: 'image/png',
          },
          {
            src: 'images/mstile-150x150.png',
            sizes: '150x150',
            type: 'image/png',
          },
          {
            src: 'images/safari-pinned-tab.png',
            type: 'image/png',
          },
        ],
      },
      injectManifest: {
        globPatterns: ['**.{html, js, css, svg, json}', '**'],
        globIgnores: ['**/node_modules/**/*'],
        maximumFileSizeToCacheInBytes: 3000000,
      },
      workbox: {
        cleanupOutdatedCaches: false,
        sourcemap: true,
        globIgnores: ['**/node_modules/**/*'],
      },
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/_index.scss";`,
      },
    },
  },
});
