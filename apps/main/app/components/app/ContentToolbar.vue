<template>
  <div
    v-if="isTauri"
    class="flex h-10 shrink-0 items-center border-b bg-background px-4"
  >
    <div class="flex h-full flex-1 items-center" data-tauri-drag-region />
    <TauriAppButtons />
  </div>
</template>
