import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig(({ mode}) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: env.BASE_URL, // 👈 GitHub Pages
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        devOptions: {
          enabled: false
        },
        manifest: {
          name: "Escape Game Engine",
          short_name: "EGE",
          description: "Create Escape Games and play it!",
          theme_color: "#10b981",
          background_color: "#ffffff",
          display: "standalone",
          // start_url: "/", 
          start_url: "./", // 👈 GitHub Pages
          scope: "./", // 👈 GitHub Pages
          icons: [
            {
              src: "icons/pwa-192.png",
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: "icons/pwa-512.png",
              sizes: "512x512",
              type: "image/png"
            },
            {
              src: "icons/maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable"
            }
          ]
        },
        includeAssets: [
          "favicon.svg",
          "icons/*.png",
          "data/*.json",
          "data/*.csv",
          "locales/*.json"
        ],
        workbox: {
          //globPatterns: [
          //  "**/*.{js,css,html,ico,png,svg,json,csv}"
          //],        
          runtimeCaching: [
            {
              urlPattern: /\.(json|csv)$/,
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
  }
})