<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <span
    data-slot="context-menu-shortcut"
    :class="
      cn(
        'ml-auto font-mono text-[11px] tracking-widest text-ink-2 group-focus/context-menu-item:text-ink-1',
        props.class,
      )
    "
  >
    <slot />
  </span>
</template>
