import { addComponentsDir, addImportsDir, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@ws/tauri',
  },

  async setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add components
    addComponentsDir({
      path: resolver.resolve('./components'),
    })

    // Add utils
    addImportsDir(resolver.resolve('./utils'))
  },
})
