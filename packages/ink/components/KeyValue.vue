<script setup lang="ts">
defineProps<{ items: { key: string; value?: string }[] }>()
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-x-4 gap-y-3">
    <div v-for="item in items" :key="item.key" class="flex min-w-0 flex-col gap-0.5">
      <p class="text-[12px] text-ink-3">{{ item.key }}</p>
      <div class="mono min-w-0 text-ink-1 wrap-anywhere">
        <slot name="value" :item="item">{{ item.value ?? '—' }}</slot>
      </div>
    </div>
  </div>
</template>
