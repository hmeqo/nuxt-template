const [seoEnabled, sitemapRoutes] = ((): [boolean, string[]] => {
  const enabled = process.env.ENABLE_SEO === 'true' ? true : false
  return [enabled, enabled ? ['/sitemap.xml'] : []]
})()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: [
    '@ws/app-preset',
    '@remqo/nuxt-infra',
    '@remqo/tailwindcss',
    '@remqo/shadcn',
    '@remqo/alova',
    // '@remqo/pwa',
    '@ws/ink',
    '@ws/apisdk',
  ],
  routeRules: {
    '/**': {
      // ssr: false,
      // prerender: true,
    },
  },
  site: {
    name: '后台管理',
    description: '后台管理控制台',
    // url: 'https://example.com',
    indexable: seoEnabled,
  },
  seo: {
    // unhead 3 已弃用 twitter:*，社交预览交给 OG 推断
    automaticTwitterTags: false,
  },
  sitemap: {
    enabled: seoEnabled,
  },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: [
        // '/',
        // '/login',
        ...sitemapRoutes,
      ],
    },
  },
})
