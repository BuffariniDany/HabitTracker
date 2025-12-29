import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'Habit Tracker PWA',
        short_name: 'HabitTracker',
        description: 'A simple, offline-first habit tracking Progressive Web App',
        theme_color: '#8B5CF6',
        background_color: '#1E293B',
        display: 'standalone',
        scope: '/HabitTracker/',
        start_url: '/HabitTracker/',
        icons: [
          {
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  base: '/HabitTracker/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@domains': resolve(__dirname, 'src/domains'),
      '@shared': resolve(__dirname, 'src/shared'),
      '@app': resolve(__dirname, 'src/app')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  }
})