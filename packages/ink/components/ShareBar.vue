<script setup lang="ts">
/**
 *
 * 颜色由调用方给（多分类走 `chart-colors.ts`）。值为 0 的段不画，否则会留下一条看不见的 2px 段；
 */
const props = withDefaults(
  defineProps<{
    segments: { key: string; label: string; value: number; color: string }[]
    height?: number
  }>(),
  { height: 8 },
)

const total = computed(() => props.segments.reduce((sum, s) => sum + Math.max(0, s.value), 0))
const visible = computed(() => props.segments.filter((s) => s.value > 0))
const share = (value: number) => (total.value > 0 ? (value / total.value) * 100 : 0)

const ariaLabel = computed(() => visible.value.map((s) => `${s.label} ${share(s.value).toFixed(1)}%`).join('，'))
</script>

<template>
  <div
    class="flex w-full gap-0.5 overflow-hidden rounded-[3px] bg-line-1"
    :style="{ height: `${props.height}px` }"
    role="img"
    :aria-label="ariaLabel"
  >
    <InkTooltip
      v-for="segment in visible"
      :key="segment.key"
      :content="`${segment.label} · ${segment.value}（${share(segment.value).toFixed(1)}%）`"
      side="top"
    >
      <span
        class="block h-full min-w-[2px] transition-[flex-grow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        :style="{ flexGrow: segment.value, background: segment.color }"
      />
    </InkTooltip>
  </div>
</template>
