import type { AuthStateResp } from '@ws/apisdk/types'

export const useAuthState = defineCachedFn(() => {
  const state = useState<AuthStateResp | null>('auth', () => null)
  const cookie = useCookie('auth', {
    default: (): AuthStateResp | null => null,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })
  state.value = cookie.value
  watch(state, (v) => {
    cookie.value = v
  })

  const actions = {
    state() {
      return state.value
    },
    stateChecked() {
      if (!state.value) throw new Error('Auth state is not set')
      return state.value
    },
    login(s: AuthStateResp) {
      state.value = s
    },
    logout() {
      state.value = null
    },

    user() {
      return state.value?.user
    },
    userChecked() {
      if (!state.value?.user) throw new Error('User is not logged in')
      return state.value?.user || null
    },
    isSelf(userId: number) {
      return state.value?.user?.id === userId
    },

    permissions() {
      return state.value?.permissions
    },
  }
  return actions
})
