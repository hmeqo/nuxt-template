<script setup lang="ts">
import type { AvatarFallbackProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AvatarFallback } from 'reka-ui'
import { cn } from '../../utils/cn'

const props = defineProps<AvatarFallbackProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <AvatarFallback
    data-slot="avatar-fallback"
    v-bind="delegatedProps"
    :class="
      cn(
        'bg-raised text-ink-2 rounded-full flex size-full items-center justify-center text-[13px] group-data-[size=sm]/avatar:text-[11px]',
        props.class,
      )
    "
  >
    <slot />
  </AvatarFallback>
</template>
