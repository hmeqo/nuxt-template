<script setup lang="ts">
import { iconMap } from './icon-map'

const route = useRoute()

defineProps<{
  collapsed: boolean
  items: Array<{ label: string; icon: string; to: string }>
}>()

const activeStyle = 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
const inactiveStyle = 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'

function isActive(item: { to: string }): boolean {
  if (item.to === '/') return route.path === '/'
  return route.path.startsWith(item.to)
}
</script>

<template>
  <nav class="flex-1 space-y-0.5 p-2">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="flex items-center justify-start p-2 rounded-lg text-sm transition-colors"
      :class="isActive(item) ? activeStyle : inactiveStyle"
    >
      <component :is="iconMap[item.icon]" class="size-5 shrink-0" />
      <Transition name="fade">
        <span v-if="!collapsed" class="ml-3 truncate">{{ item.label }}</span>
      </Transition>
    </NuxtLink>
  </nav>
</template>
