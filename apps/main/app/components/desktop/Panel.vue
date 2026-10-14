<script setup lang="ts">
import { ChevronDown } from '@lucide/vue'

const open = defineModel<boolean>('open', { default: true })

defineProps<{ title: string }>()
</script>

<template>
  <section class="border-b border-line-1 last:border-b-0">
    <header class="flex h-8 items-center gap-1.5 pr-2 pl-3">
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-1.5 text-left text-[11px] font-medium tracking-[0.04em] text-ink-3 uppercase transition-colors hover:text-ink-1"
        :aria-expanded="open"
        @click="open = !open"
      >
        <ChevronDown class="size-3.5 shrink-0 transition-transform" :class="!open && '-rotate-90'" />
        <span class="truncate">{{ title }}</span>
      </button>
      <slot name="actions" />
    </header>

    <div v-if="open" class="flex flex-col gap-2.5 px-3 pb-3">
      <slot />
    </div>
  </section>
</template>
