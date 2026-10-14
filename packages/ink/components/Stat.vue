<script setup lang="ts">
import type { Component } from 'vue'

/**
 * 分隔线靠 1px 阴影画，所以放在最后一行/列的格子也有一致的边线。
 *
 * 顺序照 omp：label → value → foot → spark。foot 在 spark 之前，没有趋势线的格子
 * 说明文字才不会跟有趋势线的格子错开一行；spark 收尾锚住格子底部。
 *
 * 插槽优先于 prop：`#value` 覆盖 `value`（放骨架屏等富内容），`#foot` 覆盖 `foot`（放徽标等富内容）。
 * 值用 `tabular-nums` 而不是 `.num`：`.num` 会把字号缩到 0.93em，指标数字要保持 24px。
 *
 * `spark` 是值下方的迷你趋势线（omp stats `.stat-spark`）；全 0 序列不渲染，省得留一块空白。
 */
defineProps<{
  label: string
  value: string | number
  foot?: string
  icon?: Component
  spark?: number[]
}>()
</script>

<template>
  <div class="flex min-w-0 flex-col gap-1.5 px-4 pt-3.5 pb-3 shadow-[1px_0_0_var(--line-1),0_1px_0_var(--line-1)]">
    <p class="flex items-center gap-1.5 text-[12.5px] font-medium text-ink-2">
      <!-- 图标上抬 1px：`items-center` 对齐的是行盒中心，而文字的光学中心（cap 中线）偏高 ~0.8px -->
      <component :is="icon" v-if="icon" class="size-3.5 flex-none -translate-y-px text-ink-2" />
      {{ label }}
    </p>
    <div
      class="overflow-hidden text-[24px] leading-[1.15] font-medium tracking-[-0.025em] tabular-nums text-ellipsis whitespace-nowrap text-ink-1"
    >
      <slot name="value">{{ value }}</slot>
    </div>
    <div class="flex min-h-[18px] items-center gap-2 text-[12px] text-ink-3">
      <slot name="foot">{{ foot }}</slot>
    </div>
    <InkSparkline v-if="spark?.some((value) => value > 0)" :values="spark" class="mt-0.5" />
  </div>
</template>
