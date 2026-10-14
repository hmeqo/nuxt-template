<script setup lang="ts">
/**
 * 纯文本编辑器：`<textarea>` 直接吃键盘，不做富文本/语法高亮。
 * 父级用 `:key="tab.id"` 让它随标签页重建，切页后光标位置自然归零。
 */
const value = defineModel<string>({ required: true })

const props = withDefaults(defineProps<{ wrap?: boolean; fontSize?: number }>(), { wrap: true, fontSize: 13 })
const emit = defineEmits<{ cursor: [position: { line: number; column: number }] }>()

const area = useTemplateRef<HTMLTextAreaElement>('area')

function reportCursor() {
  const el = area.value
  if (!el) return

  const lines = el.value.slice(0, el.selectionStart).split('\n')
  emit('cursor', { line: lines.length, column: (lines[lines.length - 1]?.length ?? 0) + 1 })
}

function focus() {
  area.value?.focus()
}

onMounted(reportCursor)
defineExpose({ focus, reportCursor })
</script>

<template>
  <textarea
    ref="area"
    v-model="value"
    spellcheck="false"
    autocapitalize="off"
    autocomplete="off"
    class="h-full w-full resize-none bg-transparent px-4 py-3 font-mono text-ink-1 outline-none select-text"
    :style="{
      fontSize: `${props.fontSize}px`,
      lineHeight: 1.75,
      whiteSpace: props.wrap ? 'pre-wrap' : 'pre',
      overflowWrap: props.wrap ? 'anywhere' : 'normal',
    }"
    @click="reportCursor"
    @keyup="reportCursor"
    @select="reportCursor"
    @input="reportCursor"
  />
</template>
