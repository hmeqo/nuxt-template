<script setup lang="ts">
import { niceScale } from '../utils/chart'

/**
 * 多序列始终堆叠（第一个序列在最底）；无数据时显示「暂无数据」。
 *
 * 玻璃面板（标题 + 每序列一行 + Total），不是 `InkTooltip`——它带 300ms 延迟与 focus 语义，
 * 图表要跟手，也不能被键盘焦点触发。
 *
 * 颜色由调用方给：一律从分类盘里取（`--series-1`、`--series-2`…，单序列/双序列就用前两档），
 * 多分类用 `chart-colors.ts` 的 `seriesColor()`；颜色随主题与强调色预设成套切换。
 *
 */
const props = withDefaults(
  defineProps<{
    buckets: { label: string }[]
    /** 序列；`values` 与 `buckets` 等长，`color` 传任意 CSS 颜色 */
    series: { key: string; label: string; color: string; values: number[] }[]
    height?: number
    /** tooltip 数值格式，默认 `formatCompact`；轴刻度固定用 `formatCompact` */
    formatValue?: (value: number) => string
  }>(),
  { height: 220 },
)

const PAD_TOP = 10
const PAD_BOTTOM = 24
const PAD_RIGHT = 8
const MIN_TICK_SPACING = 68
const Y_TICKS = 4
const MAX_BAR_W = 56

const root = ref<HTMLElement | null>(null)
const width = ref(0)
const hover = ref<number | null>(null)

let observer: ResizeObserver | undefined

onMounted(() => {
  const el = root.value
  if (!el) return
  width.value = el.clientWidth
  observer = new ResizeObserver((entries) => {
    width.value = Math.round(entries[0]?.contentRect.width ?? 0)
  })
  observer.observe(el)
})

onBeforeUnmount(() => observer?.disconnect())

const valueText = (value: number) => props.formatValue?.(value) ?? formatCompact(value)

const slots = computed(() => props.buckets.length)
const peak = computed(() => Math.max(0, ...props.buckets.map((_, i) => valueAt(i))))
const isEmpty = computed(() => slots.value === 0 || peak.value <= 0)

const scale = computed(() => niceScale(peak.value, Y_TICKS))
const tickLabels = computed(() => scale.value.ticks.map(formatCompact))
const padLeft = computed(() => Math.max(28, Math.max(...tickLabels.value.map((label) => label.length)) * 6.3 + 12))
const plotW = computed(() => Math.max(0, width.value - padLeft.value - PAD_RIGHT))
const plotH = computed(() => Math.max(1, props.height - PAD_TOP - PAD_BOTTOM))
const slotW = computed(() => (slots.value ? plotW.value / slots.value : 0))
const barW = computed(() => Math.max(1, Math.min(MAX_BAR_W, slotW.value * (slotW.value > 6 ? 0.72 : 0.9))))
const tickEvery = computed(() =>
  Math.max(1, Math.ceil(slots.value / Math.max(1, Math.floor(plotW.value / MIN_TICK_SPACING)))),
)

const cx = (index: number) => padLeft.value + (index + 0.5) * slotW.value
const yAt = (value: number) => PAD_TOP + plotH.value * (1 - value / scale.value.max)

/** 某个槽位的总量（负值按 0 算，避免堆叠出现负高度） */
function valueAt(index: number) {
  return props.series.reduce((sum, s) => sum + Math.max(0, s.values[index] ?? 0), 0)
}

function baseAt(index: number, seriesIndex: number) {
  let base = 0
  for (let i = 0; i < seriesIndex; i++) base += Math.max(0, props.series[i]!.values[index] ?? 0)
  return base
}

interface BarRect {
  key: string
  slot: number
  x: number
  y: number
  width: number
  height: number
  fill: string
}

const bars = computed<BarRect[]>(() => {
  const out: BarRect[] = []
  for (let slot = 0; slot < slots.value; slot++) {
    for (const [i, s] of props.series.entries()) {
      const value = Math.max(0, s.values[slot] ?? 0)
      // 0 值不画，否则会留下一条没有含义的 1px 柱子
      if (value <= 0) continue
      const base = baseAt(slot, i)
      const y0 = yAt(base)
      const y1 = yAt(base + value)
      out.push({
        key: `${s.key}-${slot}`,
        slot,
        x: cx(slot) - barW.value / 2,
        y: Math.min(y0, y1),
        width: Math.max(1, barW.value),
        height: Math.max(1, Math.abs(y0 - y1)),
        fill: s.color,
      })
    }
  }
  return out
})

const withTotal = computed(() => props.series.length > 1)

const hoverRows = computed(() => {
  const slot = hover.value
  if (slot === null) return []
  const rows = props.series
    .map((s) => ({ series: s, value: Math.max(0, s.values[slot] ?? 0) }))
    // 多序列时 0 值行是噪音（「草稿 0」），只有一个序列时保留它
    .filter((row) => row.value !== 0 || props.series.length === 1)
  return props.series.length > 1 ? rows.sort((a, b) => b.value - a.value) : rows
})

const hoverTotal = computed(() => hoverRows.value.reduce((sum, row) => sum + row.value, 0))

