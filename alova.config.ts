import { defineConfig } from '@alova/wormhole'
import { defaultsPlugin, toPlugin } from '@remqo/alova/plugin'
// import { naiveRulesPlugin } from '@remqo/alova/plugin/naive-rules'

const outputDir = 'packages/apisdk/lib/api'

// For more config detailed visit:
// https://alova.js.org/tutorial/getting-started/extension-integration

export default defineConfig({
  generator: [
    {
      /**
       * file input. support:
       * 1. openapi json file url
       * 2. local file
       */
      input: 'http://localhost:8000/api-docs/openapi.json',

      plugins: [
        {
          // auth__login -> login (suffix after the first '__')
          afterOpenapiParse(document) {
            const separator = '__'
            for (const pathItem of Object.values(document.paths ?? {})) {
              for (const operation of Object.values(pathItem ?? {})) {
                if (typeof operation !== 'object' || Array.isArray(operation)) continue
                const id = operation?.operationId
                if (!id) continue
                const at = id.indexOf(separator)
                if (at !== -1) operation.operationId = id.slice(at + separator.length)
              }
            }
          },
        },
        // naiveRulesPlugin(outputDir, {
        //   filter: (name: string) => name.endsWith('Request'),
        // }),
        defaultsPlugin(outputDir, {
          fileFieldNames: ['file', 'image'],
        }),
        toPlugin(outputDir, {
          // filter: (name: string) => name.endsWith('Request'),
          pk: [
            { pk: 'id', suffix: '_id', excludes: ['object_id'] },
            { pk: 'id', suffix: '_ids', isArray: true },
          ],
        }),
      ],

      /**
       * input file platform. Currently only swagger is supported.
       * When this parameter is specified, the input field only needs to specify the document address without specifying the openapi file
       */
      platform: 'swagger',

      /**
       * output path of interface file and type file.
       * Multiple generators cannot have the same address, otherwise the generated code will overwrite each other.
       */
      output: outputDir,

      /**
       * the mediaType of the generated response data. default is `application/json`
       */
      // responseMediaType: 'application/json',

      /**
       * the bodyMediaType of the generated request body data. default is `application/json`
       */
      // bodyMediaType: 'application/json',

      /**
       * the generated api version. options are `2` or `3`, default is `auto`.
       */
      // version: 'auto',

      /**
       * type of generated code. The options are `auto/ts/typescript/module/commonjs`
       */
      type: 'ts',

      /**
       * exported global api name, you can access the generated api globally through this name, default is `Apis`.
       * it is required when multiple generators are configured, and it cannot be repeated
       */
      // global: 'Apis',

      // globalHost: 'global',

      /**
       * filter or convert the generated api information, return an apiDescriptor, if this function is not specified, the apiDescriptor object is not converted
       */
      // handleApi: apiDescriptor => {
      //  return apiDescriptor;
      // }
    },
  ],

  /**
   * extension only
   * whether to automatically update the interface, enabled by default, check every 5 minutes, closed when set to `false`
   */
  // autoUpdate: true
})
