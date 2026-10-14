<script setup lang="ts">
import { Plus, X } from '@lucide/vue'
import type { DesktopTab } from '~/lib/desktop'

const props = defineProps<{ tabs: DesktopTab[]; activeId: string | null }>()
const emit = defineEmits<{ select: [id: string]; close: [id: string]; create: [] }>()

function onPointerDown(event: PointerEvent, tab: DesktopTab) {
  if (event.button === 1) {
    event.preventDefault()
    emit('close', tab.id)
  }
}
</script>

<template>
  <div class="relative z-10 flex h-9 shrink-0 items-stretch border-b border-line-1 bg-chassis select-none">
    <div class="flex min-w-0 flex-1 items-stretch overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="group relative flex min-w-0 max-w-60 shrink-0 cursor-default items-center gap-2 border-r border-line-1 py-0 pr-8 pl-3 text-[12.5px] transition-colors"
        :class="tab.id === activeId ? 'bg-panel text-ink-1' : 'text-ink-3 hover:bg-line-1 hover:text-ink-2'"
        :title="tab.path ?? tab.title"
        @click="emit('select', tab.id)"
        @pointerdown="onPointerDown($event, tab)"
      >
        <span
          v-if="tab.id === activeId"
          class="absolute inset-x-0 top-0 h-[2px] bg-linear-to-r from-brand-a to-brand-b"
        />

        <span class="truncate">{{ tab.title }}</span>

        <span v-if="tab.dirty" class="size-1.5 shrink-0 rounded-full bg-ink-4 group-hover:hidden" />

        <button
          type="button"
          class="absolute right-1 hidden size-5 items-center justify-center rounded-sm text-ink-3 transition-colors group-hover:inline-flex hover:bg-raised hover:text-ink-1"
          :class="tab.id === activeId && 'inline-flex'"
          :aria-label="`关闭 ${tab.title}`"
          @click.stop="emit('close', tab.id)"
        >
          <X class="size-3.5" />
        </button>
      </div>
    </div>

    <button
      type="button"
      class="flex w-9 shrink-0 items-center justify-center border-l border-line-1 text-ink-3 transition-colors hover:bg-line-2 hover:text-ink-1"
      aria-label="新建文档"
      @click="emit('create')"
    >
      <Plus class="size-4" />
    </button>
  </div>
</template>
