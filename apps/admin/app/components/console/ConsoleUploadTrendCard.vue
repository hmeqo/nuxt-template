<script setup lang="ts">
import { TrendingUp } from '@lucide/vue'
import type { FileResp } from '@ws/apisdk/types'

const props = defineProps<{ records: readonly FileResp[] }>()

/** 上传趋势按 state 拆成两列堆叠：色值取分类盘前两档（随主题/强调色预设成套切换） */
const uploadBins = computed(() => dailyStateBins(props.records))
const buckets = computed(() => uploadBins.value.map((bin) => ({ label: bin.label })))
const series = computed(() => [
  { key: 'attached', label: '已附加', color: 'var(--series-1)', values: uploadBins.value.map((bin) => bin.attached) },
  { key: 'draft', label: '草稿', color: 'var(--series-2)', values: uploadBins.value.map((bin) => bin.draft) },
])
const hidden = ref<string[]>([])
const visibleSeries = computed(() => series.value.filter((s) => !hidden.value.includes(s.key)))
const legend = computed(() =>
  series.value.map((s) => ({
    key: s.key,
    label: s.label,
    color: s.color,
    value: `${s.values.reduce((sum, value) => sum + value, 0)} 条`,
  })),
)

function toggle(key: string) {
  hidden.value = hidden.value.includes(key) ? hidden.value.filter((item) => item !== key) : [...hidden.value, key]
}
</script>

<template>
  <UiCard>
    <UiCardHeader>
      <UiCardTitle class="flex items-center gap-2">
        <TrendingUp class="size-3.5 text-ink-2" />
        上传趋势
      </UiCardTitle>
      <UiCardDescription>最近 14 天每天上传的条数，按草稿 / 已附加拆开。</UiCardDescription>
    </UiCardHeader>
    <UiCardContent class="flex flex-col gap-2.5">
      <InkChartLegend :items="legend" :hidden="hidden" @toggle="toggle" />
      <InkBarChart :buckets="buckets" :series="visibleSeries" :format-value="(value) => `${value} 条`" />
    </UiCardContent>
  </UiCard>
</template>
