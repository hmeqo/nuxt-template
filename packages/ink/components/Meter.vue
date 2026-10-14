<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../utils/cn'

const props = defineProps<{
  value: number
  /** 同一列的基准值（通常是这列的最大值） */
  max: number
  format?: (value: number) => string
  class?: HTMLAttributes['class']
}>()

const text = computed(() => {
  if (!Number.isFinite(props.value)) return '—'
  return props.format ? props.format(props.value) : String(props.value)
})
</script>

<template>
  <div :class="cn('flex items-center justify-end gap-2.5', props.class)">
    <span class="num text-ink-1">{{ text }}</span>
    <InkProgress class="w-16 flex-none" :value="props.value" :max="props.max" />
  </div>
</template>
