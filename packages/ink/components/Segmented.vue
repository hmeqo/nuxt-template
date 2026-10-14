<script setup lang="ts">
import type { Component } from 'vue'

const props = defineProps<{
  modelValue: string
  options: { value: string; label: string; icon?: Component; swatch?: string }[]
  ariaLabel?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const root = ref<HTMLElement | null>(null)
const thumb = ref<{ left: number; width: number } | null>(null)

function measure() {
  const active = root.value?.querySelector<HTMLElement>('[data-active="true"]')
  if (!active) {
    thumb.value = null
    return
  }
  thumb.value = { left: active.offsetLeft, width: active.offsetWidth }
}

let observer: ResizeObserver | undefined

onMounted(() => {
  observer = new ResizeObserver(measure)
  if (root.value) observer.observe(root.value)
  nextTick(measure)
})

onBeforeUnmount(() => observer?.disconnect())

watch(
  () => [props.modelValue, props.options],
  () => nextTick(measure),
  { deep: true },
)
</script>

<template>
  <div
    ref="root"
    class="relative isolate inline-flex items-center gap-0 rounded-lg border border-line-2 bg-card p-0.5"
    role="radiogroup"
    :aria-label="props.ariaLabel"
  >
    <span
      v-if="thumb"
      class="absolute top-0.5 bottom-0.5 z-[-1] rounded-md border border-line-3 bg-raised shadow-[0_1px_2px_rgba(0,0,0,0.25)] transition-[left,width] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :style="{ left: `${thumb.left}px`, width: `${thumb.width}px` }"
    />
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] font-medium whitespace-nowrap transition-colors hover:text-ink-1"
      :class="option.value === modelValue ? 'text-primary' : 'text-ink-2'"
      :data-active="option.value === modelValue"
      :aria-checked="option.value === modelValue"
      role="radio"
      @click="emit('update:modelValue', option.value)"
    >
      <component :is="option.icon" v-if="option.icon" class="h-3.5 w-3.5" />
      <InkSwatch v-if="option.swatch" :color="option.swatch" :size="12" class="rounded-full" />
      {{ option.label }}
    </button>
  </div>
</template>
