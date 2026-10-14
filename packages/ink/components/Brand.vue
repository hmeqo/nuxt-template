<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../utils/cn'

/**
 * 纯几何（矩形 + 圆角），16px 到 64px 都清楚，不依赖任何图片资源。
 */
const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const uid = useId()
const gradientId = `brand-tick-${uid.replace(/[^a-zA-Z0-9]/g, '')}`
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" :class="cn('shrink-0', props.class)">
    <defs>
      <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" style="stop-color: var(--brand-a)" />
        <stop offset="1" style="stop-color: var(--brand-b)" />
      </linearGradient>
    </defs>
    <rect x="2.9" y="2.9" width="18.2" height="18.2" rx="5.4" class="stroke-line-3" stroke-width="1.6" />
    <rect x="7.2" y="7.6" width="9.6" height="1.9" rx="0.95" class="fill-ink-3" />
    <rect x="7.2" y="11.05" width="6.2" height="1.9" rx="0.95" :style="{ fill: `url(#${gradientId})` }" />
    <rect x="7.2" y="14.5" width="7.8" height="1.9" rx="0.95" class="fill-ink-4" />
  </svg>
</template>
