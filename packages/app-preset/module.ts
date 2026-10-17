import { addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'
import defu from 'defu'
import type { NuxtConfig } from '@nuxt/schema'

/**
 * 两个 app 共有的 Nuxt 配置块（`css` 除外：那 4 个文件按包内路径 push，见 setup）。
 * tsconfig.json / .nuxtrc / components.json / app.vue / error.vue 故意留在各 app。
 * compatibilityDate 也只能放各 app 的 nuxt.config：Nuxt 在模块跑之前就校验它。
 */
const shared: NuxtConfig = {
  devtools: { enabled: true },
  experimental: {
    serverAppConfig: false,
  },

  runtimeConfig: {
    public: {
      // 代理上游（server/api 与 server/routes/media 读它）：生产用 NUXT_PUBLIC_API_BASE / NUXT_PUBLIC_MEDIA_BASE 覆盖。
      // 桌面壳纯本地，不读这两项。
      apiBase: 'http://localhost:8000/api',
      mediaBase: 'http://localhost:8000/media',
    },
  },
  components: [
    { path: '~/components' },
    // { path: '~/components/ui', prefix: 'ui', pathPrefix: false, extensions: ['ts'] },
  ],
  imports: {
    // dirs: ['~/stores'],
    // imports: [{ from: '~/lib/router', name: 'getLoginUrl' }],
  },
  app: {
    // layoutTransition: { name: 'fade', mode: 'out-in' },
    // pageTransition: { name: 'fade', mode: 'out-in' },
    pageTransition: { name: 'slide-fade', mode: 'out-in' },
    buildAssetsDir: 'static',
    rootAttrs: {
      id: 'root',
    },
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700], subsets: ['latin'], display: 'swap' },
      { name: 'Maple Mono', provider: 'none' },
    ],
  },

  colorMode: {
    preference: 'dark',
  },

  // pwa: {
  //   manifest: {
  //     name: 'App',
  //     short_name: 'App',
  //     theme_color: '#0a0a0a',
  //     description: 'App',
  //   },
  // },

  typescript: {
    tsConfig: {
      compilerOptions: {
        // experimentalDecorators: true,
        // emitDecoratorMetadata: true,
      },
    },
  },

  vite: {
    build: {
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },
}

export default defineNuxtModule({
  meta: {
    name: '@ws/app-preset',
  },

  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // defu 的返回类型与 NuxtOptions 不完全兼容（直接推断会 TS2589），先落到宽类型再并回去：深合并、宿主已设的值优先
    const merged = defu(nuxt.options as unknown as Record<string, unknown>, shared)
    Object.assign(nuxt.options, merged)

    nuxt.options.css.push(
      resolver.resolve('./app/index.css'),
      resolver.resolve('./app/tailwind.css'),
      resolver.resolve('./app/fonts.css'),
      resolver.resolve('./app/transition.css'),
    )

    addServerHandler({ route: '/api/**', handler: resolver.resolve('./server/api/[...path].ts') })
    addServerHandler({ route: '/media/**', handler: resolver.resolve('./server/routes/media/[...path].ts') })
  },
})
