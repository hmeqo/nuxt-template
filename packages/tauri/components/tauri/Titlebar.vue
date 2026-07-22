<script setup lang="ts">
import { AppWindow } from '@lucide/vue'

withDefaults(
  defineProps<{
    title?: string
  }>(),
  { title: 'App' },
)
</script>

<template>
  <div
    v-if="isTauri"
    class="flex h-10 shrink-0 items-center border-b bg-background px-3 select-none"
  >
    <div class="flex h-full flex-1 items-center gap-2 text-sm font-medium text-muted-foreground" data-tauri-drag-region>
      <AppWindow class="size-4 shrink-0" />
      <span>{{ title }}</span>
    </div>
    <TauriAppButtons />
  </div>
</template>
