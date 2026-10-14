import { addComponentsDir, addImportsDir, addPlugin, createResolver, defineNuxtModule, useLogger } from '@nuxt/kit'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import defu from 'defu'

export default defineNuxtModule({
  meta: {
    name: '@ws/ink',
  },
  moduleDependencies: {
    '@remqo/shadcn': {},
  },

  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const logger = useLogger('@ws/ink')

    const uiDir = resolver.resolve('./ui')
    const hostUiDir = resolve(nuxt.options.srcDir, 'components/ui')

    // 宿主再 vendor 一份就会和包里的同名件抢注册（后者按前缀 `Ui`、前者按无前缀名）
    const shadcnDir = nuxt.options.shadcn ? nuxt.options.shadcn.componentDir : undefined
    if (shadcnDir && shadcnDir !== uiDir) {
      logger.warn(`shadcn.componentDir 被指到 ${shadcnDir}，会与 ${uiDir} 同时注册，同名件互相覆盖`)
    } else if (existsSync(hostUiDir)) {
      logger.warn(`${hostUiDir} 还在：它会按无前缀名注册，与包里的 Ui* 重复，删掉它`)
    }

    nuxt.options.shadcn = defu(nuxt.options.shadcn, {
      prefix: 'Ui',
      componentDir: uiDir,
    })

    addComponentsDir({
      path: resolver.resolve('./components'),
      prefix: 'Ink',
    })

    addImportsDir([resolver.resolve('./composables'), resolver.resolve('./utils')])

    addPlugin(resolver.resolve('./runtime/accent.ts'))
  },
})
