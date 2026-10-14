<script setup lang="ts">
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'reka-ui'
import type { DesktopMenu, DesktopTab } from '~/lib/desktop'

defineProps<{
  appName: string
  menus: DesktopMenu[]
  tabs: DesktopTab[]
  activeId: string | null
}>()

const emit = defineEmits<{
  menuSelect: [id: string]
  tabSelect: [id: string]
  tabClose: [id: string]
  tabCreate: []
}>()

const sidebar = defineModel<boolean>('sidebar', { default: true })
const dock = defineModel<boolean>('dock', { default: true })
</script>

<template>
  <div class="relative flex h-dvh flex-col overflow-hidden bg-chassis text-ink-1">
    <div class="ambient" />

    <header
      class="relative z-30 flex h-9 shrink-0 items-center gap-2 border-b border-line-1 bg-panel pr-px pl-2.5 select-none"
    >
      <InkBrand class="size-4 shrink-0" />
      <span class="shrink-0 text-[12.5px] font-semibold tracking-[-0.01em]">{{ appName }}</span>

      <DesktopMenuBar :items="menus" @select="emit('menuSelect', $event)" />

      <TauriDragRegion class="h-full min-w-4 flex-1" />

      <slot name="toolbar" />

      <TauriWindowControls />
    </header>

    <DesktopTabStrip
      :tabs="tabs"
      :active-id="activeId"
      @select="emit('tabSelect', $event)"
      @close="emit('tabClose', $event)"
      @create="emit('tabCreate')"
    />

    <SplitterGroup direction="horizontal" class="relative z-0 min-h-0 flex-1">
      <SplitterPanel v-if="sidebar" :order="1" :default-size="20" :min-size="14" :max-size="45" class="min-w-0">
        <aside class="flex h-full flex-col overflow-hidden border-r border-line-1 bg-panel">
          <slot name="sidebar" />
        </aside>
      </SplitterPanel>

      <SplitterResizeHandle v-if="sidebar" class="pane-resizer" />

      <SplitterPanel :order="2" :min-size="25" class="min-w-0">
        <main class="flex h-full min-h-0 flex-col overflow-hidden bg-panel">
          <slot />
        </main>
      </SplitterPanel>

      <SplitterResizeHandle v-if="dock" class="pane-resizer" />

      <SplitterPanel v-if="dock" :order="3" :default-size="22" :min-size="16" :max-size="45" class="min-w-0">
        <aside class="flex h-full flex-col overflow-y-auto border-l border-line-1 bg-panel">
          <slot name="dock" />
        </aside>
      </SplitterPanel>
    </SplitterGroup>

    <DesktopStatusBar class="relative z-20">
      <slot name="status" />
      <template #end>
        <slot name="status-end" />
      </template>
    </DesktopStatusBar>

    <InkPrompt />
  </div>
</template>
