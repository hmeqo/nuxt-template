<template>
  <footer
    class="flex h-6 shrink-0 items-center gap-3 border-t border-line-1 bg-panel px-2.5 text-[11.5px] text-ink-3 select-none"
  >
    <slot />
    <div class="flex-1" />
    <slot name="end" />
  </footer>
</template>