const tooltipStyle = computed(() => {
  const slot = hover.value
  if (slot === null) return {}
  const center = cx(slot)
  const gap = Math.min(slotW.value / 2, 24) + 8
  // 两种情形都只动 left，`transition-[left,top]` 才能一致地动画（用 right 定位时不会过渡）。
  return center > width.value / 2
    ? { left: `${center - gap}px`, top: `${PAD_TOP}px`, transform: 'translateX(-100%)' }
    : { left: `${center + gap}px`, top: `${PAD_TOP}px` }
})

/** 命中区在绘图区上铺一张透明 rect，用光标 x 反算槽位（不是每根柱一个热区） */
function move(event: PointerEvent) {
  const box = (event.currentTarget as SVGRectElement).getBoundingClientRect()
  if (!box.width || !slots.value) return
  const slot = Math.floor(((event.clientX - box.left) / box.width) * slots.value)
  hover.value = slot >= 0 && slot < slots.value ? slot : null
}

function leave() {
  hover.value = null
}

const ariaLabel = computed(() => `${props.series.map((s) => s.label).join('、')}，共 ${slots.value} 个区间`)
</script>

<template>
  <div ref="root" class="relative w-full" :data-hovering="hover !== null" :style="{ height: `${props.height}px` }">
    <div v-if="isEmpty" class="flex h-full items-center justify-center text-[12px] text-ink-3">暂无数据</div>

    <svg
      v-else-if="width > 0"
      :width="width"
      :height="props.height"
      class="block overflow-visible"
      role="img"
      :aria-label="ariaLabel"
    >
      <g>
        <line
          v-for="(tick, i) in scale.ticks"
          :key="`grid-${i}`"
          :x1="padLeft"
          :x2="padLeft + plotW"
          :y1="yAt(tick)"
          :y2="yAt(tick)"
          stroke="var(--chart-grid)"
          shape-rendering="crispEdges"
        />
      </g>

      <rect
        v-if="hover !== null"
        class="chart-cursor"
        :x="padLeft + hover * slotW"
        :y="PAD_TOP"
        :width="slotW"
        :height="plotH"
        fill="var(--chart-cursor)"
      />

      <rect
        v-for="bar in bars"
        :key="bar.key"
        class="chart-bar"
        :data-hover="hover === bar.slot"
        :x="bar.x"
        :y="bar.y"
        :width="bar.width"
        :height="bar.height"
        :fill="bar.fill"
        shape-rendering="crispEdges"
      />

      <line
        :x1="padLeft"
        :x2="padLeft + plotW"
        :y1="yAt(0)"
        :y2="yAt(0)"
        stroke="var(--line-3)"
        shape-rendering="crispEdges"
      />

      <g fill="var(--chart-axis)" class="font-mono text-[10.5px] tabular-nums">
        <text
          v-for="(label, i) in tickLabels"
          :key="`tick-${i}`"
          :x="padLeft - 8"
          :y="yAt(scale.ticks[i]!)"
          dy="0.32em"
          text-anchor="end"
        >
          {{ label }}
        </text>
        <template v-for="(bucket, i) in props.buckets" :key="`label-${i}`">
          <text v-if="i % tickEvery === 0" :x="cx(i)" :y="props.height - 6" text-anchor="middle">
            {{ bucket.label }}
          </text>
        </template>
      </g>

      <rect
        :x="padLeft"
        :y="PAD_TOP"
        :width="plotW"
        :height="plotH"
        fill="transparent"
        style="cursor: crosshair"
        @pointermove="move"
        @pointerleave="leave"
      />
    </svg>

    <div
      v-if="hover !== null && !isEmpty"
      data-chart-tooltip
      class="pointer-events-none absolute z-20 min-w-[160px] max-w-[280px] rounded-lg border border-line-2 bg-[var(--overlay)] px-2.5 py-2 text-[12px] shadow-[var(--shadow-2)] backdrop-blur-[14px] backdrop-saturate-[1.6] transition-[left,top] duration-[60ms] ease-linear"
      :style="tooltipStyle"
    >
      <div class="mb-1.5 font-mono text-[11px] text-ink-3">{{ props.buckets[hover]?.label }}</div>
      <!-- 多序列时 0 值行会被滤掉，全是 0 的桶只剩标题，读起来像坏了 -->
      <p v-if="!hoverRows.length" class="text-ink-3">无数据</p>
      <div v-for="row in hoverRows" :key="row.series.key" class="flex items-center gap-2 leading-[1.7]">
        <InkSwatch :color="row.series.color" />
        <span class="min-w-0 flex-1 truncate text-ink-2">{{ row.series.label }}</span>
        <span class="num text-ink-1">{{ valueText(row.value) }}</span>
      </div>
      <div v-if="withTotal && hoverRows.length > 1" class="mt-1 flex items-center gap-2 border-t border-line-1 pt-1">
        <span class="min-w-0 flex-1 text-ink-2">Total</span>
        <span class="num text-ink-1">{{ valueText(hoverTotal) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-bar {
  transition: opacity 120ms linear;
}

[data-hovering='true'] .chart-bar[data-hover='false'] {
  opacity: 0.45;
}
</style>
