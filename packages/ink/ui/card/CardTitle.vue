<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="card-title"
    :class="
      cn(
        'text-[14px] font-[550] leading-snug tracking-[-0.005em] text-ink-1 group-data-[size=sm]/card:text-[13px]',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
