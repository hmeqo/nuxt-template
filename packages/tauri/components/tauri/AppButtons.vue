<script setup lang="ts">
const isMaximized = ref(false)

async function getCurrentWindow() {
  const { getCurrentWindow } = await import('@tauri-apps/api/window')
  return getCurrentWindow()
}

async function minimize() {
  ;(await getCurrentWindow()).minimize()
}

async function toggleMaximize() {
  ;(await getCurrentWindow()).toggleMaximize()
}

async function close() {
  ;(await getCurrentWindow()).close()
}

onMounted(async () => {
  if (!isTauri) return
  const appWindow = await getCurrentWindow()
  appWindow.onResized(
    useDebounceFn(async () => {
      isMaximized.value = await appWindow.isMaximized()
    }, 50),
  )
  isMaximized.value = await appWindow.isMaximized()
})
</script>

<template>
  <div v-if="isTauri" class="flex shrink-0 items-center gap-1">
    <div
      class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
      @click.stop="minimize"
    >
      <span class="icon-[material-symbols--chrome-minimize] size-3.5" />
    </div>
    <div
      class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
      @click.stop="toggleMaximize"
    >
      <span v-if="isMaximized" class="icon-[material-symbols--chrome-restore-outline-sharp] size-3.5" />
      <span v-else class="icon-[material-symbols--chrome-maximize-outline-sharp] size-3.5" />
    </div>
    <div
      class="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
      @click.stop="close"
    >
      <span class="icon-[material-symbols--close] size-3.5" />
    </div>
  </div>
</template>
