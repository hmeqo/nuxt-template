<script setup lang="ts">
import { Monitor, Moon, Sun } from '@lucide/vue'

/** 明暗主题选择（浅色 / 深色 / 跟随系统），走 nuxt-color-mode 的偏好。 */
const { colorModePreference } = useThemeMode()

const options = [
  { value: 'light', label: '浅色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'system', label: '跟随系统', icon: Monitor },
]
</script>

<template>
  <InkSegmented v-model="colorModePreference" :options="options" aria-label="主题" />
</template>
