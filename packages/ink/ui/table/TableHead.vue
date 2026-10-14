<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <th
    data-slot="table-head"
    :class="
      cn(
        'sticky top-0 z-1 h-8 bg-card px-3 text-left align-middle text-[12px] font-medium text-ink-2 whitespace-nowrap border-b border-line-1 first:pl-4 last:pr-4 [&:has([role=checkbox])]:pr-0',
        props.class,
      )
    "
  >
    <slot />
  </th>
</template>
