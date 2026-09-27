<script setup lang="ts">
defineProps<{
  collapsed: boolean
  name: string
}>()
</script>

<template>
  <AppSidebarItem
    variant="plain"
    class="flex items-center border-b border-sidebar-border p-2"
    label-class="ml-2.5 text-sm font-semibold text-sidebar-foreground"
    :collapsed="collapsed"
    :label="name"
    data-tauri-drag-region
  >
    <template #icon>
      <div class="p-2 rounded-lg bg-sidebar-primary">
        <div class="flex size-5 shrink-0 items-center justify-center text-sidebar-primary-foreground text-xs font-bold">
          A
        </div>
      </div>
    </template>
  </AppSidebarItem>
</template>
