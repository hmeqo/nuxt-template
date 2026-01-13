import type { AuthStateResponse } from '~/types'

export const useAuthState = defineCachedFn(() => {
  const state = useCookie('auth', {
    default: (): AuthStateResponse | null => null,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 3650,
  })
  const actions = {
    getUser() {
      return state.value?.user
    },
    getUserUnchecked() {
      return state.value!.user
    },
    setState(_state: AuthStateResponse) {
      state.value = _state
    },
    isLoggedIn() {
      return !!state.value?.user
    },
    reset() {
      state.value = null
    },
  }
  return {
    state,
    ...actions,
  }
})
