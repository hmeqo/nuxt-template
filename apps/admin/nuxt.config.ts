const [seoEnabled, sitemapRoutes] = ((): [boolean, string[]] => {
  const enabled = false
  return [enabled, enabled ? ['/sitemap.xml'] : []]
})()

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@workspace-hmeqo/nuxt-infra',
    // '@workspace-hmeqo/pwa',
    '@workspace-hmeqo/unocss',
    '@workspace-hmeqo/shadcn-unocss'
  ],
  components: [
    { path: '~/components' }
    // { path: '~/components/ui', prefix: 'ui', pathPrefix: false, extensions: ['ts'] }
  ],
  app: {
    // layoutTransition: { name: 'fade', mode: 'out-in' },
    // pageTransition: { name: 'fade', mode: 'out-in' },
    buildAssetsDir: 'static',
    rootAttrs: {
      id: 'root'
    },
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },
  css: ['~/assets/css/main.css'],
  fonts: {
    families: [{ name: 'Maple Mono', provider: 'none' }]
  },
  routeRules: {
    '/**': {
      ssr: false,
      prerender: true
    }
  },

  colorMode: {
    preference: 'dark'
  },

  site: {
    url: 'https://example.com',
    indexable: seoEnabled
  },
  seo: {
    meta: {
      description: ''
    }
  },
  sitemap: {
    enabled: seoEnabled
  },
  // pwa: {
  //   manifest: {
  //     name: 'App',
  //     short_name: 'App',
  //     theme_color: '#0a0a0a',
  //     description: 'App'
  //   }
  // },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: ['/', '/login', ...sitemapRoutes]
      // routes: ['/', '/login', ]
    }
  },
  vite: {
    build: {
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    }
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        // experimentalDecorators: true,
        // emitDecoratorMetadata: true
      }
    }
  }
})
