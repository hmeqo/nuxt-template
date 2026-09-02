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
    <button
      class="flex h-9 w-full items-center justify-start px-2 rounded-lg text-sm transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      @click="emit('toggleTheme')"
    >
      <component :is="darkMode ? Sun : Moon" class="size-5 shrink-0" />
      <Transition name="fade">
        <span v-if="!collapsed" class="ml-3 truncate">{{ darkMode ? 'Light' : 'Dark' }}</span>
      </Transition>
    </button>

    <div
      v-if="isAuthenticated"
      class="flex h-9 w-full items-center justify-start px-2 rounded-lg text-sm text-sidebar-foreground/70"
    >
      <div
        class="flex size-5 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/20 text-sidebar-foreground text-[10px] font-medium"
      >
        {{ username?.slice(0, 2).toUpperCase() ?? 'U' }}
      </div>
      <Transition name="fade">
        <span v-if="!collapsed" class="ml-3 truncate">{{ username ?? 'User' }}</span>
      </Transition>
    </div>

    <button
      class="flex h-9 w-full items-center justify-start px-2 rounded-lg text-sm transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      @click="emit('toggleCollapse')"
    >
      <component :is="collapsed ? PanelRight : PanelLeft" class="size-5 shrink-0" />
      <Transition name="fade">
        <span v-if="!collapsed" class="ml-3 truncate">Collapse</span>
      </Transition>
    </button>
  </div>
</template>
