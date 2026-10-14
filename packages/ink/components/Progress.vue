<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../utils/cn'

const props = withDefaults(
  defineProps<{
    value: number
    max?: number
    class?: HTMLAttributes['class']
  }>(),
  {
    max: 100,
  },
)

const percent = computed(() => {
  const max = props.max > 0 ? props.max : 1
  if (!Number.isFinite(props.value) || !Number.isFinite(max)) return 0
  return Math.max(0, Math.min(100, (props.value / max) * 100))
})
</script>

<template>
  <span :class="cn('relative block h-1 overflow-hidden rounded-[2px] bg-line-1', props.class)">
    <span
      class="absolute inset-y-0 left-0 rounded-[2px] transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :style="{ width: `${percent}%`, background: 'var(--brand)' }"
    />
  </span>
</template>
