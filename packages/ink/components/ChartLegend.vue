<script setup lang="ts">
/**
 *
 * 没传就是纯静态说明。不用原生 `title`：名称本来就在眼前。
 */
const props = defineProps<{
  items: { key: string; label: string; color: string; value?: string }[]
  /** 已隐藏的 key；传了（哪怕是空数组）就让每一项可点 */
  hidden?: string[]
}>()

const emit = defineEmits<{ toggle: [key: string] }>()

const interactive = computed(() => props.hidden !== undefined)
const isHidden = (key: string) => props.hidden?.includes(key) ?? false
</script>

<template>
  <div class="flex flex-wrap gap-x-3.5 gap-y-1 text-[12px] text-ink-2">
    <template v-for="item in props.items" :key="item.key">
      <component
        :is="interactive ? 'button' : 'span'"
        class="inline-flex max-w-60 items-center gap-1.5"
        :class="interactive ? 'transition-opacity hover:text-ink-1' : undefined"
        :type="interactive ? 'button' : undefined"
        :data-off="interactive ? isHidden(item.key) : undefined"
        :aria-pressed="interactive ? !isHidden(item.key) : undefined"
        v-on="interactive ? { click: () => emit('toggle', item.key) } : {}"
      >
        <InkSwatch :color="item.color" />
        <span class="truncate">{{ item.label }}</span>
        <span v-if="item.value" class="mono text-[11.5px] text-ink-3">{{ item.value }}</span>
      </component>
    </template>
  </div>
</template>

<style scoped>
[data-off='true'] {
  opacity: 0.38;
}
</style>
