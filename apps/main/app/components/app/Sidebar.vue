<script setup lang="ts">
const { collapsed, toggle } = useSidebar()
const { tauriApp } = useAppConfig()
const { isAuthenticated } = useAuthPerms()
const authState = useAuthState()
const { darkMode } = useThemeMode()

const navItems = computed(() => tauriApp.navigation ?? [])
const user = computed(() => authState.user())
</script>

<template>
  <aside
    class="relative flex flex-col border-r bg-sidebar overflow-hidden transition-all duration-200 select-none"
    :class="collapsed ? 'w-[53px]' : 'w-56'"
  >
    <AppSidebarHeader :collapsed="collapsed" :name="tauriApp.name ?? 'App'" />
    <AppSidebarNav :collapsed="collapsed" :items="navItems" />
    <AppSidebarFooter
      :collapsed="collapsed"
      :is-authenticated="isAuthenticated"
      :username="user?.username"
      :dark-mode="darkMode"
      @toggle-theme="darkMode = !darkMode"
      @toggle-collapse="toggle"
    />
  </aside>
</template>
