<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '../../utils/cn'

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    :class="
      cn(
        'h-[30px] w-full min-w-0 rounded-lg border border-line-2 bg-card px-2.5 text-[13px] text-ink-1 transition-colors outline-none file:h-6 file:border-0 file:bg-transparent file:inline-flex file:text-[12.5px] file:font-medium file:text-ink-1 placeholder:text-ink-4 focus-visible:border-focus focus-visible:ring-[3px] focus-visible:ring-focus/18 aria-invalid:border-bad aria-invalid:ring-[3px] aria-invalid:ring-bad/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50',
        props.class,
      )
    "
  />
</template>
