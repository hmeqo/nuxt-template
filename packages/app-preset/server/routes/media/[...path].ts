// 用 handler 而不是 routeRules.proxy：代理目标要能在运行时被 NUXT_PUBLIC_MEDIA_BASE 覆盖
export default defineEventHandler((event) => {
  const runtimeConfig = useRuntimeConfig()
  return proxyRequest(event, `${runtimeConfig.public.mediaBase}${event.path.replace(/^\/media/, '')}`)
})
