<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from '../../utils/cn'
import { useFormField } from './useFormField'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const { formDescriptionId } = useFormField()
</script>

<template>
  <p :id="formDescriptionId" data-slot="form-description" :class="cn('text-[12.5px] text-ink-2', props.class)">
    <slot />
  </p>
</template>
