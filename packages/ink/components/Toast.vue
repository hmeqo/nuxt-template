<script setup lang="ts">
import type { ToastRootEmits } from 'reka-ui'
import { reactiveOmit } from '@vueuse/core'
import { ToastRoot, useForwardPropsEmits } from 'reka-ui'
import { cn } from '../utils/cn'
import type { ToastProps } from '../utils/toast'

const props = defineProps<ToastProps>()

const emits = defineEmits<ToastRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <ToastRoot v-bind="forwarded" :class="cn(toastVariants({ variant }), props.class)" @update:open="onOpenChange">
    <slot />
  </ToastRoot>
</template>
