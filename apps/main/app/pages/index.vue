<script setup lang="ts">
import { FolderOpen } from '@lucide/vue'

const { active, cursor, openFile } = useWorkspace()
const { wrap, fontSize } = useEditorPrefs()
</script>

<template>
  <DesktopEditor
    v-if="active"
    :key="active.id"
    v-model="active.text"
    :wrap="wrap"
    :font-size="fontSize"
    @cursor="cursor = $event"
  />

  <div v-else class="flex h-full flex-col items-center justify-center gap-3 text-center">
    <FolderOpen class="size-7 text-ink-4" />
    <div>
      <p class="text-[13px] font-medium text-ink-2">还没有打开的文档</p>
      <p class="mt-1 max-w-[46ch] text-[12.5px] text-ink-3">
        把文件拖进窗口，或用 <span class="font-mono">Ctrl+O</span> 从磁盘打开一个文本文件。
      </p>
    </div>
    <UiButton size="sm" variant="outline" @click="openFile">打开文件…</UiButton>
  </div>
</template>
