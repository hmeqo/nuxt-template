<script setup lang="ts">
import { isSeparator, type DesktopMenu, type DesktopMenuAction } from '~/lib/desktop'

/**
 * 键盘：Escape 收起，←/→ 切换顶层菜单，↑/↓ 移动高亮，Enter 执行；子菜单只走指针。
 */
const props = defineProps<{ items: DesktopMenu[] }>()
const emit = defineEmits<{ select: [id: string] }>()

const root = useTemplateRef<HTMLElement>('root')
const openIndex = ref<number | null>(null)
const cursorId = ref<string | null>(null)

const openItems = computed(() => (openIndex.value === null ? [] : (props.items[openIndex.value]?.items ?? [])))
const navigable = computed<DesktopMenuAction[]>(() =>
  openItems.value.filter((entry): entry is DesktopMenuAction => !isSeparator(entry) && !entry.disabled),
)

function openAt(index: number) {
  openIndex.value = index
  cursorId.value = null
}

function close() {
  openIndex.value = null
  cursorId.value = null
}

function toggle(index: number) {
  if (openIndex.value === index) close()
  else openAt(index)
}

function hoverTop(index: number) {
  if (openIndex.value !== null) openAt(index)
}

function run(id: string) {
  close()
  emit('select', id)
}

function moveCursor(step: number) {
  const list = navigable.value
  if (!list.length) return

  const index = list.findIndex((entry) => entry.id === cursorId.value)
  cursorId.value = list[(index + step + list.length) % list.length]?.id ?? null
}

function onWindowKeydown(event: KeyboardEvent) {
  if (openIndex.value === null) return

  switch (event.key) {
    case 'Escape':
      close()
      break
    case 'ArrowRight':
      openAt((openIndex.value + 1) % props.items.length)
      break
    case 'ArrowLeft':
      openAt((openIndex.value - 1 + props.items.length) % props.items.length)
      break
    case 'ArrowDown':
      moveCursor(1)
      break
    case 'ArrowUp':
      moveCursor(-1)
      break
    case 'Enter': {
      const entry = navigable.value.find((item) => item.id === cursorId.value)
      if (entry) run(entry.id)
      break
    }
    default:
      return
  }

  event.preventDefault()
}

function onPointerDown(event: PointerEvent) {
  if (openIndex.value === null) return
  if (!root.value?.contains(event.target as Node)) close()
}

watch(openIndex, (value) => {
  if (value === null) window.removeEventListener('keydown', onWindowKeydown, true)
  else window.addEventListener('keydown', onWindowKeydown, true)
})

onMounted(() => document.addEventListener('pointerdown', onPointerDown))
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('keydown', onWindowKeydown, true)
})
</script>

<template>
  <nav ref="root" class="flex items-center">
    <div v-for="(menu, index) in items" :key="menu.label" class="relative">
      <button
        type="button"
        class="h-6 rounded px-2 text-[12.5px] text-ink-2 transition-colors hover:bg-line-2 hover:text-ink-1"
        :class="openIndex === index && 'bg-line-3 text-ink-1'"
        :aria-expanded="openIndex === index"
        @click="toggle(index)"
        @pointerenter="hoverTop(index)"
      >
        {{ menu.label }}
      </button>

      <div
        v-if="openIndex === index"
        class="absolute top-[calc(100%+5px)] left-0 z-50 flex flex-col rounded-md border border-line-2 bg-raised p-1 shadow-(--shadow-2)"
      >
        <DesktopMenuItem
          v-for="(entry, entryIndex) in menu.items"
          :key="entryIndex"
          :entry="entry"
          :cursor-id="cursorId"
          @select="run"
          @highlight="cursorId = $event"
        />
      </div>
    </div>
  </nav>
</template>
