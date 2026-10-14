<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-4 pb-1">
    <div class="min-w-0">
      <h1 class="text-[22px] leading-[1.2] font-semibold tracking-[-0.02em]">{{ title }}</h1>
      <p v-if="description" class="mt-1 max-w-[72ch] text-sm text-ink-3">{{ description }}</p>
    </div>
    <div v-if="$slots.action" class="flex flex-wrap items-center gap-2">
      <slot name="action" />
    </div>
  </div>
</template>
