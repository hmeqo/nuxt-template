<script setup lang="ts">
defineProps<{
  collapsed: boolean
  name: string
}>()
</script>

<template>
  <div class="flex items-center border-b border-sidebar-border p-2" data-tauri-drag-region>
    <div class="p-2 rounded-lg bg-sidebar-primary">
      <div class="flex size-5 shrink-0 items-center justify-center text-sidebar-primary-foreground text-xs font-bold">
        A
      </div>
    </div>
    <Transition name="fade">
      <span v-if="!collapsed" class="ml-2.5 text-sm font-semibold text-sidebar-foreground truncate">{{ name }}</span>
    </Transition>
  </div>
</template>
