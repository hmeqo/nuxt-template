<script setup lang="ts">
import { Check } from '@lucide/vue'
import { isSeparator, shortcutLabel, type DesktopMenuEntry } from '~/lib/desktop'

/** 一条菜单项：图标位兼作勾选位，`cursorId` 是面板下发的键盘/指针游标。 */
const props = defineProps<{ entry: DesktopMenuEntry; cursorId?: string | null }>()
const emit = defineEmits<{ select: [id: string]; highlight: [id: string] }>()

const highlighted = computed(() => {
  const entry = props.entry
  return !isSeparator(entry) && props.cursorId === entry.id
})

function onSelect() {
  const entry = props.entry
  if (isSeparator(entry) || entry.disabled) return
  emit('select', entry.id)
}
</script>

<template>
  <div v-if="isSeparator(entry)" class="my-1 h-px bg-line-1" />

  <button
    v-else
    type="button"
    class="flex h-7 w-full min-w-52 items-center gap-2 rounded-sm px-2 text-left text-[12.5px] transition-colors"
    :class="[entry.disabled ? 'text-ink-4' : 'text-ink-1', highlighted ? 'bg-line-2' : 'hover:bg-line-2']"
    :disabled="entry.disabled"
    @pointerenter="emit('highlight', entry.id)"
    @click="onSelect"
  >
    <Check v-if="entry.checked" class="size-3.5 shrink-0 text-brand" />
    <component :is="entry.icon" v-else-if="entry.icon" class="size-3.5 shrink-0 text-ink-3" />
    <span v-else class="size-3.5 shrink-0" />

    <span class="truncate">{{ entry.label }}</span>

    <span v-if="entry.shortcut" class="ml-auto pl-6 font-mono text-[11px] text-ink-4">
      {{ shortcutLabel(entry.shortcut) }}
    </span>
  </button>
</template>
