<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tr
    data-slot="table-row"
    :class="
      cn('data-[state=selected]:bg-selected hover:bg-hover has-aria-expanded:bg-hover transition-colors', props.class)
    "
  >
    <slot />
  </tr>
</template>
