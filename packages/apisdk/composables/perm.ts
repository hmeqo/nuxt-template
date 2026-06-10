import type Types from '../lib/api/globals'

function permsMatch(selfCode: string, targetCode: string): boolean {
  if (selfCode === '*' || selfCode === 'admin') return true
  if (selfCode === targetCode) return true
  const prefix = selfCode.endsWith(':*') ? selfCode.slice(0, -2) : null
  if (prefix) {
    const targetPrefix = targetCode.split(':')[0]
    if (prefix === targetPrefix) return true
  }
  return false
}

export const useAuthPerms = defineCachedFn(() => {
  const authState = useAuthState()
  const perms = computed(() => authState.permissions() ?? [])

  const isAuthenticated = computed(() => !!authState.user())
  const isSuperuser = computed(() => perms.value.includes('*'))

  function hasPermission(perm: Types.Perm): boolean {
    return perms.value.some((p) => permsMatch(p, perm))
  }

  function requirePermission(perm: Types.Perm): void {
    if (!hasPermission(perm)) {
      throw navigateTo('/')
    }
  }

  return {
    isAuthenticated,
    isSuperuser,
    perms,
    hasPermission,
    requirePermission,
  }
})
