<script setup lang="ts">
/**
 *
 * 宽度用自己的 `ResizeObserver` 量容器（不用 viewBox 拉伸：拉伸会把描边一起拉变形）；
 * 数据为空或全 0 时不画路径，只留占位高度，免得画出一条贴底的假线。
 */
const props = withDefaults(
  defineProps<{
    values: number[]
    height?: number
    color?: string
  }>(),
  { height: 28, color: 'var(--series-1)' },
)

const root = ref<HTMLElement | null>(null)
const width = ref(0)

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

const max = computed(() => Math.max(0, ...props.values))

const line = computed(() => {
  const w = width.value
  const n = props.values.length
  if (w <= 0 || n === 0 || max.value <= 0) return ''
  const height = props.height
  const step = n > 1 ? w / (n - 1) : 0
  let d = ''
  for (let i = 0; i < n; i++) {
    const x = n > 1 ? i * step : w / 2
    const y = height - 2 - (props.values[i]! / max.value) * (height - 4)
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
  }
  return d
})

const area = computed(() => (line.value ? `${line.value}L${width.value},${props.height}L0,${props.height}Z` : ''))
</script>

<template>
  <div ref="root" class="w-full" :style="{ height: `${props.height}px` }">
    <svg v-if="line" :width="width" :height="props.height" class="block" aria-hidden="true">
      <path :d="area" :fill="props.color" fill-opacity="0.14" />
      <path
        :d="line"
        fill="none"
        :stroke="props.color"
        stroke-width="1.5"
        stroke-linejoin="round"
        stroke-linecap="round"
        vector-effect="non-scaling-stroke"
      />
    </svg>
  </div>
</template>
