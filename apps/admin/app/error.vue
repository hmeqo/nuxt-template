<script setup lang="ts">
const error = useError()

const statusCode = computed(() => error.value?.status ?? 500)
const message = computed(() => error.value?.message || '未知错误')

const icon = computed(() => {
  if (statusCode.value === 404) return 'material-symbols:search-off'
  if (statusCode.value === 403) return 'material-symbols:block'
  if (statusCode.value === 500) return 'material-symbols:error-outline'
  return 'material-symbols:warning-outline'
})
</script>

<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-8">
    <div class="flex flex-col items-center text-center max-w-xs gap-4">
      <Icon :name="icon" class="size-16 text-muted-foreground/30" />
      <div>
        <p class="text-5xl font-bold text-muted-foreground/20">{{ statusCode }}</p>
        <p class="text-sm text-muted-foreground mt-2">{{ message }}</p>
      </div>
      <div class="flex items-center gap-2 pt-2">
        <NuxtLink to="/">
          <UiButton variant="outline" size="sm">主页</UiButton>
        </NuxtLink>
        <UiButton variant="ghost" size="sm" @click="clearError({ redirect: '/' })">重试</UiButton>
      </div>
    </div>
  </div>
</template>
