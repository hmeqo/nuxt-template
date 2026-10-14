import type { ConsoleConfig, ConsoleNavGroup, ConsoleNavItem } from '../types/console'

export function useConsoleNav() {
  // 宿主不一定声明 `console`（纯桌面壳就没有），所以按可选读，缺失时退回默认
  const appConfig = useAppConfig() as { console?: ConsoleConfig }
  const route = useRoute()

  const name = computed(() => appConfig.console?.name ?? 'Console')
  const groups = computed<ConsoleNavGroup[]>(() => appConfig.console?.nav ?? [])
  const items = computed<ConsoleNavItem[]>(() => groups.value.flatMap((group) => group.items))

  function isActive(to: string) {
    if (to === '/') return route.path === '/'
    return route.path === to || route.path.startsWith(`${to}/`)
  }

  const activeItem = computed(() => items.value.find((item) => isActive(item.to)))

  return { name, groups, isActive, activeItem }
}
