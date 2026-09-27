<script setup lang="ts">
import { iconMap } from './icon-map'

const route = useRoute()

defineProps<{
  collapsed: boolean
  items: Array<{ label: string; icon: string; to: string }>
}>()

function isActive(item: { to: string }): boolean {
  if (item.to === '/') return route.path === '/'
  return route.path.startsWith(item.to)
}
</script>

<template>
  <nav class="flex-1 space-y-0.5 p-2">
    <AppSidebarItem
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      :label="item.label"
      :icon="iconMap[item.icon]"
      :collapsed="collapsed"
      :active="isActive(item)"
    />
  </nav>
</template>
