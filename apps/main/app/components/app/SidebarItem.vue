<script setup lang="ts">
import type { Component } from 'vue'
import { NuxtLink } from '#components'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  collapsed: boolean
  variant?: 'nav' | 'action' | 'plain'
  icon?: Component
  to?: string
  active?: boolean
  labelClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'nav',
  labelClass: 'ml-2',
})

const ROW = {
  nav: 'flex items-center justify-start p-2 rounded-lg text-sm transition-colors',
  action:
    'flex h-9 w-full items-center justify-start px-2 rounded-lg text-sm transition-colors text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
  plain: '',
}

const NAV_STATE = {
  active: 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
  inactive: 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
}

const tag = computed(() => {
  if (props.variant === 'action') return 'button'
  if (props.variant === 'plain') return 'div'
  return NuxtLink
})

const rowClass = computed(() =>
  cn(ROW[props.variant], props.variant === 'nav' && (props.active ? NAV_STATE.active : NAV_STATE.inactive)),
)
</script>

<template>
  <component
    :is="tag"
    :to="tag === NuxtLink ? to : undefined"
    :type="variant === 'action' ? 'button' : undefined"
    :class="rowClass"
  >
    <slot name="icon">
      <component :is="icon" v-if="icon" class="size-5 shrink-0" />
    </slot>
    <Transition name="fade">
      <span v-if="!collapsed" :class="cn('truncate', labelClass)">{{ label }}</span>
    </Transition>
  </component>
</template>
