<script setup lang="ts">
import { Palette } from '@lucide/vue'
</script>

<template>
  <UiCard>
    <UiCardHeader>
      <UiCardTitle class="flex items-center gap-2">
        <Palette class="size-3.5 text-ink-2" />
        外观
      </UiCardTitle>
      <UiCardDescription>选择界面明暗，改动立即生效并记住在这台设备上</UiCardDescription>
    </UiCardHeader>
    <UiCardContent class="space-y-3">
      <div class="space-y-1.5">
        <p class="text-xs text-ink-3">主题</p>
        <InkThemePicker />
      </div>
      <div class="space-y-1.5">
        <p class="text-xs text-ink-3">强调色</p>
        <InkAccentPicker />
      </div>
    </UiCardContent>
  </UiCard>
</template>
