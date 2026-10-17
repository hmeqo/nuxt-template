// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: [
    '@ws/app-preset',
    '@remqo/nuxt-infra',
    '@remqo/tailwindcss',
    '@remqo/shadcn',
    // '@remqo/pwa',
    '@ws/ink',
    '@ws/tauri',
  ],
  css: ['~/assets/css/utilities.css'],
  routeRules: {
    '/**': {
      ssr: false,
      // prerender: true,
    },
  },

  site: {
    name: 'App',
    description: 'App 桌面端',
    indexable: false,
  },
  sitemap: {
    enabled: false,
  },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: [
        // '/',
        // '/login',
      ],
    },
  },
})
