import type { RequestInfo, ResponseInfo } from '@ws-hmeqo/alova/types'

declare module '@ws-hmeqo/alova/types' {
  export interface AlovaCustomTypeMeta {
    noMessage?: (e: { request: RequestInfo; response?: ResponseInfo }) => boolean
  }
}
