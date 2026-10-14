<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <caption data-slot="table-caption" :class="cn('mt-4 text-[13px] text-ink-2', props.class)">
    <slot />
  </caption>
</template>
