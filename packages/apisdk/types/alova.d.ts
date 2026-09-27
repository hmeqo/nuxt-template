import type { RequestInfo, ResponseInfo } from '@remqo/alova/types'

declare module '@remqo/alova/types' {
  export interface AlovaCustomTypeMeta {
    noMessage?: (e: { request: RequestInfo; response?: ResponseInfo }) => boolean
  }
}
