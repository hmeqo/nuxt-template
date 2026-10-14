<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../utils/cn'

const props = withDefaults(
  defineProps<{
    color: string
    size?: number
    class?: HTMLAttributes['class']
  }>(),
  {
    size: 8,
  },
)
</script>

<template>
  <span
    :class="cn('inline-block flex-none rounded-[2px]', props.class)"
    :style="{ width: `${props.size}px`, height: `${props.size}px`, background: props.color }"
  />
</template>
