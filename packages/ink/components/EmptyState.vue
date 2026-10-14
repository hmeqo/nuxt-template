<script setup lang="ts">
import { Inbox } from '@lucide/vue'
import type { Component } from 'vue'

withDefaults(
  defineProps<{
    title: string
    description?: string
    icon?: Component
  }>(),
  {
    icon: () => Inbox,
  },
)
</script>

<template>
  <div class="flex min-h-[140px] flex-col items-center justify-center gap-1.5 px-4 py-10 text-center text-ink-3">
    <component :is="icon" class="mb-1 h-6 w-6 text-ink-4" />
    <p class="text-[13px] font-medium text-ink-2">{{ title }}</p>
    <p v-if="description" class="max-w-[44ch] text-[12.5px]">{{ description }}</p>
    <div v-if="$slots.action" class="mt-3">
      <slot name="action" />
    </div>
  </div>
</template>
