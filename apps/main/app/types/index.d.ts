export {}

declare module '@nuxt/schema' {
  interface AppConfigInput {
    tauriApp?: {
      name?: string
      navigation?: Array<{ label: string; icon: string; to: string }>
    }
  }
}
