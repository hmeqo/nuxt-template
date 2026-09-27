<script setup lang="ts">
import { SearchX, Ban, TriangleAlert, CircleAlert, Home, RotateCcw } from '@lucide/vue'

const error = useError()

const statusCode = computed(() => error.value?.status ?? 500)
const message = computed(() => error.value?.message || 'An unexpected error occurred')

const iconComponent = computed(() => {
  if (statusCode.value === 404) return SearchX
  if (statusCode.value === 403) return Ban
  if (statusCode.value === 500) return TriangleAlert
  return CircleAlert
})
</script>

<template>
  <div class="h-screen flex items-center justify-center bg-background">
    <div class="flex flex-col items-center text-center max-w-xs gap-4">
      <div class="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <component :is="iconComponent" class="size-8 text-muted-foreground/60" />
      </div>
      <div>
        <p class="text-5xl font-bold text-muted-foreground/20 tabular-nums">{{ statusCode }}</p>
        <p class="text-sm text-muted-foreground mt-2">{{ message }}</p>
      </div>
      <div class="flex items-center gap-2 pt-2">
        <NuxtLink to="/">
          <UiButton variant="outline" size="sm">
            <Home class="size-4" />
            Home
          </UiButton>
        </NuxtLink>
        <UiButton variant="ghost" size="sm" @click="clearError({ redirect: '/' })">
          <RotateCcw class="size-4" />
          Retry
        </UiButton>
      </div>
    </div>
  </div>
</template>
