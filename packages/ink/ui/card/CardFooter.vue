<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="card-footer"
    :class="
      cn(
        'rounded-b-xl border-t border-line-1 px-4 py-2.5 text-[12.5px] text-ink-2 group-data-[size=sm]/card:px-3.5 flex items-center',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
