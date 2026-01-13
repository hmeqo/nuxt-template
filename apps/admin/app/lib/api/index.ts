import { createAlovaHandlers, createEventSystem } from '@workspace-hmeqo/alova/lib'
import { getResponseData, toRequestInfo, toResponseInfo } from '@workspace-hmeqo/alova/lib/adapter/fetch'
import { createAlova } from 'alova'
import fetchAdapter from 'alova/fetch'
import VueHook from 'alova/vue'
import { createApis, mountApis, withConfigType } from './createApis'

export const eventSystem = createEventSystem()

const handlers = createAlovaHandlers(eventSystem.emit)

export const alovaInstance = createAlova({
  baseURL: '',
  statesHook: VueHook,
  requestAdapter: fetchAdapter(),
  beforeRequest(method) {
    Object.assign(method.config.headers, {
      [useCsrf?.().headerName || 'X-CSRFToken']: useCookie('csrftoken').value,
    })
    handlers.beforeRequest(toRequestInfo(method))
  },
  cacheFor: null,
  responded: {
    async onSuccess(response, method) {
      return handlers.onSuccess(toResponseInfo(response), toRequestInfo(method), getResponseData(response))
    },
    onError(error, method) {
      return handlers.onError(error, toRequestInfo(method), getResponseData(error.response))
    },
    onComplete(method) {
      return handlers.onComplete(toRequestInfo(method))
    },
  },
})

export const $$userConfigMap = withConfigType({})

export const Apis = createApis(alovaInstance, $$userConfigMap)

mountApis(Apis)

export const useClient = defineCachedFn(() => ({
  eventSystem,
  alovaInstance,
  Apis,
}))

export default Apis
