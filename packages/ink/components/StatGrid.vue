<script setup lang="ts">
/**
 *
 * 格子宽度由 `min` 决定（写到 `--console-stat-min`，默认 170px），
 * 刻度不足一行时自动换行，格与格之间的分隔线由 `InkStat` 的阴影画。
 */
withDefaults(defineProps<{ min?: number }>(), { min: 170 })
</script>

<template>
  <div
    class="hairline grid overflow-hidden rounded-xl bg-card shadow-[var(--shadow-1)]"
    :style="{
      gridTemplateColumns: 'repeat(auto-fit, minmax(var(--console-stat-min), 1fr))',
      '--console-stat-min': `${min}px`,
    }"
  >
    <slot />
  </div>
</template>
