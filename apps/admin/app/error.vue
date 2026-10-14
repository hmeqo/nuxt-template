<script setup lang="ts">
const error = useError()

const title = computed(() => {
  if (error.value?.statusCode === 404) return '找不到这个页面'
  if (error.value?.statusCode === 403) return '没有访问权限'
  if ((error.value?.statusCode ?? 500) >= 500) return '服务暂时不可用'
  return '出了点问题'
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background p-4">
    <div class="flex max-w-sm flex-col items-start gap-3">
      <p class="text-4xl font-bold tabular-nums">{{ error?.statusCode ?? 500 }}</p>
      <p class="text-sm font-medium">{{ title }}</p>
      <p v-if="error?.message" class="font-mono text-xs text-muted-foreground/60">{{ error.message }}</p>
      <div class="mt-2 flex items-center gap-3">
        <UiButton @click="clearError({ redirect: '/' })">返回主页</UiButton>
        <UiButton variant="outline" @click="clearError()">重试</UiButton>
      </div>
    </div>
  </div>
</template>
