<script setup lang="ts">
/**
 * 只在「指针悬停」时打开的 tooltip。
 *
 * 为什么不用 reka 的原生行为：它 `focus` 也会打开，点过按钮/链接后元素仍持有焦点，
 * 窗口失焦再回来时浏览器会重发 focus，tooltip 就会自己冒出来。
 * 这里用受控 `open` 过滤：只有悬停期间接受的 true 才算数，focus 触发的直接丢掉。
 *
 * 延迟交给 `UiTooltipProvider` 的 `delay-duration`（app.vue 里 300ms）——不要自己再起一个定时器，
 * 否则第一次开是 `instant-open`（不带动画），随后 reka 的 `delayed-open` 会把进入动画**重放**一遍，看起来就是先完整再闪一下。
 */
const props = withDefaults(
  defineProps<{
    content: string
    side?: 'top' | 'right' | 'bottom' | 'left'
    disabled?: boolean
  }>(),
  {
    side: 'top',
  },
)

const open = ref(false)
const hovering = ref(false)

function enter() {
  hovering.value = true
}

function leave() {
  hovering.value = false
  open.value = false
}

function updateOpen(value: boolean) {
  if (value && (props.disabled || !hovering.value)) return
  open.value = value
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) leave()
  },
)
</script>

<template>
  <UiTooltip :open="open" @update:open="updateOpen">
    <UiTooltipTrigger as-child @pointerenter="enter" @pointerleave="leave" @click="leave" @blur="leave">
      <slot />
    </UiTooltipTrigger>
    <UiTooltipContent :side="props.side" class="z-[80]">{{ props.content }}</UiTooltipContent>
  </UiTooltip>
</template>
