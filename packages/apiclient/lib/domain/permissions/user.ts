const IsLoggedIn = createPermission(
  (() => {
    let authCached = false
    return () => {
      const authState = useAuthState()

      if (!authCached)
        Apis.auth
          .me()
          .then((data) => authState.login(data))
          .catch(({ response }) => {
            if (response.status !== 401) return
            authState.logout()
            if (useRoute().path !== getLoginUrl()) redirectTo(getLoginUrl())
          })
          .finally(() => (authCached = true))

      return authState.isLoggedIn()
    }
  })(),
)

export const IsAuthenticated = IsLoggedIn
// export const IsSuperUser = createPermission(() => IsLoggedIn.verify() && !!useAuthState().user()?.is_superuser)
// export const IsStaff = createPermission(() => IsSuperUser.verify() || !!useAuthState().user()?.is_staff)
