<script setup lang="ts">
import { Layers } from '@lucide/vue'
import type { FileResp } from '@ws/apisdk/types'

const props = defineProps<{ records: readonly FileResp[] }>()

/** 一张图里最多几个分类色：5 档 + 「其他」（Atlassian/Cloudscape 建议 ≤5–6 档） */
const TYPE_ROLLUP_LIMIT = 5

const groups = computed(() => rollupFileTypes(fileTypeBreakdown(props.records), TYPE_ROLLUP_LIMIT))

/** 文件类型固定按排名配色：同一个类型在文件页各处同色 */
const colors = computed(() =>
  buildColorLookup(
    groups.value.filter((item) => item.label !== OTHER_LABEL).map((item) => ({ key: item.label, weight: item.value })),
  ),
)
const colorOf = (label: string) => colors.value.get(label) ?? OTHER_COLOR
const segments = computed(() =>
  groups.value.map((item) => ({ key: item.label, label: item.label, value: item.value, color: colorOf(item.label) })),
)
const legend = computed(() =>
  groups.value.map((item) => ({ key: item.label, label: item.label, color: colorOf(item.label), value: item.hint })),
)

/** 右侧两列：体积（次要）+ 占比（重点，右对齐） */
const columns = [{ tone: 'ink-3' as const }, { tone: 'ink-1' as const, align: 'right' as const }]
const rows = computed(() =>
  groups.value.map((item) => ({
    key: item.label,
    label: item.label,
    color: colorOf(item.label),
    note: `${item.value} 个`,
    cells: [formatSize(item.bytes), item.hint],
  })),
)
</script>

<template>
  <UiCard v-if="groups.length">
    <UiCardHeader>
      <UiCardTitle class="flex items-center gap-2">
        <Layers class="size-3.5 text-ink-2" />
        文件类型
      </UiCardTitle>
      <UiCardDescription>按文件扩展名聚合的文件数。</UiCardDescription>
    </UiCardHeader>
    <UiCardContent class="flex flex-col gap-3">
      <InkShareBar :segments="segments" />
      <InkChartLegend :items="legend" />
      <InkBreakdown section="按类型" :columns="columns" :items="rows" />
    </UiCardContent>
  </UiCard>
</template>
