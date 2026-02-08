import type { RequestInfo, ResponseInfo } from '@workspace-hmeqo/alova/types'

declare module '@workspace-hmeqo/alova/types' {
  export interface AlovaCustomTypeMeta {
    noMessage?: (e: { request: RequestInfo; response?: ResponseInfo }) => boolean
  }
}
