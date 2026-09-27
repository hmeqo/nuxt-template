<script setup lang="ts">
import { Sun, Moon, PanelRight, PanelLeft } from '@lucide/vue'

defineProps<{
  collapsed: boolean
  isAuthenticated: boolean
  username?: string
  darkMode: boolean
}>()

const emit = defineEmits<{
  toggleTheme: []
  toggleCollapse: []
}>()
</script>

<template>
  <div class="border-t border-sidebar-border p-2 space-y-0.5">
    <AppSidebarItem
      variant="action"
      :collapsed="collapsed"
      :icon="darkMode ? Sun : Moon"
      :label="darkMode ? 'Light' : 'Dark'"
      @click="emit('toggleTheme')"
    />

    <AppSidebarItem
      v-if="isAuthenticated"
      variant="plain"
      class="flex h-9 w-full items-center justify-start px-2 rounded-lg text-sm text-sidebar-foreground/70"
      :collapsed="collapsed"
      :label="username ?? 'User'"
    >
      <template #icon>
        <div
          class="flex size-5 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/20 text-sidebar-foreground text-[10px] font-medium"
        >
          {{ username?.slice(0, 2).toUpperCase() ?? 'U' }}
        </div>
      </template>
    </AppSidebarItem>

    <AppSidebarItem
      variant="action"
      :collapsed="collapsed"
      :icon="collapsed ? PanelRight : PanelLeft"
      label="Collapse"
      @click="emit('toggleCollapse')"
    />
  </div>
</template>
