<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../utils/cn'

const props = withDefaults(
  defineProps<{
    tone?: 'neutral' | 'outline' | 'brand' | 'ok' | 'warn' | 'bad'
    class?: HTMLAttributes['class']
  }>(),
  {
    tone: 'neutral',
  },
)

const VARIANTS = {
  neutral: 'secondary',
  outline: 'outline',
  brand: 'brand',
  ok: 'success',
  warn: 'warn',
  bad: 'bad',
} as const
</script>

<template>
  <UiBadge :variant="VARIANTS[props.tone]" :class="cn('gap-1.5', props.class)">
    <slot />
  </UiBadge>
</template>
