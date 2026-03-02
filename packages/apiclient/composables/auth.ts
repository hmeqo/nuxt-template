import { BizError } from '@workspace-hmeqo/alova/lib'

export const useAuthSession = defineCachedFn(() => {
  const checkAuth = async () => {
    const { login, logout } = useAuthState()
    const { isAuthenticated } = useAuthPerms()
    await Apis.auth
      .me({ meta: { noMessage: ({ response }) => response?.status === 401 } })
      .then((data) => login(data))
      .catch((err) => {
        if (!(err instanceof BizError)) return
        if (err.response.status === 401) logout()
      })
    return isAuthenticated.value
  }

  let authed = false
  const ensureAuth = () => {
    if (authed) return
    checkAuth().then((isAuthenticated) => {
      authed = isAuthenticated
    })
  }

  return {
    checkAuth,
    ensureAuth,
  }
})

export const useAuthPerms = defineCachedFn(() => {
  const perms = {
    isAuthenticated: computed(() => !!useAuthState().user()),
  }
  return perms
})
