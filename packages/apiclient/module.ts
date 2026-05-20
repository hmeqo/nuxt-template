import { addImports, addImportsDir, addRouteMiddleware, createResolver, defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'

export default defineNuxtModule({
  meta: {
    name: '@ws/apiclient',
  },

  moduleDependencies: {
    'nuxt-csurf': {},
  },

  hooks: {
    'prepare:types': ({ references }) => {
      references.push({
        types: '@ws/apiclient/types',
      })
    },
  },

  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Pass module options to runtimeConfig object
    // @ts-expect-error unknown type
    nuxt.options.csurf = defu(nuxt.options.csurf, {
      https: false,
      cookieKey: 'csrftoken',
      headerName: 'X-Csrftoken',
      methodsToProtect: [],
    })

    addImports([
      { from: resolver.resolve('./lib/api'), name: 'default', as: 'Apis' },
      { from: resolver.resolve('./lib/api'), name: 'useClient' },
    ])

    addImportsDir([
      resolver.resolve('./lib/domain/models'),
      resolver.resolve('./lib/domain/choices'),
      resolver.resolve('./composables'),
      resolver.resolve('./stores'),
      resolver.resolve('./utils'),
    ])
  },
})
