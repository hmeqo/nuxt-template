<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div data-slot="card-description" :class="cn('text-[12.5px] text-ink-3', props.class)">
    <slot />
  </div>
</template>
