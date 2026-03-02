export default defineNuxtRouteMiddleware(() => {
  useAuthSession().ensureAuth()
})
