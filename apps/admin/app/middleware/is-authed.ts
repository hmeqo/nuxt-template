export default defineNuxtRouteMiddleware(() => {
  useAuthSession().ensureAuth({
    onFailure() {
      navigateTo(getLoginUrl())
    },
  })
})
