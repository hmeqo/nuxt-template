import type { AuthStateResponse } from '~/types'

export const useAuthState = defineCachedFn(() => {
  const state = useState<AuthStateResponse | null>('auth', () => null)
  const cookie = useCookie('auth', {
    default: (): AuthStateResponse | null => null,
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
    login(_state: AuthStateResponse) {
      state.value = _state
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
    isLoggedIn() {
      return !!state.value?.user
    },
    isSelf(userId: number) {
      return state.value?.user?.id === userId
    },
  }
  return actions
})
