<script setup lang="ts">
import { Copy, Minus, Square, X } from '@lucide/vue'

const { isMaximized, minimize, toggleMaximize, close } = useWindowControls()

/** 30px 方形命中区，和顶栏 h-9 一起撑满右侧；关闭键另给一发红色反馈 */
const controlClass =
  'inline-flex size-7.5 items-center justify-center rounded-lg text-ink-2 cursor-pointer transition-colors'
const buttonClass = `${controlClass} hover:bg-line-2 hover:text-ink-1`
const closeClass = `${controlClass} hover:bg-bad-soft hover:text-bad`
</script>

<template>
  <div v-if="isTauri" class="flex shrink-0 items-center gap-1">
    <button type="button" aria-label="最小化" :class="buttonClass" @click.stop="minimize">
      <Minus class="size-3.5" />
    </button>
    <button type="button" aria-label="最大化/还原" :class="buttonClass" @click.stop="toggleMaximize">
      <Copy v-if="isMaximized" class="size-3.5" />
      <Square v-else class="size-3.5" />
    </button>
    <button type="button" aria-label="关闭" :class="closeClass" @click.stop="close">
      <X class="size-3.5" />
    </button>
  </div>
</template>
