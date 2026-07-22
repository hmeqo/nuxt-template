import { BizError } from '@ws-hmeqo/alova/lib'

export default defineNuxtPlugin(() => {
  const authState = useAuthState()

  defineAuthAdapter({
    url: {
      login: getLoginUrl(),
      home: getHomeUrl(),
    },
    isAuthenticated() {
      return !!authState.user()
    },
    async init() {
      try {
        const data = await Apis.auth.me({ meta: { noMessage: ({ response }) => response?.status === 401 } })
        authState.login(data)
      } catch (err) {
        if (err instanceof BizError && err.response.status === 401) {
          authState.logout()
        }
      }
    },
    getPermissions() {
      return authState.permissions() ?? []
    },
    checkPermission(permissions, required) {
      const reqs = Array.isArray(required) ? required : [required]
      return reqs.every((r) =>
        permissions.some(
          (p) => p === '*' || p === 'admin' || p === r || (p.endsWith(':*') && r.startsWith(p.slice(0, -2))),
        ),
      )
    },
  })
})
