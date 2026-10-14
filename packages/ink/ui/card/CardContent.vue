<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="card-content"
    :class="cn('p-[14px_16px_16px] group-data-[size=sm]/card:p-[12px_14px_14px]', props.class)"
  >
    <slot />
  </div>
</template>
