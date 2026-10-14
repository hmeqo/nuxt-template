<script setup lang="ts">
/**
 *
 * 分工：占比条用 `InkShareBar`、图例用 `InkChartLegend`，由卡片自己拼（omp 也是这么拼的）；
 */
const props = defineProps<{
  section?: string
  /** 右侧数值列；`cells` 与之一一对应，缺省全部当 `ink-3` 左对齐 */
  columns?: { align?: 'left' | 'right'; tone?: 'ink-1' | 'ink-2' | 'ink-3' }[]
  items: { key: string; label: string; color?: string; note?: string; cells?: (string | number)[] }[]
}>()

const TONES = { 'ink-1': 'text-ink-1', 'ink-2': 'text-ink-2', 'ink-3': 'text-ink-3' } as const

function cellClass(index: number) {
  const column = props.columns?.[index]
  return [TONES[column?.tone ?? 'ink-3'], column?.align === 'right' ? 'min-w-[48px] text-right' : '']
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <p v-if="props.section" class="text-[12px] font-medium text-ink-3">{{ props.section }}</p>

    <div class="flex flex-col gap-1">
      <div v-for="item in props.items" :key="item.key" class="flex h-[22px] w-full items-center justify-between gap-2">
        <span class="flex min-w-0 items-center gap-2">
          <InkSwatch v-if="item.color" :color="item.color" />
          <span class="truncate text-[12.5px] text-ink-1">{{ item.label }}</span>
          <span v-if="item.note" class="num flex-none text-ink-3">{{ item.note }}</span>
        </span>
        <span class="flex flex-none items-center gap-2.5">
          <span v-for="(cell, i) in item.cells ?? []" :key="i" class="num" :class="cellClass(i)">{{ cell }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
