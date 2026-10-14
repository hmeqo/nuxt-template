import { getResponseData, toRequestInfo, toResponseInfo } from '@remqo/alova/adapter/fetch'
import { createAlovaHandlers, createEventSystem } from '@remqo/alova/lib'
import { createAlova } from 'alova'
import fetchAdapter from 'alova/fetch'
import VueHook from 'alova/vue'
import { createApis, mountApis, withConfigType } from './createApis'

export const eventSystem = createEventSystem()

const handlers = createAlovaHandlers(eventSystem.emit)

export const alovaInstance = createAlova({
  // 不设 baseURL：请求走同源 /api，由各 app 的 server/api 代理到 runtimeConfig.apiBase
  statesHook: VueHook,
  requestAdapter: fetchAdapter(),
  beforeRequest(method) {
    Object.assign(method.config.headers, {
      [useCsrf?.().headerName || 'X-Csrftoken']: useCookie('csrftoken').value,
    })
    handlers.beforeRequest(toRequestInfo(method))
  },
  cacheFor: null,
  responded: {
    async onSuccess(response, method) {
      return handlers.onSuccess(toResponseInfo(response), toRequestInfo(method), await getResponseData(response))
    },
    async onError(error, method) {
      return handlers.onError(error, toRequestInfo(method), await getResponseData(error.response))
    },
    onComplete(method) {
      return handlers.onComplete(toRequestInfo(method))
    },
  },
})

export const $$userConfigMap = withConfigType({})

const Apis = createApis(alovaInstance, $$userConfigMap)

mountApis(Apis)

export const useClient = defineCachedFn(() => ({
  eventSystem,
  alovaInstance,
  Apis,
}))

export default Apis
