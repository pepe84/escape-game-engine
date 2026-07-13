import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true
      },
      manifest: {
        name: "Escape Game Engine",
        short_name: "EGE",
        description: "Create Escape Games and play it!",
        theme_color: "#10b981",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icons/pwa-192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/pwa-512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.pathname.endsWith(".json") ||
              url.pathname.endsWith(".csv"),
            handler: "CacheFirst",
            options: {
              cacheName: "game-files",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 any
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }      
    })
  ],
})