<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <thead data-slot="table-header" :class="cn('[&_tr]:border-b [&_tr]:border-line-1', props.class)">
    <slot />
  </thead>
</template>
