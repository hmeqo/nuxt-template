export default defineNuxtRouteMiddleware(() => {
  useAuthSession().ensureAuth()
  const { isAuthenticated } = useAuthPerms()
  return routeAuth([{ auth: [isAuthenticated], to: getHomeUrl() }])
})
